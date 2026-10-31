export type DocumentKind = "bank_statement" | "credit_card" | "invoice";
export type ExportFormatType = "qbo" | "xero_csv" | "qbo_csv" | "xlsx";
export type DateFormatPreference = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface TransactionRow {
  id: string;
  /** ISO normalized date YYYY-MM-DD */
  date: string;
  description: string;
  payee: string;
  reference?: string;
  /** Money out / Charge (>= 0) */
  debit: number;
  /** Money in / Deposit / Refund (>= 0) */
  credit: number;
  /** Balance printed on PDF row if present, null if statement omits running balance */
  reportedBalance: number | null;
}

export interface StatementDocument {
  documentType: DocumentKind;
  fileName: string;
  institutionName: string;
  accountLast4: string;
  currency: string;
  periodStart: string;
  periodEnd: string;
  openingBalance: number;
  closingBalance: number;
  pageCount: number;
  extractionMode: "ai_vlm" | "local_pdf_parser" | "sample_clean" | "sample_discrepancy";
  rows: TransactionRow[];
}

export interface RowAuditStatus {
  rowId: string;
  calculatedRunningBalance: number;
  hasRunningMismatch: boolean;
  runningDiff: number;
}

export interface ReconciliationAudit {
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  calculatedClosingBalance: number;
  expectedClosingBalance: number;
  /** Cents-accurate difference: calculatedClosing - expectedClosing */
  discrepancy: number;
  isReconciled: boolean;
  rowStatuses: Record<string, RowAuditStatus>;
  flaggedRowIds: string[];
  /** Smart hint if flipping one row's debit/credit resolves the exact discrepancy! */
  suggestedPolarityFlip?: {
    rowId: string;
    rowIndex: number;
    description: string;
    amount: number;
    direction: "debit_to_credit" | "credit_to_debit";
  };
}
