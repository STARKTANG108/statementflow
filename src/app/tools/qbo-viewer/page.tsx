import React from "react";
import { Metadata } from "next";
import QboViewerClient from "@/components/QboViewerClient";
import SeoSchema from "@/components/SeoSchema";

export const metadata: Metadata = {
  title: "Free Online .QBO & .OFX File Viewer & Excel Converter (100% Local)",
  description:
    "Open and inspect QuickBooks Web Connect (.QBO), .OFX, and .QFX bank files online in your browser—and convert .QBO to Excel or Xero CSV free with zero server upload.",
  keywords: [
    "free online qbo file viewer",
    "open qbo file without quickbooks",
    "convert qbo to excel free",
    "ofx file viewer online",
  ],
};

const QBO_VIEWER_FAQS = [
  {
    question: "How can I open a .QBO file without importing it into QuickBooks first?",
    answer:
      "Drop your .QBO or .OFX file into the box above. Our client-side parser decodes every transaction date, payee, FITID, and ledger balance right inside your browser so you can audit the file safely before importing.",
  },
  {
    question: "Can I convert a .QBO file into Excel (.XLSX) or Xero CSV?",
    answer:
      "Yes! Once your .QBO file is loaded, click 'Convert .QBO to Excel (.XLSX)' or 'Convert to Xero CSV' at zero cost.",
  },
  {
    question: "Does my client's .QBO file get uploaded to your cloud?",
    answer:
      "No. Parsing happens 100% locally in your browser via JavaScript FileReader.",
  },
];

export default function QboViewerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      <SeoSchema
        name="Free Online .QBO & .OFX File Viewer"
        description="Inspect QuickBooks .QBO and .OFX files locally in your browser and convert to Excel/CSV free."
        urlPath="/tools/qbo-viewer"
        faqs={QBO_VIEWER_FAQS}
        isFreeTool
      />

      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          100% Free Bookkeeper Utility • Zero Server Upload
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Free Online .QBO &amp; .OFX File Viewer
        </h1>
        <p className="text-base text-slate-600">
          Audit QuickBooks Web Connect (.QBO) transaction rows, FITIDs, and
          closing ledger balances before touching your client&apos;s books—or
          convert .QBO to Excel in one click.
        </p>
      </div>

      <QboViewerClient />

      <section className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          Frequently Asked Questions
        </h2>
        {QBO_VIEWER_FAQS.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-1.5"
          >
            <h3 className="text-sm font-bold text-slate-900">{f.question}</h3>
            <p className="text-sm text-slate-600">{f.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
