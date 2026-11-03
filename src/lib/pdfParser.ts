import { extractText } from "unpdf";
import { StatementDocument, TransactionRow, DocumentKind } from "./types";

/**
 * ============================================================================
 * 商用级双通道 PDF 财务解析引擎 2.1 (加固多银行真实日期与 CR/DR 后缀支持)
 * ============================================================================
 * 新增支持：
 * 1. 英文月份缩写日期：Oct 14, 2026 / 14 Oct 2026 / Oct 14 / 14 OCT
 * 2. 美式无年份短日期：10/02 / 10-14（自动从账单周期提取年份补全！）
 * 3. 英/澳/信用卡尾缀符号：125.00CR / 45.20DR / (312.65) 括号负数
 */

const MONTH_MAP: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

export function normalizeFlexibleDateToIso(
  rawDate: string,
  fallbackYear = "2026"
): string {
  const trimmed = rawDate.trim().replace(/,/g, "");

  // 1. YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // 2. MM/DD/YYYY or DD/MM/YYYY
  const slashFull = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (slashFull) {
    const p1 = parseInt(slashFull[1], 10);
    const p2 = parseInt(slashFull[2], 10);
    const yyyy =
      slashFull[3].length === 2 ? `20${slashFull[3]}` : slashFull[3];
    // If first part > 12, it is definitely DD/MM/YYYY (UK/AU)
    const mm = p1 > 12 ? String(p2).padStart(2, "0") : String(p1).padStart(2, "0");
    const dd = p1 > 12 ? String(p1).padStart(2, "0") : String(p2).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // 3. Short MM/DD (e.g. Chase "10/04")
  const slashShort = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (slashShort) {
    const mm = slashShort[1].padStart(2, "0");
    const dd = slashShort[2].padStart(2, "0");
    return `${fallbackYear}-${mm}-${dd}`;
  }

  // 4. Month Name First: "Oct 14 2026" or "Oct 14"
  const monthFirst = trimmed.match(
    /^([A-Za-z]{3,9})\s+(\d{1,2})(?:\s+(\d{2,4}))?$/
  );
  if (monthFirst) {
    const monKey = monthFirst[1].slice(0, 3).toLowerCase();
    const mm = MONTH_MAP[monKey] || "10";
    const dd = monthFirst[2].padStart(2, "0");
    const yyyy = monthFirst[3]
      ? monthFirst[3].length === 2
        ? `20${monthFirst[3]}`
        : monthFirst[3]
      : fallbackYear;
    return `${yyyy}-${mm}-${dd}`;
  }

  // 5. Day First (UK/AU/CA): "14 Oct 2026" or "14 Oct"
  const dayFirst = trimmed.match(
    /^(\d{1,2})\s+([A-Za-z]{3,9})(?:\s+(\d{2,4}))?$/
  );
  if (dayFirst) {
    const dd = dayFirst[1].padStart(2, "0");
    const monKey = dayFirst[2].slice(0, 3).toLowerCase();
    const mm = MONTH_MAP[monKey] || "10";
    const yyyy = dayFirst[3]
      ? dayFirst[3].length === 2
        ? `20${dayFirst[3]}`
        : dayFirst[3]
      : fallbackYear;
    return `${yyyy}-${mm}-${dd}`;
  }

  return `${fallbackYear}-10-15`;
}

function parseMoneyToken(token: string): {
  value: number;
  hasCr: boolean;
  hasDr: boolean;
  isNegative: boolean;
} {
  const t = token.trim();
  const hasCr = /CR$/i.test(t);
  const hasDr = /DR$/i.test(t);
  const isParenNegative = /^\(.*\)$/.test(t);
  const hasMinus = t.includes("-");
  const cleaned = t.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  const val = Number.isFinite(num) ? num : 0;
  const isNegative = isParenNegative || hasMinus || hasDr;
  return {
    value: isNegative ? -Math.abs(val) : val,
    hasCr,
    hasDr,
    isNegative,
  };
}

export function parseRawPdfStatementText(
  rawText: string,
  fileName: string,
  pageCount: number,
  docKind: DocumentKind = "bank_statement"
): StatementDocument {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Detect statement year if printed in header
  const yearMatch = rawText.match(/\b(202[0-9])\b/);
  const detectedYear = yearMatch ? yearMatch[1] : "2026";

  let openingBalance = 0;
  let closingBalance = 0;
  let foundOpening = false;
  let foundClosing = false;

  const moneyPattern =
    /[\+\-\$£€(]?[0-9,]+\.\d{2}(?:\)|CR|DR)?/gi;

  for (const line of lines) {
    if (!foundOpening && /(opening|beginning|previous|brought\s+forward)\s+balance/i.test(line)) {
      const m = line.match(moneyPattern);
      if (m && m.length > 0) {
        openingBalance = Math.abs(parseMoneyToken(m[m.length - 1]).value);
        foundOpening = true;
      }
    }
    if (
      !foundClosing &&
      /(closing|ending|new|carried\s+forward)\s+balance/i.test(line)
    ) {
      const m = line.match(moneyPattern);
      if (m && m.length > 0) {
        closingBalance = Math.abs(parseMoneyToken(m[m.length - 1]).value);
        foundClosing = true;
      }
    }
  }

  const rows: TransactionRow[] = [];
  // Matches ISO, MM/DD/YYYY, Short MM/DD, "Oct 14, 2026", "14 Oct 2026", "Oct 14"
  const txLineRegex =
    /^(\d{4}-\d{2}-\d{2}|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,?\s+\d{2,4})?|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:,?\s+\d{2,4})?)\s+(.+)$/i;

  lines.forEach((line, idx) => {
    const match = line.match(txLineRegex);
    if (!match) return;
    const rawDate = match[1];
    const rest = match[2];

    const moneyTokens = rest.match(moneyPattern);
    if (!moneyTokens || moneyTokens.length === 0) return;

    let desc = rest;
    moneyTokens.forEach((tok) => {
      const lastPos = desc.lastIndexOf(tok);
      if (lastPos !== -1) {
        desc = desc.slice(0, lastPos).trim();
      }
    });
    desc = desc || "Statement Transaction";

    const amtObj =
      moneyTokens.length >= 2
        ? parseMoneyToken(moneyTokens[moneyTokens.length - 2])
        : parseMoneyToken(moneyTokens[0]);

    const reportedBalance =
      moneyTokens.length >= 2
        ? Math.abs(parseMoneyToken(moneyTokens[moneyTokens.length - 1]).value)
        : null;

    const rawAmtToken =
      moneyTokens.length >= 2
        ? moneyTokens[moneyTokens.length - 2]
        : moneyTokens[0];

    const isExplicitPositive = rawAmtToken.includes("+") || amtObj.hasCr;
    const looksLikeCredit =
      /\b(deposit|credit|refund|payout|settlement|incoming|interest\s+paid|payment\s+received)\b/i.test(
        desc
      );
    const looksLikeDebit =
      /\b(debit|withdrawal|pos|wire\s+out|fee|charge|lease|purchase|atm|direct\s+debit)\b/i.test(
        desc
      );

    let debit = 0;
    let credit = 0;
    if (amtObj.isNegative) {
      debit = Math.abs(amtObj.value);
    } else if (isExplicitPositive) {
      credit = Math.abs(amtObj.value);
    } else if (looksLikeCredit && !looksLikeDebit) {
      credit = Math.abs(amtObj.value);
    } else if (looksLikeDebit) {
      debit = Math.abs(amtObj.value);
    } else {
      if (docKind === "credit_card") {
        debit = Math.abs(amtObj.value);
      } else {
        credit = Math.abs(amtObj.value);
      }
    }

    rows.push({
      id: `pdf-row-${idx + 1}`,
      date: normalizeFlexibleDateToIso(rawDate, detectedYear),
      payee: desc.split(/\s+/).slice(0, 3).join(" ").slice(0, 32),
      description: desc,
      debit,
      credit,
      reportedBalance,
    });
  });

  if (!foundClosing && rows.length > 0) {
    const lastBal = rows[rows.length - 1].reportedBalance;
    if (lastBal !== null) {
      closingBalance = lastBal;
    } else {
      const net = rows.reduce((acc, r) => acc + r.credit - r.debit, 0);
      closingBalance = Number((openingBalance + net).toFixed(2));
    }
  }

  return {
    documentType: docKind,
    fileName,
    institutionName: "Extracted PDF Statement",
    accountLast4: "0001",
    currency: /£/.test(rawText) ? "GBP" : /€/.test(rawText) ? "EUR" : "USD",
    periodStart: rows[0]?.date || `${detectedYear}-10-01`,
    periodEnd: rows[rows.length - 1]?.date || `${detectedYear}-10-31`,
    openingBalance,
    closingBalance,
    pageCount,
    extractionMode: "local_pdf_parser",
    rows,
  };
}

