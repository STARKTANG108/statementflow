/**
 * ============================================================================
 * StatementFlow 2.0 全局品牌与高复购 B2B 定价配置 (site.config.ts)
 * ============================================================================
 * 推荐可注册专业财经 SaaS 域名方向（Cloudflare Registrar 约 $9/年）：
 * - statementflow.io / getstatementflow.com
 * - ledgersnap.com / verifyledger.com
 * - qbobridge.com / xeroflowcsv.com
 */

export interface SaaSPricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  pagesIncluded: number;
  billingType: "one_time" | "recurring";
  checkoutProductIdEnvKey: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

export const siteConfig = {
  brandName: "StatementFlow",
  tagline: "Reconciled PDF Bank Statement & Invoice Converter to QBO, Xero & Excel",
  description:
    "Convert digital or scanned PDF bank statements, credit cards, and supplier invoices into 100% math-reconciled QuickBooks (.QBO), Xero CSV, and Excel workbooks in seconds.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://getstatementflow.com",
  supportEmail: "support@getstatementflow.com",
  freeTrialPages: 5,

  pricingPlans: [
    {
      id: "tax-season-pass",
      name: "Tax Season Pass",
      badge: "No Subscription",
      price: "$15",
      period: "one-time (never expires)",
      pagesIncluded: 80,
      billingType: "one_time",
      checkoutProductIdEnvKey: "CREEM_PRODUCT_TAX_PASS",
      description:
        "Ideal for small business owners & landlords organizing annual tax statements.",
      features: [
        "80 PDF Statement Pages (never expire)",
        "100% Math Auto-Reconciliation check",
        "Native QuickBooks (.QBO) & Xero CSV export",
        "Multi-sheet verified Excel (.XLSX) certificate",
        "Zero-retention memory-only processing",
      ],
      highlighted: false,
      ctaText: "Buy 80-Page Pass — $15",
    },
    {
      id: "smb-starter",
      name: "SMB Monthly",
      badge: "Most Popular",
      price: "$19",
      period: "/ month",
      pagesIncluded: 250,
      billingType: "recurring",
      checkoutProductIdEnvKey: "CREEM_PRODUCT_SMB_MONTHLY",
      description:
        "Built for founders, e-commerce sellers, and monthly bookkeeping reconciliation.",
      features: [
        "250 Statement & Invoice Pages / month",
        "Scanned & paper PDF VLM OCR engine",
        "QuickBooks (.QBO), Xero CSV & Excel export",
        "Smart polarity-flip error auto-detection",
        "Account number privacy redaction",
      ],
      highlighted: true,
      ctaText: "Start SMB Plan — $19/mo",
    },
    {
      id: "bookkeeper-pro",
      name: "Bookkeeper & CPA Pro",
      badge: "Firms & Agencies",
      price: "$39",
      period: "/ month",
      pagesIncluded: 1200,
      billingType: "recurring",
      checkoutProductIdEnvKey: "CREEM_PRODUCT_CPA_PRO",
      description:
        "High-volume client statement & supplier invoice extraction for accounting firms.",
      features: [
        "1,200 Statement & Invoice Pages / month",
        "Multi-currency support (USD, GBP, EUR, AUD, CAD)",
        "Supplier Invoice line-item extraction",
        "Audit Certificate sheet for client workpapers",
        "Priority dedicated processing queue",
      ],
      highlighted: false,
      ctaText: "Start CPA Pro — $39/mo",
    },
  ] as SaaSPricingPlan[],
};
