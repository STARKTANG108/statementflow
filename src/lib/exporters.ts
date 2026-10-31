import * as XLSX from "xlsx";
import {
  StatementDocument,
  ReconciliationAudit,
  DateFormatPreference,
  TransactionRow,
} from "./types";

/**
 * ============================================================================
 * 专业会计软件直出导出器 (.QBO Web Connect / Xero CSV / QuickBooks CSV / XLSX)
 * ============================================================================
 */

export function formatIsoDate(
  isoDate: string,
  pref: DateFormatPreference
): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const [, yyyy, mm, dd] = match;
  if (pref === "MM/DD/YYYY") return `${mm}/${dd}/${yyyy}`;
  if (pref === "DD/MM/YYYY") return `${dd}/${mm}/${yyyy}`;
  return `${yyyy}-${mm}-${dd}`;
}

function toOfxTimestamp(isoDate: string): string {
  const clean = isoDate.replace(/[^0-9]/g, "").slice(0, 8);
  return (clean.length === 8 ? clean : "20261001") + "120000";
}

function sanitizeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 250);
}

function csvEscape(val: string | number): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * 1. QuickBooks Online & Desktop 原生 Web Connect (.QBO / OFX 102) 导出器
 * 包含 INTU.BID 3000 标识与唯一 FITID 防重复导入校验
 */
export function generateQboFileContent(
  doc: StatementDocument,
  redactAccount: boolean
): string {
  const acctId = redactAccount
    ? "REDACTED9999"
    : `ACCT${doc.accountLast4 || "0001"}`;
  const dtStart = toOfxTimestamp(doc.periodStart);
  const dtEnd = toOfxTimestamp(doc.periodEnd);
  const dtServer = toOfxTimestamp(doc.periodEnd);
  const acctType =
    doc.documentType === "credit_card" ? "CREDITLINE" : "CHECKING";

  const txBlocks = doc.rows
    .map((row, idx) => {
      const signedAmount = Number((row.credit - row.debit).toFixed(2));
      const trnType = signedAmount >= 0 ? "CREDIT" : "DEBIT";
      const dtPosted = toOfxTimestamp(row.date);
      const fitId = `${dtPosted.slice(0, 8)}${String(idx + 1).padStart(4, "0")}${Math.abs(
        Math.round(signedAmount * 100)
      )}`;
      const name = sanitizeXml(row.payee || row.description).slice(0, 32);
      const memo = sanitizeXml(row.description);

      return `<STMTTRN>
<TRNTYPE>${trnType}
<DTPOSTED>${dtPosted}
<TRNAMT>${signedAmount.toFixed(2)}
<FITID>${fitId}
<NAME>${name}
<MEMO>${memo}
</STMTTRN>`;
    })
    .join("\n");

  return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>${dtServer}
<LANGUAGE>ENG
<INTU.BID>3000
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>${doc.currency || "USD"}
<BANKACCTFROM>
<BANKID>021000021
<ACCTID>${acctId}
<ACCTTYPE>${acctType}
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>${dtStart}
<DTEND>${dtEnd}
${txBlocks}
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>${doc.closingBalance.toFixed(2)}
<DTASOF>${dtEnd}
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;
}

/**
 * 2. Xero 官方标准银行对账单导入 CSV 格式
 * 官方必选列头: *Date, *Amount, Payee, Description, Reference, Check Number
 */
export function generateXeroCsvContent(
  doc: StatementDocument,
  datePref: DateFormatPreference = "DD/MM/YYYY"
): string {
  const header = "*Date,*Amount,Payee,Description,Reference,Check Number";
  const lines = doc.rows.map((row) => {
    const signedAmount = (row.credit - row.debit).toFixed(2);
    return [
      csvEscape(formatIsoDate(row.date, datePref)),
      signedAmount,
      csvEscape(row.payee || row.description.slice(0, 32)),
      csvEscape(row.description),
      csvEscape(row.reference || ""),
      "",
    ].join(",");
  });
  return [header, ...lines].join("\r\n");
}

/**
 * 3. QuickBooks Online 标准 4 列 CSV 导入格式 (Date, Description, Credit, Debit)
 */
export function generateQuickBooksCsvContent(
  doc: StatementDocument,
  datePref: DateFormatPreference = "MM/DD/YYYY"
): string {
  const header = "Date,Description,Credit,Debit";
  const lines = doc.rows.map((row) => [
    csvEscape(formatIsoDate(row.date, datePref)),
    csvEscape(row.description),
    row.credit > 0 ? row.credit.toFixed(2) : "",
    row.debit > 0 ? row.debit.toFixed(2) : "",
  ].join(","));
  return [header, ...lines].join("\r\n");
}