export async function parsePdfBuffer(
  buffer: ArrayBuffer,
  fileName: string,
  docKind: DocumentKind = "bank_statement"
): Promise<StatementDocument> {
  const uint8 = new Uint8Array(buffer);
  const { text, totalPages } = await extractText(uint8, { mergePages: true });
  const combinedText = Array.isArray(text) ? text.join("\n") : text || "";

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (openRouterKey) {
    const systemInstruction = `You are a precision financial bank statement & invoice extraction engine.
Return ONLY valid JSON matching this exact TypeScript structure:
{
  "institutionName": string,
  "accountLast4": string,
  "currency": "USD" | "GBP" | "EUR" | "AUD" | "CAD",
  "periodStart": "YYYY-MM-DD",
  "periodEnd": "YYYY-MM-DD",
  "openingBalance": number,
  "closingBalance": number,
  "rows": [
    {
      "date": "YYYY-MM-DD",
      "payee": string,
      "description": string,
      "reference": string,
      "debit": number,
      "credit": number,
      "reportedBalance": number | null
    }
  ]
}
Rules:
- debit and credit must ALWAYS be non-negative numbers (>= 0).
- Verify openingBalance + sum(credit) - sum(debit) equals closingBalance.`;

    const base64Pdf = Buffer.from(buffer).toString("base64");
    const userContent =
      combinedText.trim().length > 80
        ? `Extract all transactions accurately from this financial PDF (${fileName}):\n\n${combinedText.slice(
            0,
            45000
          )}`
        : [
            {
              type: "text",
              text: `Scanned PDF (${fileName}). Perform OCR and extract every transaction line item accurately.`,
            },
            {
              type: "file",
              file: {
                filename: fileName,
                file_data: `data:application/pdf;base64,${base64Pdf}`,
              },
            },
          ];

    const llmRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userContent },
          ],
        }),
      }
    );

    if (llmRes.ok) {
      const llmJson = await llmRes.json();
      const rawContent = llmJson?.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawContent);
      return {
        documentType: docKind,
        fileName,
        institutionName: parsed.institutionName || "Verified Statement",
        accountLast4: String(parsed.accountLast4 || "0001").slice(-4),
        currency: parsed.currency || "USD",
        periodStart: parsed.periodStart || "2026-10-01",
        periodEnd: parsed.periodEnd || "2026-10-31",
        openingBalance: Number(parsed.openingBalance || 0),
        closingBalance: Number(parsed.closingBalance || 0),
        pageCount: totalPages || 1,
        extractionMode: "ai_vlm",
        rows: (parsed.rows || []).map((r: Partial<TransactionRow>, i: number) => ({
          id: `vlm-row-${i + 1}`,
          date: r.date || "2026-10-01",
          payee: r.payee || (r.description || "").slice(0, 28),
          description: r.description || "Transaction",
          reference: r.reference || "",
          debit: Math.max(0, Number(r.debit || 0)),
          credit: Math.max(0, Number(r.credit || 0)),
          reportedBalance:
            r.reportedBalance !== null && r.reportedBalance !== undefined
              ? Number(r.reportedBalance)
              : null,
        })),
      };
    }
  }

  return parseRawPdfStatementText(
    combinedText,
    fileName,
    totalPages || 1,
    docKind
  );
}
