import React from "react";
import { Metadata } from "next";
import QboViewerClient from "@/components/QboViewerClient";
import SeoSchema from "@/components/SeoSchema";

export const metadata: Metadata = {
  title: "Free Online .QBO & .OFX File Viewer & Excel Converter",
  description:
    "Open and inspect QuickBooks Web Connect (.QBO) and .OFX files in your browser and convert to Excel or Xero CSV free.",
};

const QBO_VIEWER_FAQS = [
  {
    question: "How do I open a .QBO file without QuickBooks?",
    answer:
      "Drop your .QBO or .OFX file above to preview transactions and convert to Excel locally in your browser.",
  },
];

export default function QboViewerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <SeoSchema
        name="Free Online .QBO & .OFX File Viewer"
        description="Inspect QuickBooks .QBO and .OFX files locally in your browser."
        urlPath="/tools/qbo-viewer"
        faqs={QBO_VIEWER_FAQS}
        isFreeTool
      />

      <div className="max-w-2xl mx-auto text-center space-y-2.5">
        <span className="inline-block px-3 py-1 rounded-full bg-[#EAF4EE] text-[#2D6A4F] text-xs font-bold">
          100% Free Utility
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#141413]">
          Inspect .QBO &amp; .OFX Files
        </h1>
        <p className="text-sm text-[#6B6860]">
          Preview transactions before importing—or convert .QBO to Excel in one
          click.
        </p>
      </div>

      <QboViewerClient />
    </div>
  );
}
