import React from "react";
import { Metadata } from "next";
import CsvToQboClient from "@/components/CsvToQboClient";
import SeoSchema from "@/components/SeoSchema";

export const metadata: Metadata = {
  title: "Free CSV to QuickBooks (.QBO) Web Connect Converter Online",
  description:
    "Convert clean 3-column CSV bank or credit card transactions into native QuickBooks Web Connect (.QBO) files with INTU.BID 3000 & deduplicated FITIDs free.",
  keywords: [
    "convert csv to qbo free",
    "csv to quickbooks web connect converter",
    "free csv to qbo online",
  ],
};

const CSV_QBO_FAQS = [
  {
    question: "Why convert CSV to .QBO instead of importing CSV directly?",
    answer:
      "QuickBooks Desktop does not natively import raw bank CSVs without Web Connect (.QBO), and QuickBooks Online handles .QBO files much more reliably thanks to embedded FITID duplicate protection.",
  },
  {
    question: "How should negative vs positive amounts be formatted?",
    answer:
      "Format outflows/purchases with a leading minus sign (e.g., -28.80) and deposits/payments as positive numbers (e.g., 2450.00).",
  },
];

export default function CsvToQboPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      <SeoSchema
        name="Free CSV to QuickBooks (.QBO) Converter"
        description="Convert 3-column CSV bank transactions into compliant QuickBooks .QBO files in your browser."
        urlPath="/tools/csv-to-qbo"
        faqs={CSV_QBO_FAQS}
        isFreeTool
      />

      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          100% Free Local Utility
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Free CSV to QuickBooks (.QBO) Builder
        </h1>
        <p className="text-base text-slate-600">
          Already have clean CSV rows? Package them into a spec-compliant
          QuickBooks Web Connect (.QBO) file with INTU.BID 3000 headers locally
          in your browser.
        </p>
      </div>

      <CsvToQboClient />

      <section className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          Frequently Asked Questions
        </h2>
        {CSV_QBO_FAQS.map((f, i) => (
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
