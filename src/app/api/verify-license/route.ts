import { NextRequest, NextResponse } from "next/server";

/**
 * ============================================================================
 * 免数据库订单激活码与 License 核验网关 (/api/verify-license)
 * ============================================================================
 * 让零代码独立开发者无需维护复杂的用户数据库也能实现 100% 商业交付：
 * 1. 支持 Creem.io 官方 License Key 在线校验（当配置了 CREEM_API_KEY 时）
 * 2. 内置可自定义的商户发放激活码，客户输入即可立即到账对应页数！
 */

const BUILTIN_LICENSE_PASSCODES: Record<
  string,
  { pages: number; planName: string }
> = {
  "SF-TAX80-2026": { pages: 80, planName: "Tax Season Pass (80 Pages)" },
  "SF-SMB250-2026": { pages: 250, planName: "SMB Monthly (250 Pages)" },
  "SF-CPA1200-2026": { pages: 1200, planName: "CPA Pro (1,200 Pages)" },
};

export async function POST(req: NextRequest) {
  try {
    const { licenseKey } = await req.json();
    const cleaned = String(licenseKey || "")
      .trim()
      .toUpperCase();

    if (!cleaned) {
      return NextResponse.json(
        { error: "Please enter a valid license or order key." },
        { status: 400 }
      );
    }

    // 1. Check built-in / custom env passcodes
    if (BUILTIN_LICENSE_PASSCODES[cleaned]) {
      const match = BUILTIN_LICENSE_PASSCODES[cleaned];
      return NextResponse.json({
        verified: true,
        pagesAdded: match.pages,
        planName: match.planName,
      });
    }

    // 2. Check Creem.io License API if configured
    const creemKey = process.env.CREEM_API_KEY;
    if (creemKey) {
      const res = await fetch("https://api.creem.io/v1/licenses/validate", {
        method: "POST",
        headers: {
          "x-api-key": creemKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: cleaned }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.valid || data?.status === "active") {
          return NextResponse.json({
            verified: true,
            pagesAdded: 250,
            planName: "Verified Creem License",
          });
        }
      }
    }

    return NextResponse.json(
      {
        error:
          "License key not recognized. Check your receipt email or contact support.",
      },
      { status: 404 }
    );
  } catch (err) {
    console.error("/api/verify-license error:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
