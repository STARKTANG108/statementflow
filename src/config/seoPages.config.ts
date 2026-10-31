import { DocumentKind, ExportFormatType, DateFormatPreference } from "@/lib/types";

/**
 * ============================================================================
 * 同心圆 B2B 财务转换 SEO 落地页矩阵配置 (seoPages.config.ts)
 * ============================================================================
 * 全站 100% 围绕“财务 PDF -> 会计系统零报错入账”构建垂直领域权威度 (Topical Authority)！
 * 避开 Adobe 垄断的泛词，精准狙击高客单价会计与企业主底部转化词。
 */

export interface SeoWorkflowPage {
  slug: string;
  navLabel: string;
  badge: string;
  defaultExportFormat: ExportFormatType;
  defaultDateFormat: DateFormatPreference;
  documentKind: DocumentKind;

  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  subtitle: string;

  painPointsSolved: { title: string; detail: string }[];
  technicalSpecNotes: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export const seoPagesConfig: SeoWorkflowPage[] = [
  {
    slug: "pdf-to-qbo",
    navLabel: "PDF to QuickBooks (.QBO)",
    badge: "QuickBooks Web Connect",
    defaultExportFormat: "qbo",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert PDF Bank Statement to QBO (QuickBooks Online & Desktop)",
    seoDescription:
      "Convert historical or unsupported PDF bank and credit card statements into native QuickBooks Web Connect (.QBO) files with 100% balance reconciliation.",
    keywords: [
      "convert pdf bank statement to qbo",
      "pdf to quickbooks online web connect",
      "import historical pdf bank statements quickbooks",
      "bank statement pdf to qbo converter",
    ],
    h1: "Convert PDF Bank Statements to Native QuickBooks (.QBO)",
    subtitle:
      "Broken bank feed or missing historical transactions older than 90 days? Extract any PDF bank statement, verify $0.00 balance discrepancy, and export a compliant .QBO Web Connect file with deduplicated FITID tags.",
    painPointsSolved: [
      {
        title: "Backfill 12–36 Months of Historical Statements",
        detail:
          "Most direct bank feeds only pull the last 90 days. Upload multi-month PDFs and import clean .QBO files into QuickBooks Banking in minutes.",
      },
      {
        title: "Zero Duplicate Imports (Deterministic FITID)",
        detail:
          "Every transaction receives a spec-compliant OFX FITID hash so QuickBooks automatically prevents accidental double-posting.",
      },
      {
        title: "Includes Valid INTU.BID 3000 Header",
        detail:
          "Avoid the dreaded 'QuickBooks is unable to verify the financial institution' error caused by malformed generic OFX converters.",
      },
    ],
    technicalSpecNotes: [
      { label: "Output Standard", value: "OFX 102 / Intuit Web Connect (.QBO)" },
      { label: "Compatible Versions", value: "QuickBooks Online & Desktop 2021–2026" },
      { label: "Account Types", value: "CHECKING, SAVINGS & CREDITLINE" },
    ],
    faqs: [
      {
        question: "Why import a .QBO file instead of a plain CSV into QuickBooks?",
        answer:
          "CSV imports in QuickBooks frequently fail on date formatting, split debit/credit columns, or special characters—and lack unique transaction IDs (FITID). A native .QBO Web Connect file drops straight into the QuickBooks Bank Feed matching screen just like a live bank connection.",
      },
      {
        question: "Does this fix the 'Unable to verify financial institution' error?",
        answer:
          "Yes. StatementFlow embeds compliant INTU.BID 3000 sign-on headers, clean USASCII/UTF-8 sanitization, and verified LEDGERBAL closing tags.",
      },
      {
        question: "How do I know the AI didn't miss a row on a multi-page PDF?",
        answer:
          "Before you download your .QBO file, our deterministic math engine checks Opening Balance + Total Credits - Total Debits against your PDF's Closing Balance to the exact penny.",
      },
    ],
  },
  {
    slug: "pdf-to-xero-csv",
    navLabel: "PDF to Xero CSV",
    badge: "Xero Compliant Format",
    defaultExportFormat: "xero_csv",
    defaultDateFormat: "DD/MM/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert PDF Bank Statement to Xero CSV Format (Zero Import Errors)",
    seoDescription:
      "Turn messy PDF bank and credit card statements into Xero's exact *Date, *Amount, Payee, Description CSV import template with automatic balance verification.",
    keywords: [
      "convert pdf bank statement to xero csv",
      "xero bank statement csv converter",
      "backfill xero bank transactions from pdf",
      "format pdf statement for xero import",
    ],
    h1: "Convert PDF Bank Statements to Exact Xero CSV Format",
    subtitle:
      "Eliminate Xero CSV import rejections forever. Automatically merge split Debit/Credit columns into Xero's required signed *Amount column, normalize DD/MM/YYYY or MM/DD/YYYY dates, and verify closing balances.",
    painPointsSolved: [
      {
        title: "Exact *Date & *Amount Mandatory Headers",
        detail:
          "Pre-formatted with Xero's strict asterisk column headers (*Date, *Amount, Payee, Description, Reference, Check Number).",
      },
      {
        title: "Automatic Signed Single-Column Consolidation",
        detail:
          "Xero rejects separate Debit and Credit columns unless manually merged with minus signs. We normalize outflows as negative (-45.20) and inflows as positive automatically.",
      },
      {
        title: "UK / AU / NZ (DD/MM/YYYY) & US Date Presets",
        detail:
          "Switch regional date formatting in one click to match your Xero organization's locale without Excel formula headaches.",
      },
    ],
    technicalSpecNotes: [
      { label: "Header Schema", value: "*Date,*Amount,Payee,Description,Reference,Check Number" },
      { label: "Locale Support", value: "UK, Australia, NZ (DD/MM/YYYY) & US/CA (MM/DD/YYYY)" },
      { label: "Currency Symbols", value: "Automatically stripped per Xero import rules" },
    ],
    faqs: [
      {
        question: "Why does Xero reject standard PDF-to-Excel CSV exports?",
        answer:
          "Xero requires mandatory asterisk headers (*Date and *Amount), forbids currency symbols ($/£) or thousand-separator commas inside numbers, and requires debits to carry a leading minus sign in a single Amount column.",
      },
      {
        question: "Does this support UK, Australian, and Canadian bank statements?",
        answer:
          "Yes. Toggle DD/MM/YYYY or MM/DD/YYYY directly in the workbench before exporting your Xero CSV.",
      },
      {
        question: "Are client statements stored on your servers?",
        answer:
          "No. StatementFlow processes uploaded PDFs in ephemeral memory and discards source bytes immediately upon returning extracted rows.",
      },
    ],
  },
  {
    slug: "scanned-bank-statement-ocr",
    navLabel: "Scanned Statement OCR",
    badge: "Paper & Scan OCR",
    defaultExportFormat: "xlsx",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Scanned PDF Bank Statement OCR to Excel & CSV (Math Reconciled)",
    seoDescription:
      "Extract transactions from scanned paper bank statements, faxed copies, and phone photos with Vision AI + automated running-balance error detection.",
    keywords: [
      "convert scanned pdf bank statement to excel",
      "ocr paper bank statement to csv",
      "extract transactions from scanned bank statement",
      "audit scanned bank statements cpa tool",
    ],
    h1: "Scanned & Paper Bank Statement OCR with Math Audit",
    subtitle:
      "Clients still handing you paper printouts, skewed scans, or phone snapshots? Combine frontier Vision OCR with row-by-row running balance verification that flags smudged digits automatically.",
    painPointsSolved: [
      {
        title: "Handles Skewed Scans, Stamps & Coffee Stains",
        detail:
          "Traditional PDF text parsers return blank pages on image-only scans. Our Vision pipeline reads rasterized scans with ease.",
      },
      {
        title: "Pinpoints Exact Smudged Digits via Running Balance",
        detail:
          "If a faded '8' looks like a '3' on page 4, our running-balance auditor highlights that exact row in red so you fix it in 2 seconds instead of checking 200 rows.",
      },
      {
        title: "Exports Workpaper Audit Certificate",
        detail:
          "Every .XLSX download includes a second Audit_Certificate tab proving Opening + Credits - Debits = Closing Balance for CPA review.",
      },
    ],
    technicalSpecNotes: [
      { label: "OCR Engine", value: "Multimodal Vision Schema + Cents Math Verifier" },
      { label: "Audit Granularity", value: "Header Balance + Line-by-Line Running Balance" },
      { label: "Workpaper Output", value: "2-Sheet Verified .XLSX + QBO/Xero" },
    ],
    faqs: [
      {
        question: "Why fail on generic OCR tools when converting paper bank statements?",
        answer:
          "Generic OCR tools dump raw text without checking arithmetic. A single misread decimal ruins your entire reconciliation. StatementFlow cross-checks every line against the printed running balance.",
      },
      {
        question: "Can I edit a flagged OCR cell directly before exporting?",
        answer:
          "Yes! Click any description, date, debit, or credit cell—or use our 1-click Polarity Flip button—and watch the reconciliation badge turn green live.",
      },
      {
        question: "Does it work on multi-page scanned PDFs?",
        answer:
          "Yes. Multi-page statements are stitched into one continuous chronological ledger while ignoring repeated page headers and legal footers.",
      },
    ],
  },
  {
    slug: "credit-card-pdf-to-excel",
    navLabel: "Credit Card PDF Converter",
    badge: "Card & Expense Cleanup",
    defaultExportFormat: "qbo_csv",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "credit_card",
    seoTitle:
      "Credit Card PDF Statement to Excel, CSV & QBO Converter",
    seoDescription:
      "Extract corporate and personal credit card PDF statements into clean Excel, QuickBooks, or Xero files. Automatically separates purchases from refunds and payments.",
    keywords: [
      "credit card pdf statement to excel",
      "convert credit card statement pdf to csv",
      "amex chase corporate card pdf to qbo",
      "split charges and credits from credit card pdf",
    ],
    h1: "Credit Card PDF Statement to Clean Excel, QBO & CSV",
    subtitle:
      "Corporate card PDFs mix employee sub-cards, foreign currency notes, payments, and merchant refunds in confusing layouts. Normalize charges and credits cleanly in seconds.",
    painPointsSolved: [
      {
        title: "Fixes Inverted Credit Card Sign Conventions",
        detail:
          "Credit card PDFs often show purchases as positive numbers and refunds/payments with a '-' or 'CR' suffix. Our polarity check prevents backwards ledger imports.",
      },
      {
        title: "Strips Multi-Line FX Rate Clutter",
        detail:
          "Cleans foreign transaction conversion sub-lines while keeping the exact posted settlement amount.",
      },
      {
        title: "CREDITLINE QBO Account Tagging",
        detail:
          "Automatically sets <ACCTTYPE>CREDITLINE in .QBO exports so QuickBooks routes transactions to Credit Card liability accounts.",
      },
    ],
    technicalSpecNotes: [
      { label: "QBO Account Type", value: "<ACCTTYPE>CREDITLINE" },
      { label: "Sign Handling", value: "Auto-separates Purchases vs Payments/Credits" },
      { label: "Export Options", value: ".QBO, Xero CSV, QuickBooks 4-Col CSV, .XLSX" },
    ],
    faqs: [
      {
        question: "Why did my credit card CSV import backwards into QuickBooks/Xero?",
        answer:
          "Credit card statements list charges as positive numbers (+42.00), whereas bank feeds expect outflows to be negative (-42.00). StatementFlow normalizes charges into Debits and refunds/payments into Credits automatically.",
      },
      {
        question: "What if one merchant refund has its sign flipped?",
        answer:
          "Our Smart Polarity Flip detector spots exact 2x discrepancy patterns and offers a 1-click button to flip that single row from Charge to Credit.",
      },
    ],
  },
  {
    slug: "invoice-pdf-to-excel",
    navLabel: "Invoice PDF to Excel",
    badge: "Accounts Payable",
    defaultExportFormat: "xlsx",
    defaultDateFormat: "YYYY-MM-DD",
    documentKind: "invoice",
    seoTitle:
      "Supplier Invoice PDF Line-Item Extractor to Excel & CSV",
    seoDescription:
      "Extract SKU line items, quantities, unit prices, tax, and invoice totals from PDF supplier invoices into verified Excel spreadsheets and accounting CSVs.",
    keywords: [
      "extract invoice line items pdf to excel",
      "supplier invoice pdf to csv converter",
      "accounts payable pdf invoice parser",
      "convert vendor pdf invoices to spreadsheet",
    ],
    h1: "Supplier Invoice PDF Line-Item Extractor to Excel & CSV",
    subtitle:
      "Stop manually typing 50-line vendor invoices into spreadsheets. Extract every SKU description, amount, tax line, and verify invoice subtotal math automatically.",
    painPointsSolved: [
      {
        title: "Line-Item Granularity (Not Just Header Totals)",
        detail:
          "Captures individual line items, freight charges, and discounts—verifying that line items sum accurately to the invoice total.",
      },
      {
        title: "ERP & Inventory Ready Spreadsheets",
        detail:
          "Download clean tabular .XLSX and .CSV files ready for Shopify, NetSuite, Xero Bills, or QuickBooks Bills.",
      },
      {
        title: "Zero Template Training Required",
        detail:
          "Works across diverse wholesale, freight, customs, and SaaS vendor PDF layouts out of the box.",
      },
    ],
    technicalSpecNotes: [
      { label: "Verification Check", value: "Line-Item Sum + Tax === Invoice Total" },
      { label: "Primary Output", value: "Clean Tabular .XLSX & UTF-8 CSV" },
      { label: "Setup Time", value: "Zero template rules needed" },
    ],
    faqs: [
      {
        question: "Do I have to draw bounding boxes for each supplier's invoice template?",
        answer:
          "No. StatementFlow understands table headers and line-item semantics dynamically without rigid coordinate templates.",
      },
      {
        question: "Does it check if the extracted line items add up to the invoice total?",
        answer:
          "Yes! The same cents-accurate reconciliation engine verifies that extracted line items match the printed invoice total.",
      },
    ],
  },
];

export function getSeoWorkflowBySlug(slug: string): SeoWorkflowPage | undefined {
  return seoPagesConfig.find((p) => p.slug === slug);
}
