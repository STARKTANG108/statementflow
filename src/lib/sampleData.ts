import { StatementDocument } from "./types";

/**
 * 预置两份真实美式商业银行对账单数据：
 * 1. CLEAN_SAMPLE_STATEMENT: 100% 自动平账通过 ($0.00 差额)
 * 2. DISCREPANCY_SAMPLE_STATEMENT: 模拟扫描污渍导致第 4 行 $125.00 AWS 退款被误识为支出，触发系统智能极性翻转一键修复演示！
 */

export const CLEAN_SAMPLE_STATEMENT: StatementDocument = {
  documentType: "bank_statement",
  fileName: "us-business-checking-oct-2026.pdf",
  institutionName: "First National Business Checking",
  accountLast4: "4829",
  currency: "USD",
  periodStart: "2026-10-01",
  periodEnd: "2026-10-31",
  openingBalance: 14250.0,
  closingBalance: 18412.35,
  pageCount: 2,
  extractionMode: "sample_clean",
  rows: [
    {
      id: "tx-1",
      date: "2026-10-02",
      payee: "STRIPE TRANSFER",
      description: "ACH CREDIT STRIPE PAYOUT ID #99281",
      reference: "ACH-99281",
      debit: 0,
      credit: 4850.0,
      reportedBalance: 19100.0,
    },
    {
      id: "tx-2",
      date: "2026-10-05",
      payee: "GUSTO PAYROLL",
      description: "ACH DEBIT GUSTO PAYROLL OCT-A",
      reference: "PR-4012",
      debit: 2150.0,
      credit: 0,
      reportedBalance: 16950.0,
    },
    {
      id: "tx-3",
      date: "2026-10-09",
      payee: "AMAZON WEB SERVICES",
      description: "POS DEBIT AWS CLOUD SERVICES SEATTLE WA",
      reference: "CARD-8812",
      debit: 312.65,
      credit: 0,
      reportedBalance: 16637.35,
    },
    {
      id: "tx-4",
      date: "2026-10-14",
      payee: "AWS SERVICE CREDIT",
      description: "MERCHANT REFUND AWS PROMO ADJUSTMENT",
      reference: "REF-1044",
      debit: 0,
      credit: 125.0,
      reportedBalance: 16762.35,
    },
    {
      id: "tx-5",
      date: "2026-10-19",
      payee: "SHOPIFY SETTLEMENT",
      description: "ACH CREDIT SHOPIFY INC BATCH #7741",
      reference: "SHP-7741",
      debit: 0,
      credit: 2490.0,
      reportedBalance: 19252.35,
    },
    {
      id: "tx-6",
      date: "2026-10-26",
      payee: "REGUS OFFICE LEASE",
      description: "WIRE OUT MONTHLY SUITE RENT #204",
      reference: "WIR-3309",
      debit: 840.0,
      credit: 0,
      reportedBalance: 18412.35,
    },
  ],
};

export const DISCREPANCY_SAMPLE_STATEMENT: StatementDocument = {
  ...CLEAN_SAMPLE_STATEMENT,
  fileName: "scanned-coffee-stained-statement.pdf",
  extractionMode: "sample_discrepancy",
  rows: CLEAN_SAMPLE_STATEMENT.rows.map((row) =>
    row.id === "tx-4"
      ? {
          ...row,
          // Intentional OCR polarity error: $125.00 credit misread as $125.00 debit!
          debit: 125.0,
          credit: 0,
        }
      : row
  ),
};
