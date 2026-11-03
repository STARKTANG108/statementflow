import { DocumentKind, ExportFormatType, DateFormatPreference } from "@/lib/types";

/**
 * ============================================================================
 * 同心圆 B2B 财务转换 pSEO 落地页矩阵配置 (seoPages.config.ts)
 * ============================================================================
 * 覆盖 15 个高意向、低竞争、高客单价的欧美英澳加会计与小微企业搜索词：
 * - 5 个核心软件/单据工作流页 (QBO, Xero, Scanned OCR, Credit Card, Invoice)
 * - 10 个主流银行/卡种/地区版式专属转换页 (美、英、澳、加、跨境数字银行、房东租金表)
 */

export interface SeoWorkflowPage {
  slug: string;
  navLabel: string;
  badge: string;
  regionTag?: "US" | "UK" | "AU" | "CA" | "Global";
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
  // ==========================================================================
  // 核心工作流 1-5
  // ==========================================================================
  {
    slug: "pdf-to-qbo",
    navLabel: "PDF to QuickBooks (.QBO)",
    badge: "QuickBooks Web Connect",
    regionTag: "Global",
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
      "Broken bank feed or missing historical transactions older than 90 days? Extract any PDF bank statement, verify $0.00 balance discrepancy, and export a compliant .QBO Web Connect file.",
    painPointsSolved: [
      {
        title: "Backfill 12–36 Months of Historical Statements",
        detail:
          "Direct bank feeds only pull the last 90 days. Upload multi-month PDFs and import clean .QBO files into QuickBooks Banking in minutes.",
      },
      {
        title: "Zero Duplicate Imports (Deterministic FITID)",
        detail:
          "Every transaction receives a spec-compliant OFX FITID hash so QuickBooks automatically prevents accidental double-posting.",
      },
      {
        title: "Includes Valid INTU.BID 3000 Header",
        detail:
          "Avoid 'QuickBooks is unable to verify the financial institution' errors caused by malformed generic OFX converters.",
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
          "CSV imports frequently fail on date formatting or split debit/credit columns and lack unique transaction IDs (FITID). A native .QBO file drops straight into QuickBooks Bank Feeds.",
      },
      {
        question: "Does this fix the 'Unable to verify financial institution' error?",
        answer:
          "Yes. StatementFlow embeds compliant INTU.BID 3000 sign-on headers and verified LEDGERBAL closing tags.",
      },
    ],
  },
  {
    slug: "pdf-to-xero-csv",
    navLabel: "PDF to Xero CSV",
    badge: "Xero Compliant Format",
    regionTag: "Global",
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
      "Eliminate Xero CSV import rejections forever. Automatically merge split Debit/Credit columns into Xero's required signed *Amount column and verify closing balances.",
    painPointsSolved: [
      {
        title: "Exact *Date & *Amount Mandatory Headers",
        detail:
          "Pre-formatted with Xero's strict asterisk column headers (*Date, *Amount, Payee, Description, Reference, Check Number).",
      },
      {
        title: "Automatic Signed Single-Column Consolidation",
        detail:
          "Xero rejects separate Debit and Credit columns. We normalize outflows as negative (-45.20) and inflows as positive automatically.",
      },
      {
        title: "UK / AU / NZ (DD/MM/YYYY) & US Date Presets",
        detail:
          "Switch regional date formatting in one click to match your Xero organization's locale.",
      },
    ],
    technicalSpecNotes: [
      { label: "Header Schema", value: "*Date,*Amount,Payee,Description,Reference,Check Number" },
      { label: "Locale Support", value: "UK, Australia, NZ (DD/MM/YYYY) & US/CA (MM/DD/YYYY)" },
      { label: "Currency Symbols", value: "Automatically stripped per Xero rules" },
    ],
    faqs: [
      {
        question: "Why does Xero reject standard PDF-to-Excel CSV exports?",
        answer:
          "Xero requires mandatory asterisk headers (*Date and *Amount), forbids currency symbols or commas inside numbers, and requires debits to carry a minus sign in a single Amount column.",
      },
      {
        question: "Does this support UK, Australian, and New Zealand statements?",
        answer:
          "Yes. DD/MM/YYYY formatting is enabled by default on this workflow to match Xero UK/AU/NZ org settings.",
      },
    ],
  },
  {
    slug: "scanned-bank-statement-ocr",
    navLabel: "Scanned Statement OCR",
    badge: "Paper & Scan OCR",
    regionTag: "Global",
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
    ],
    h1: "Scanned & Paper Bank Statement OCR with Math Audit",
    subtitle:
      "Clients handing you paper printouts or skewed scans? Combine Vision OCR with row-by-row running balance verification that flags smudged digits automatically.",
    painPointsSolved: [
      {
        title: "Handles Skewed Scans, Stamps & Faded Ink",
        detail:
          "Traditional PDF text parsers return blank pages on image-only scans. Our Vision pipeline reads rasterized scans cleanly.",
      },
      {
        title: "Pinpoints Exact Smudged Digits via Running Balance",
        detail:
          "If a faded '8' looks like a '3', our running-balance auditor highlights that exact row in red so you fix it in 2 seconds.",
      },
      {
        title: "Exports Workpaper Audit Certificate",
        detail:
          "Every .XLSX download includes a second Audit_Certificate tab proving Opening + Credits - Debits = Closing Balance.",
      },
    ],
    technicalSpecNotes: [
      { label: "OCR Engine", value: "Multimodal Vision Schema + Cents Math Verifier" },
      { label: "Audit Granularity", value: "Header Balance + Line-by-Line Running Balance" },
      { label: "Workpaper Output", value: "2-Sheet Verified .XLSX + QBO/Xero" },
    ],
    faqs: [
      {
        question: "Why do generic OCR tools fail on paper bank statements?",
        answer:
          "Generic OCR tools dump raw text without checking arithmetic. StatementFlow cross-checks every line against the printed running balance.",
      },
    ],
  },
  {
    slug: "credit-card-pdf-to-excel",
    navLabel: "Credit Card PDF Converter",
    badge: "Card & Expense Cleanup",
    regionTag: "Global",
    defaultExportFormat: "qbo_csv",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "credit_card",
    seoTitle:
      "Credit Card PDF Statement to Excel, CSV & QBO Converter",
    seoDescription:
      "Extract corporate and personal credit card PDF statements into clean Excel, QuickBooks, or Xero files. Automatically separates purchases from refunds.",
    keywords: [
      "credit card pdf statement to excel",
      "convert credit card statement pdf to csv",
      "split charges and credits from credit card pdf",
    ],
    h1: "Credit Card PDF Statement to Clean Excel, QBO & CSV",
    subtitle:
      "Normalize corporate and personal credit card PDFs in seconds—automatically separating purchases from merchant refunds and payments.",
    painPointsSolved: [
      {
        title: "Fixes Inverted Credit Card Sign Conventions",
        detail:
          "Credit card PDFs show purchases as positive numbers and refunds with a '-' or 'CR' suffix. Our polarity check prevents backwards imports.",
      },
      {
        title: "Strips Multi-Line FX Rate Clutter",
        detail:
          "Cleans foreign currency conversion sub-lines while keeping the exact posted settlement amount.",
      },
      {
        title: "CREDITLINE QBO Account Tagging",
        detail:
          "Automatically sets <ACCTTYPE>CREDITLINE in .QBO exports for QuickBooks credit card liability accounts.",
      },
    ],
    technicalSpecNotes: [
      { label: "QBO Account Type", value: "<ACCTTYPE>CREDITLINE" },
      { label: "Sign Handling", value: "Auto-separates Purchases vs Refunds (CR)" },
      { label: "Export Options", value: ".QBO, Xero CSV, QuickBooks 4-Col CSV, .XLSX" },
    ],
    faqs: [
      {
        question: "Why did my credit card CSV import backwards into QuickBooks/Xero?",
        answer:
          "Credit card statements list charges as positive numbers (+42.00), whereas bank feeds expect outflows to be negative (-42.00). StatementFlow normalizes signs automatically.",
      },
    ],
  },
  {
    slug: "invoice-pdf-to-excel",
    navLabel: "Invoice PDF to Excel",
    badge: "Accounts Payable",
    regionTag: "Global",
    defaultExportFormat: "xlsx",
    defaultDateFormat: "YYYY-MM-DD",
    documentKind: "invoice",
    seoTitle:
      "Supplier Invoice PDF Line-Item Extractor to Excel & CSV",
    seoDescription:
      "Extract SKU line items, quantities, unit prices, tax, and totals from PDF supplier invoices into verified Excel spreadsheets and accounting CSVs.",
    keywords: [
      "extract invoice line items pdf to excel",
      "supplier invoice pdf to csv converter",
      "accounts payable pdf invoice parser",
    ],
    h1: "Supplier Invoice PDF Line-Item Extractor to Excel & CSV",
    subtitle:
      "Stop manually typing multi-line vendor invoices into spreadsheets. Extract every SKU description, amount, and verify invoice subtotal math automatically.",
    painPointsSolved: [
      {
        title: "Line-Item Granularity (Not Just Header Totals)",
        detail:
          "Captures individual line items, freight charges, and discounts—verifying that line items sum accurately to the invoice total.",
      },
      {
        title: "ERP & Inventory Ready Spreadsheets",
        detail:
          "Download clean tabular .XLSX and .CSV files ready for Shopify, NetSuite, Xero Bills, or QuickBooks.",
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
        question: "Does it check if the extracted line items add up to the invoice total?",
        answer:
          "Yes! Our cents-accurate reconciliation engine verifies that extracted line items match the printed invoice total.",
      },
    ],
  },

  // ==========================================================================
  // 新增 10 个高转化欧美银行/卡种/地区专属长尾落地页 (pSEO 流量矩阵)
  // ==========================================================================
  {
    slug: "chase-statement-pdf-to-qbo-csv",
    navLabel: "Chase PDF to QBO / Excel",
    badge: "US Banking • MM/DD",
    regionTag: "US",
    defaultExportFormat: "qbo",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert Chase Bank & Card PDF Statements to QBO, Excel & CSV",
    seoDescription:
      "Extract historical Chase Total Checking, Business Complete, and Sapphire PDF statements into math-verified QuickBooks (.QBO), Xero CSV, or Excel files.",
    keywords: [
      "convert chase pdf statement to qbo",
      "chase bank statement pdf to excel converter",
      "chase business checking pdf to csv quickbooks",
    ],
    h1: "Convert Chase-Format PDF Statements to .QBO, CSV & Excel",
    subtitle:
      "Need to import archived Chase Business or Personal PDF statements older than your live feed window? Automatically parse MM/DD short dates, separate deposits from ATM/card withdrawals, and export to QuickBooks or Excel.",
    painPointsSolved: [
      {
        title: "Auto-Completes Short MM/DD Statement Dates",
        detail:
          "Chase PDFs print transaction rows as '10/04' without the year. StatementFlow automatically binds the statement period year to produce valid YYYY-MM-DD / MM/DD/YYYY dates.",
      },
      {
        title: "Merges Split Deposit & Withdrawal Sections",
        detail:
          "Combines separate 'Deposits and Additions' and 'Electronic Withdrawals' blocks into one unified chronological ledger.",
      },
      {
        title: "Verifies Beginning vs Ending Balance",
        detail:
          "Cross-checks extracted rows against the summary box on Page 1 to guarantee $0.00 discrepancy.",
      },
    ],
    technicalSpecNotes: [
      { label: "Date Normalization", value: "Short MM/DD -> Full MM/DD/YYYY" },
      { label: "Supported Layouts", value: "Business Complete, Checking & Ink/Sapphire Cards" },
      { label: "Direct Export", value: "QuickBooks .QBO, 4-Col CSV & Verified .XLSX" },
    ],
    faqs: [
      {
        question: "How do I import older Chase PDF statements into QuickBooks Online?",
        answer:
          "Upload your downloaded PDF statement above, verify the green $0.00 reconciliation badge, and click 'Download .QBO'. In QuickBooks Online, go to Transactions > Bank Transactions > Upload from file.",
      },
    ],
  },
  {
    slug: "bank-of-america-pdf-to-qbo",
    navLabel: "Bank of America PDF to QBO",
    badge: "US Banking • QBO/CSV",
    regionTag: "US",
    defaultExportFormat: "qbo",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert Bank of America PDF Statement to QBO, CSV & Excel",
    seoDescription:
      "Convert Bank of America Advantage & Business PDF statements into QuickBooks Web Connect (.QBO), Xero CSV, and reconciled Excel spreadsheets.",
    keywords: [
      "convert bank of america pdf statement to qbo",
      "bofa pdf statement to excel converter",
      "import bank of america pdf into quickbooks",
    ],
    h1: "Bank of America PDF Statement to QuickBooks (.QBO) & Excel",
    subtitle:
      "Extract multi-page Bank of America PDF statements—automatically stitching 'Deposits and Other Additions', 'Withdrawals', and 'Checks' sections into a 100% reconciled file.",
    painPointsSolved: [
      {
        title: "Stitches Multi-Section BofA Layouts",
        detail:
          "Combines separate Deposit, Card Purchase, and Check tables into a single clean ledger.",
      },
      {
        title: "Strips Confirmation # Clutter for Clean Payees",
        detail:
          "Extracts clean vendor payee names while preserving DES/INDN/CO ID details in the memo column.",
      },
      {
        title: "100% Reconciled Against Summary Box",
        detail:
          "Verifies that total additions and subtractions match your statement ending balance.",
      },
    ],
    technicalSpecNotes: [
      { label: "Section Handling", value: "Deposits + Withdrawals + Checks Unified" },
      { label: "Output Formats", value: "Intuit .QBO, QuickBooks CSV & .XLSX" },
      { label: "Privacy", value: "Zero-Retention RAM Extraction" },
    ],
    faqs: [
      {
        question: "Can it handle 10+ page business checking PDF statements?",
        answer:
          "Yes. Multi-page PDFs are merged seamlessly while stripping repeated page headers and legal disclaimers.",
      },
    ],
  },
  {
    slug: "wells-fargo-statement-pdf-to-excel",
    navLabel: "Wells Fargo PDF to Excel",
    badge: "US Banking • Running Bal",
    regionTag: "US",
    defaultExportFormat: "xlsx",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert Wells Fargo PDF Statement to Excel, QBO & CSV",
    seoDescription:
      "Extract Wells Fargo personal and business checking PDF statements to Excel (.XLSX), QuickBooks (.QBO), and CSV with row-by-row daily balance verification.",
    keywords: [
      "wells fargo pdf statement to excel",
      "convert wells fargo bank statement pdf to csv",
      "wells fargo pdf to qbo converter",
    ],
    h1: "Convert Wells Fargo PDF Statements to Excel, .QBO & CSV",
    subtitle:
      "Turn archived Wells Fargo PDF statements into clean spreadsheets or QuickBooks .QBO files—verified against printed Ending Daily Balances.",
    painPointsSolved: [
      {
        title: "Separates 'Additions' vs 'Subtractions' Columns",
        detail:
          "Accurately maps Wells Fargo's dual-column transaction grid into clean Debit and Credit fields.",
      },
      {
        title: "Daily Ending Balance Cross-Check",
        detail:
          "Uses printed daily ending balances to verify every single transaction row.",
      },
      {
        title: "Check Number Extraction",
        detail:
          "Captures check numbers alongside transaction descriptions for accountant workpapers.",
      },
    ],
    technicalSpecNotes: [
      { label: "Grid Parser", value: "Dual-Column Additions/Subtractions + Daily Balance" },
      { label: "Primary Output", value: "2-Tab Verified .XLSX & QuickBooks .QBO" },
      { label: "Accuracy", value: "Cents-Exact Math Audit" },
    ],
    faqs: [
      {
        question: "Does this work on older archived Wells Fargo PDF statements?",
        answer:
          "Yes, both native digital PDFs and scanned paper archive copies are supported.",
      },
    ],
  },
  {
    slug: "amex-credit-card-pdf-to-excel",
    navLabel: "Amex PDF to Excel / QBO",
    badge: "Corporate & Business Card",
    regionTag: "US",
    defaultExportFormat: "qbo",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "credit_card",
    seoTitle:
      "Convert American Express (Amex) PDF Statement to Excel, QBO & Xero",
    seoDescription:
      "Convert American Express Business Platinum, Gold, and Corporate PDF statements into QuickBooks (.QBO), Xero CSV, and Excel—handling multi-employee sub-cards.",
    keywords: [
      "convert amex pdf statement to excel",
      "american express pdf to qbo converter",
      "amex business card pdf to csv xero",
    ],
    h1: "Convert Amex Credit Card PDF Statements to .QBO, Excel & Xero",
    subtitle:
      "Cleanly extract American Express PDF statements with multiple employee cardholders, foreign currency sub-lines, and 'CR' credit adjustments.",
    painPointsSolved: [
      {
        title: "Recognizes Trailing 'CR' Credits & Payments",
        detail:
          "Amex prints payments and merchant refunds with a 'CR' symbol or minus sign. Our parser routes them to Credits automatically.",
      },
      {
        title: "Consolidates Employee Sub-Card Sections",
        detail:
          "Merges primary and supplementary cardmember charges into one reconcilable table.",
      },
      {
        title: "Ready for QuickBooks Credit Card Feeds",
        detail:
          "Exports .QBO files pre-tagged with <ACCTTYPE>CREDITLINE.",
      },
    ],
    technicalSpecNotes: [
      { label: "Credit Detection", value: "Auto-parses 'CR' & Payment Sections" },
      { label: "QBO Tag", value: "<ACCTTYPE>CREDITLINE" },
      { label: "Exports", value: ".QBO, Xero CSV, .XLSX" },
    ],
    faqs: [
      {
        question: "Does it separate Amex payments/refunds from new charges?",
        answer:
          "Yes. Payments and merchant credits are placed in the Credit (+) column while card purchases go to Debit (-).",
      },
    ],
  },
  {
    slug: "citi-capital-one-pdf-to-csv",
    navLabel: "Citi & Capital One PDF",
    badge: "US Card & Checking",
    regionTag: "US",
    defaultExportFormat: "qbo_csv",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "credit_card",
    seoTitle:
      "Convert Citi & Capital One Spark PDF Statements to QBO, CSV & Excel",
    seoDescription:
      "Extract Citibank and Capital One Spark Business PDF statements into QuickBooks (.QBO), 4-column CSV, Xero CSV, and verified Excel workbooks.",
    keywords: [
      "convert capital one pdf statement to csv",
      "citibank pdf statement to excel converter",
      "capital one spark pdf to qbo",
    ],
    h1: "Convert Citi & Capital One PDF Statements to CSV, .QBO & Excel",
    subtitle:
      "Extract clean transaction dates, merchant descriptions, and reconciled totals from Capital One Spark and Citibank PDF statements in seconds.",
    painPointsSolved: [
      {
        title: "Handles 'Oct 14' Month-Abbreviation Dates",
        detail:
          "Automatically converts text dates like 'Oct 14' into standard MM/DD/YYYY or YYYY-MM-DD accounting dates.",
      },
      {
        title: "Separates Trans Date vs Post Date",
        detail:
          "Uses official Posting Date for accurate bank reconciliation while preserving clean merchant names.",
      },
      {
        title: "100% Balance Verification",
        detail:
          "Confirms Previous Balance + Purchases - Payments/Credits === New Balance.",
      },
    ],
    technicalSpecNotes: [
      { label: "Date Parser", value: "Text Month ('Oct 14') -> ISO / MM/DD/YYYY" },
      { label: "Supported Statements", value: "Capital One Spark, Venture & Citi Business" },
      { label: "Formats", value: "QuickBooks .QBO, 4-Col CSV & .XLSX" },
    ],
    faqs: [
      {
        question: "Can I import the converted file into QuickBooks Online?",
        answer:
          "Yes—choose either native QuickBooks (.QBO) or QuickBooks 4-Column CSV.",
      },
    ],
  },
  {
    slug: "uk-barclays-lloyds-hsbc-pdf-to-xero",
    navLabel: "UK Banks PDF to Xero CSV",
    badge: "UK • DD/MM/YYYY (£)",
    regionTag: "UK",
    defaultExportFormat: "xero_csv",
    defaultDateFormat: "DD/MM/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "UK Bank Statement PDF to Xero CSV & Excel (Barclays, Lloyds, HSBC, NatWest)",
    seoDescription:
      "Convert UK PDF bank statements (Barclays, Lloyds, HSBC, NatWest, Santander, Monzo) into Xero's exact DD/MM/YYYY CSV format or QuickBooks .QBO.",
    keywords: [
      "barclays pdf statement to xero csv",
      "lloyds bank pdf to excel converter uk",
      "hsbc uk pdf statement to csv xero",
      "natwest pdf statement converter",
    ],
    h1: "UK Bank Statement PDF to Xero CSV & Excel (DD/MM/YYYY)",
    subtitle:
      "Built for UK bookkeepers and limited companies. Convert Barclays, Lloyds, HSBC, NatWest, or Starling PDF statements into strict UK DD/MM/YYYY Xero CSVs with GBP (£) balance reconciliation.",
    painPointsSolved: [
      {
        title: "Native UK DD/MM/YYYY Date Formatting",
        detail:
          "Parses '14 Oct 2026' and '14/10/26' UK dates accurately without flipping day and month into US format.",
      },
      {
        title: "Maps 'Money Out' & 'Money In' to Xero *Amount",
        detail:
          "Merges UK two-column bank layouts into Xero's mandatory single signed *Amount column.",
      },
      {
        title: "MTD & Year-End Workpaper Ready",
        detail:
          "Includes a verified Audit_Certificate Excel tab for UK chartered accountants.",
      },
    ],
    technicalSpecNotes: [
      { label: "Default Date Format", value: "UK Standard DD/MM/YYYY" },
      { label: "Currency Support", value: "GBP (£) & EUR (€) Auto-Stripped for Xero" },
      { label: "Target Software", value: "Xero UK, QuickBooks UK, Sage & FreeAgent" },
    ],
    faqs: [
      {
        question: "Will this swap UK days and months (e.g. 05/10 becoming May 10)?",
        answer:
          "Never. This UK workflow defaults strictly to DD/MM/YYYY so 05/10/2026 stays 5 October 2026 in Xero and Excel.",
      },
    ],
  },
  {
    slug: "australia-commbank-anz-nab-pdf-to-xero",
    navLabel: "AU Banks PDF to Xero / MYOB",
    badge: "Australia • DD/MM/YYYY",
    regionTag: "AU",
    defaultExportFormat: "xero_csv",
    defaultDateFormat: "DD/MM/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Australian Bank PDF Statement to Xero & MYOB CSV (CommBank, ANZ, NAB, Westpac)",
    seoDescription:
      "Convert Australian PDF bank statements (Commonwealth Bank, ANZ, NAB, Westpac) into Xero CSV, MYOB, and reconciled Excel spreadsheets.",
    keywords: [
      "commbank pdf statement to csv xero",
      "anz bank statement pdf to excel",
      "westpac nab pdf statement converter xero",
    ],
    h1: "Australian Bank PDF Statements to Xero CSV & Excel",
    subtitle:
      "For Australian BAS agents, bookkeepers, and Pty Ltd businesses. Convert CommBank, ANZ, NAB, and Westpac PDF statements into DD/MM/YYYY Xero CSVs with 100% balance check.",
    painPointsSolved: [
      {
        title: "Handles Trailing 'DR' & 'CR' Balance Notation",
        detail:
          "Australian statements frequently print running balances as '$14,250.00 CR' or 'DR'. Our parser normalizes these cleanly.",
      },
      {
        title: "Ready for Xero AU & MYOB Import",
        detail:
          "Exports DD/MM/YYYY dates and signed amounts ready for instant BAS reconciliation.",
      },
      {
        title: "Zero-Retention Privacy Compliance",
        detail:
          "Client statements are processed in ephemeral RAM and never stored.",
      },
    ],
    technicalSpecNotes: [
      { label: "Date Standard", value: "Australian DD/MM/YYYY" },
      { label: "Notation Support", value: "Parses CR / DR Balance Suffixes" },
      { label: "Compatible Ledgers", value: "Xero AU, MYOB & QuickBooks AU" },
    ],
    faqs: [
      {
        question: "Does it handle CommBank and Westpac 'CR/DR' balance columns?",
        answer:
          "Yes. Trailing CR and DR markers are parsed automatically and verified against your closing balance.",
      },
    ],
  },
  {
    slug: "canada-rbc-td-bmo-pdf-to-qbo",
    navLabel: "Canadian Banks PDF to QBO",
    badge: "Canada • CAD / USD",
    regionTag: "CA",
    defaultExportFormat: "qbo",
    defaultDateFormat: "YYYY-MM-DD",
    documentKind: "bank_statement",
    seoTitle:
      "Canadian Bank Statement PDF to QuickBooks .QBO & CSV (RBC, TD, BMO, Scotiabank)",
    seoDescription:
      "Convert RBC, TD Canada Trust, BMO, Scotiabank, and CIBC PDF bank statements into QuickBooks (.QBO), Xero CSV, and reconciled Excel files.",
    keywords: [
      "convert rbc pdf statement to csv quickbooks",
      "td bank canada pdf to qbo converter",
      "bmo scotiabank pdf statement to excel",
    ],
    h1: "Canadian Bank PDF Statements to QuickBooks (.QBO) & Excel",
    subtitle:
      "Convert archived RBC, TD, BMO, Scotiabank, and CIBC PDF statements into compliant QuickBooks .QBO or Xero CSV files with penny-exact CAD/USD reconciliation.",
    painPointsSolved: [
      {
        title: "Fixes RBC & TD Missing-Year Date Formats",
        detail:
          "Converts '14 OCT' or 'OCT 14' Canadian statement dates into standard ISO YYYY-MM-DD or MM/DD/YYYY.",
      },
      {
        title: "Supports Both CAD & USD Business Accounts",
        detail:
          "Preserves currency codes in .QBO headers for multi-currency Canadian corporations.",
      },
      {
        title: "Verified Closing Balance Proof",
        detail:
          "Confirms Opening Balance + Deposits - Withdrawals === Closing Balance.",
      },
    ],
    technicalSpecNotes: [
      { label: "Supported Banks", value: "RBC, TD, BMO, Scotiabank, CIBC" },
      { label: "Currencies", value: "CAD & USD Cross-Border Accounts" },
      { label: "Export Formats", value: ".QBO Web Connect, Xero CSV, .XLSX" },
    ],
    faqs: [
      {
        question: "Why can't I download older CSVs directly from RBC or TD online banking?",
        answer:
          "Many Canadian banks restrict CSV/QBO downloads to recent months while providing up to 7 years of PDF statements. StatementFlow turns those archived PDFs back into importable .QBO files.",
      },
    ],
  },
  {
    slug: "wise-revolut-mercury-pdf-to-csv",
    navLabel: "Wise / Revolut / Mercury PDF",
    badge: "Neobanks & Multi-Currency",
    regionTag: "Global",
    defaultExportFormat: "xero_csv",
    defaultDateFormat: "YYYY-MM-DD",
    documentKind: "bank_statement",
    seoTitle:
      "Convert Wise, Revolut, Mercury & Relay PDF Statements to QBO, Xero & Excel",
    seoDescription:
      "Cleanly extract multi-currency Wise, Revolut Business, Mercury, Payoneer, and Airwallex PDF statements into Xero CSV, QuickBooks (.QBO), and Excel.",
    keywords: [
      "wise pdf statement to csv xero",
      "revolut business pdf to qbo converter",
      "mercury bank pdf statement to excel",
    ],
    h1: "Wise, Revolut & Mercury PDF Statements to Xero, .QBO & Excel",
    subtitle:
      "Fintech and cross-border statements include multi-line FX conversion fees and IBAN/SWIFT references. Extract clean net settlement amounts and verify running balances.",
    painPointsSolved: [
      {
        title: "Separates FX Fee Sub-Lines from Principal Transfers",
        detail:
          "Prevents foreign exchange rate notes from corrupting transaction rows.",
      },
      {
        title: "Multi-Currency Bucket Ready",
        detail:
          "Works with USD, GBP, EUR, AUD, and CAD currency pots for e-commerce and SaaS bookkeeping.",
      },
      {
        title: "Instant .QBO & Xero Export",
        detail:
          "Import directly into Xero multi-currency bank accounts or QuickBooks Online.",
      },
    ],
    technicalSpecNotes: [
      { label: "Platforms", value: "Wise, Revolut, Mercury, Relay, Payoneer" },
      { label: "Currencies", value: "USD, GBP, EUR, AUD, CAD" },
      { label: "Audit Check", value: "100% Running Balance Verification" },
    ],
    faqs: [
      {
        question: "Does it handle Wise fee lines properly?",
        answer:
          "Yes, fee deductions and principal transfers are reconciled against the printed running balance so your closing balance matches to the cent.",
      },
    ],
  },
  {
    slug: "rent-roll-loan-statement-pdf-to-excel",
    navLabel: "Rent Roll & Loan Statements",
    badge: "Real Estate & Lending",
    regionTag: "Global",
    defaultExportFormat: "xlsx",
    defaultDateFormat: "MM/DD/YYYY",
    documentKind: "bank_statement",
    seoTitle:
      "Convert Property Management Rent Roll & Loan Statement PDFs to Excel",
    seoDescription:
      "Extract property management owner statements, tenant rent rolls, and commercial mortgage loan PDF statements into verified Excel workbooks and QuickBooks CSVs.",
    keywords: [
      "convert rent roll pdf to excel",
      "property management owner statement pdf to csv",
      "mortgage loan statement pdf to excel",
    ],
    h1: "Property Rent Roll & Loan Statement PDF to Verified Excel",
    subtitle:
      "For real estate investors, landlords, and mortgage underwriters. Extract monthly property trust statements, repairs, management fees, and escrow balances into clean spreadsheets.",
    painPointsSolved: [
      {
        title: "Separates Gross Rent Inflows vs Maintenance Deductions",
        detail:
          "Splits owner distribution statements into gross rental credits and itemized repair/management fee debits.",
      },
      {
        title: "Underwriting & Tax Schedule E Ready",
        detail:
          "Exports clean multi-tab .XLSX workbooks ideal for CPA tax prep and lender underwriting.",
      },
      {
        title: "Zero Manual Retyping",
        detail:
          "Reconciles beginning trust balance to ending owner distribution automatically.",
      },
    ],
    technicalSpecNotes: [
      { label: "Use Cases", value: "Owner Statements, Rent Rolls, Loan Escrow PDFs" },
      { label: "Verification", value: "Gross Rent - Fees/Repairs === Net Distribution" },
      { label: "Output", value: "2-Tab Verified .XLSX, .QBO & CSV" },
    ],
    faqs: [
      {
        question: "Can I use this to prepare Schedule E rental property bookkeeping?",
        answer:
          "Yes! Landlords and CPAs use this workflow to turn 12 monthly property manager PDFs into a single reconciled Excel ledger.",
      },
    ],
  },
];

export function getSeoWorkflowBySlug(slug: string): SeoWorkflowPage | undefined {
  return seoPagesConfig.find((p) => p.slug === slug);
}
