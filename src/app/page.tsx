import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { seoPagesConfig } from "@/config/seoPages.config";
import StatementWorkbench from "@/components/StatementWorkbench";
import SeoSchema from "@/components/SeoSchema";
import {
  HeroPipelineIllustration,
  VisualComparisonCards,
} from "@/components/VisualDiagrams";

const HOME_FAQS = [
  {
    question: "How does StatementFlow guarantee zero balance errors?",
    answer:
      "Every PDF runs through our cents-math reconciliation engine: Opening + Money In - Money Out === Closing Balance.",
  },
  {
    question: "Are my uploaded PDF statements stored anywhere?",
    answer:
      "No. Files are parsed in volatile server RAM and deleted immediately after extraction.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-12">
      <SeoSchema
        name={`${siteConfig.brandName} — PDF Statement to QBO, Xero & Excel`}
        description={siteConfig.description}
        urlPath="/"
        faqs={HOME_FAQS}
      />

      {/* SECTION 1: Minimal Editorial Hero + Visual Flow Diagram + Obvious Workbench Entry */}
      <section className="pt-10 sm:pt-14 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight text-[#141413] leading-[1.08]">
            PDF statements to clean ledgers,{" "}
            <span className="italic text-[#D97757]">math-verified.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#6B6860]">
            Drop any bank or credit card PDF below. Export to QuickBooks, Xero,
            or Excel in one click.
          </p>
        </div>

        {/* Visual 3-Step Diagram Instead of Text Paragraphs */}
        <HeroPipelineIllustration />

        {/* Primary Obvious Workbench Entry */}
        <StatementWorkbench defaultExportFormat="qbo" />
      </section>

      {/* SECTION 2: 3 Visual Infographic Cards (Minimal Text, Picture-First) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="font-editorial text-2xl sm:text-3xl text-center text-[#141413]">
          How it works at a glance
        </h2>
        <VisualComparisonCards />
      </section>

      {/* SECTION 3: Obvious Visual Entry Portals by Format */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#141413]">
            Choose your target format
          </h2>
          <Link
            href="/tools/qbo-viewer"
            className="text-xs font-semibold text-[#D97757] hover:underline"
          >
            Free .QBO File Viewer →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {seoPagesConfig.map((wf) => (
            <Link
              key={wf.slug}
              href={`/convert/${wf.slug}`}
              className="group bg-white rounded-3xl border border-[#E6E1D6] hover:border-[#D97757] p-6 flex items-center justify-between gap-4 transition shadow-sm"
            >
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3EFE6] text-[#57544E]">
                  {wf.badge}
                </span>
                <h3 className="font-editorial text-xl text-[#141413] group-hover:text-[#D97757] transition">
                  {wf.navLabel}
                </h3>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] group-hover:bg-[#D97757] group-hover:text-white text-[#141413] flex items-center justify-center shrink-0 transition">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </Link>
          ))}

          {/* Free .QBO Viewer Portal Card */}
          <Link
            href="/tools/qbo-viewer"
            className="group bg-[#141413] text-white rounded-3xl p-6 flex items-center justify-between gap-4 transition shadow-sm"
          >
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2D6A4F] text-white">
                100% FREE TOOL
              </span>
              <h3 className="font-editorial text-xl text-white">
                Inspect .QBO / .OFX File
              </h3>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white/10 group-hover:bg-[#D97757] text-white flex items-center justify-center shrink-0 transition">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
