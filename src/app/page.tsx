import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calculator,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { seoPagesConfig } from "@/config/seoPages.config";
import StatementWorkbench from "@/components/StatementWorkbench";
import SeoSchema from "@/components/SeoSchema";

const HOME_FAQS = [
  {
    question: "How does StatementFlow prevent AI hallucinations on bank numbers?",
    answer:
      "Every extracted PDF runs through our deterministic cents-math Reconciliation Engine: we verify Opening Balance + Total Credits - Total Debits === Closing Balance and check every printed running balance row before you export.",
  },
  {
    question: "Can I import the exported .QBO and CSV files straight into QuickBooks and Xero?",
    answer:
      "Yes. Our native .QBO generator includes compliant OFX 102 headers, INTU.BID 3000 bank tags, and deduplicated FITIDs; our Xero exporter outputs exact *Date and signed *Amount columns.",
  },
  {
    question: "Do you store uploaded bank statements or tax documents?",
    answer:
      "Never. StatementFlow operates on a strict Zero-Retention architecture—uploaded PDFs are parsed in ephemeral server RAM and purged immediately after returning your structured grid.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-10">
      <SeoSchema
        name={`${siteConfig.brandName} — Verified Bank Statement Converter`}
        description={siteConfig.description}
        urlPath="/"
        faqs={HOME_FAQS}
      />

      {/* Above-the-Fold Hero + Full Commercial Reconciliation Workbench */}
      <section className="pt-10 sm:pt-14 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Built for Bookkeepers, CPAs &amp; Small Business Owners</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Convert PDF Bank Statements to{" "}
            <span className="underline decoration-emerald-500 decoration-4 underline-offset-4">
              100% Reconciled
            </span>{" "}
            .QBO, Xero &amp; Excel
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Stop manually re-typing historical PDF statements or fixing broken CSV
            dates. Extract digital or scanned statements, verify{" "}
            <strong className="text-slate-900">$0.00 balance discrepancy</strong>{" "}
            automatically, and import cleanly into QuickBooks or Xero.
          </p>
        </div>

        {/* Live Interactive Workbench */}
        <StatementWorkbench defaultExportFormat="qbo" />
      </section>

      {/* 3 Anti-Wrapper Moat Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Accounting Firms Trust {siteConfig.brandName} Over Generic OCR
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Generic PDF-to-Excel tools dump messy merged cells and leave you guessing whether a digit was misread.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Cents-Accurate Math Audit
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automatically checks Opening + Credits − Debits against your PDF
              Closing Balance and pinpoints exact rows with OCR smudges or
              inverted credit-card signs.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Native .QBO &amp; Xero Templates
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Outputs spec-compliant QuickBooks Web Connect (.QBO) files with
              unique FITIDs and Xero&apos;s strict{" "}
              <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                *Date,*Amount
              </code>{" "}
              signed format—zero formula wrangling.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Zero-Retention Privacy
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Source PDFs are parsed strictly in volatile server memory and
              destroyed immediately. Optional 1-click account number redaction
              keeps client PII safe.
            </p>
          </div>
        </div>
      </section>

      {/* Specialized Accounting Workflow Landing Pages Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Purpose-Built Accounting Conversion Workflows
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Select your target accounting ledger or document type for pre-configured formatting rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoPagesConfig.map((wf) => (
            <Link
              key={wf.slug}
              href={`/convert/${wf.slug}`}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-slate-900 p-6 flex flex-col justify-between transition shadow-sm"
            >
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                  {wf.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {wf.navLabel}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {wf.seoDescription}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Open Dedicated Converter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}

          {/* Free Bookkeeper Magnet Card */}
          <Link
            href="/tools/qbo-viewer"
            className="group bg-emerald-950 text-white rounded-3xl border border-emerald-800 p-6 flex flex-col justify-between transition shadow-sm"
          >
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-800 text-emerald-100">
                <Wrench className="w-3 h-3" />
                100% Free Local Utility
              </span>
              <h3 className="text-lg font-bold">
                Free Online .QBO &amp; .OFX File Viewer
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Inspect any QuickBooks Web Connect (.QBO) or .OFX file locally in
                your browser before importing into your client&apos;s books—or
                convert .QBO to Excel free.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>Launch Free .QBO Inspector</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Home FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {HOME_FAQS.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900">{f.question}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
