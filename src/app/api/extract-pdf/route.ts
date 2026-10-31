import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer } from "@/lib/pdfParser";
import { DocumentKind } from "@/lib/types";

/**
 * ============================================================================
 * Zero-Retention 内存即焚 PDF 提取网关 (/api/extract-pdf)
 * ============================================================================
 * 1. 绝不写入本地磁盘或数据库，仅在 RAM 中读取 ArrayBuffer 提取后立即释放。
 * 2. 内置单 IP 频率限制，防止黑产恶意消耗 API。
 * 3. 未配置 OPENROUTER_API_KEY 时，自动走本地 unpdf 零成本文本解析器！
 */

const ipHistory = new Map<string, number[]>();
const MAX_UPLOADS_PER_HOUR = 20;

function checkIpLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHistory.get(ip) || []).filter(
    (t) => now - t < 60 * 60 * 1000
  );
  if (recent.length >= MAX_UPLOADS_PER_HOUR) {
    ipHistory.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipHistory.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!checkIpLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Hourly trial upload limit reached. Upgrade to SMB Monthly ($19/mo) for high-volume batch extraction.",
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const docKind =
      (formData.get("documentKind") as DocumentKind) || "bank_statement";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided." },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF exceeds 15MB maximum upload size." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const document = await parsePdfBuffer(arrayBuffer, file.name, docKind);

    if (document.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "No structured transaction rows detected in text layer. If this is an image-only paper scan, add OPENROUTER_API_KEY in .env.local to enable Gemini 2.5 Flash Vision OCR.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ document });
  } catch (err) {
    console.error("/api/extract-pdf error:", err);
    return NextResponse.json(
      { error: "Could not read PDF file. Ensure the PDF is not password-encrypted." },
      { status: 500 }
    );
  }
}