/**
 * 4. 原生多工作表 .XLSX 导出（含 Transactions 明细表 + Reconciliation 平账审计证书页）
 */
export function generateVerifiedXlsxArrayBuffer(
  doc: StatementDocument,
  audit: ReconciliationAudit,
  datePref: DateFormatPreference,
  redactAccount: boolean
): ArrayBuffer {
  const wb = XLSX.utils.book_new();

  const txData = doc.rows.map((row, idx) => ({
    "Line #": idx + 1,
    Date: formatIsoDate(row.date, datePref),
    Payee: row.payee || "",
    Description: row.description,
    Reference: row.reference || "",
    Debit: row.debit > 0 ? Number(row.debit.toFixed(2)) : 0,
    Credit: row.credit > 0 ? Number(row.credit.toFixed(2)) : 0,
    "Signed Amount": Number((row.credit - row.debit).toFixed(2)),
    "Calculated Running Balance":
      audit.rowStatuses[row.id]?.calculatedRunningBalance ?? 0,
    "Audit Status": audit.rowStatuses[row.id]?.hasRunningMismatch
      ? "CHECK ROW"
      : "VERIFIED",
  }));

  const wsTransactions = XLSX.utils.json_to_sheet(txData);
  XLSX.utils.book_append_sheet(wb, wsTransactions, "Verified_Transactions");

  const summaryRows = [
    ["StatementFlow Reconciliation Audit Summary", ""],
    ["Institution", doc.institutionName],
    ["Account Ending", redactAccount ? "REDACTED" : doc.accountLast4],
    ["Currency", doc.currency],
    ["Statement Period", `${doc.periodStart} to ${doc.periodEnd}`],
    ["Opening Balance", doc.openingBalance],
    ["Total Credits (+)", audit.totalCredits],
    ["Total Debits (-)", audit.totalDebits],
    ["Calculated Closing Balance", audit.calculatedClosingBalance],
    ["Statement Closing Balance", audit.expectedClosingBalance],
    ["Net Discrepancy", audit.discrepancy],
    [
      "Reconciliation Status",
      audit.isReconciled ? "100% RECONCILED ($0.00 DIFF)" : "DISCREPANCY FLAGGED",
    ],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Audit_Certificate");

  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

/**
 * 5. 纯前端 .QBO / .OFX 解析器（驱动 $0 算力免费会计引流工具 /tools/qbo-viewer）
 */
export function parseQboOrOfxContent(raw: string): StatementDocument {
  const getTag = (block: string, tag: string): string => {
    const regex = new RegExp(`<${tag}>([^<\\r\\n]+)`, "i");
    return block.match(regex)?.[1]?.trim() || "";
  };

  const currency = getTag(raw, "CURDEF") || "USD";
  const acctId = getTag(raw, "ACCTID") || "0000";
  const ledgerBal = parseFloat(getTag(raw, "BALAMT") || "0") || 0;

  const parseOfxDate = (d: string): string => {
    const digits = d.replace(/[^0-9]/g, "");
    if (digits.length >= 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
    return "2026-10-01";
  };

  const dtStart = parseOfxDate(getTag(raw, "DTSTART"));
  const dtEnd = parseOfxDate(getTag(raw, "DTEND"));

  const trnMatches = raw.match(/<STMTTRN>[\s\S]*?(?=<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>)/gi) || [];
  const rows: TransactionRow[] = trnMatches.map((block, idx) => {
    const amt = parseFloat(getTag(block, "TRNAMT") || "0") || 0;
    const name = getTag(block, "NAME");
    const memo = getTag(block, "MEMO");
    const fitId = getTag(block, "FITID");
    return {
      id: `qbo-row-${idx + 1}`,
      date: parseOfxDate(getTag(block, "DTPOSTED")),
      payee: name || memo.slice(0, 28),
      description: memo || name || "QBO Transaction",
      reference: fitId,
      debit: amt < 0 ? Math.abs(amt) : 0,
      credit: amt > 0 ? amt : 0,
      reportedBalance: null,
    };
  });

  const netChange = rows.reduce((acc, r) => acc + r.credit - r.debit, 0);
  const openingBalance = Number((ledgerBal - netChange).toFixed(2));

  return {
    documentType: "bank_statement",
    fileName: "imported-statement.qbo",
    institutionName: `QBO Bank Feed (INTU.BID ${getTag(raw, "INTU.BID") || "Standard"})`,
    accountLast4: acctId.slice(-4),
    currency,
    periodStart: dtStart,
    periodEnd: dtEnd,
    openingBalance,
    closingBalance: ledgerBal,
    pageCount: 1,
    extractionMode: "local_pdf_parser",
    rows,
  };
}
