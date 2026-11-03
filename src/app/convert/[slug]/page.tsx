import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  seoPagesConfig,
  getSeoWorkflowBySlug,
} from "@/config/seoPages.config";
import { siteConfig } from "@/config/site.config";
import StatementWorkbench from "@/components/StatementWorkbench";
import SeoSchema from "@/components/SeoSchema";
import { HeroPipelineIllustration } from "@/components/VisualDiagrams";

export async function generateStaticParams() {
  return seoPagesConfig.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoWorkflowBySlug(slug);
  if (!page) return {};

  const canonical = `${siteConfig.siteUrl}/convert/${page.slug}`;
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: canonical,
      type: "website",
    },
  };
}

export default async function WorkflowLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSeoWorkflowBySlug(slug);
  if (!page) notFound();

  const siblingPages = seoPagesConfig.filter((p) => p.slug !== page.slug);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      <SeoSchema
        name={page.h1}
        description={page.seoDescription}
        urlPath={`/convert/${page.slug}`}
        faqs={page.faqs}
      />

      {/* Minimal Header + Visual Flow + Obvious Workbench */}
      <section className="space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3EFE6] border border-[#E2DDD1] text-[#141413] text-xs font-semibold">
            {page.badge}
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#141413]">
            {page.h1}
          </h1>
        </div>

        <HeroPipelineIllustration />

        <StatementWorkbench
          defaultExportFormat={page.defaultExportFormat}
          defaultDateFormat={page.defaultDateFormat}
          defaultDocumentKind={page.documentKind}
        />
      </section>

      {/* Compact Spec Pills */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {page.technicalSpecNotes.map((spec, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E6E1D6] p-5 text-center space-y-1"
          >
            <span className="text-[11px] font-semibold text-[#87837B] uppercase tracking-wider">
              {spec.label}
            </span>
            <p className="text-sm font-bold text-[#141413]">{spec.value}</p>
          </div>
        ))}
      </section>

      {/* Minimal FAQ Accordion-Style Cards */}
      <section className="max-w-3xl mx-auto space-y-4">
        <h2 className="font-editorial text-2xl text-[#141413] text-center">
          Common Questions
        </h2>
        {page.faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E6E1D6] p-5 space-y-1.5"
          >
            <h3 className="text-sm font-bold text-[#141413]">{faq.question}</h3>
            <p className="text-xs text-[#6B6860] leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </section>

      {/* Other Format Portals */}
      <section className="pt-6 border-t border-[#E6E1D6] space-y-4">
        <h2 className="font-editorial text-xl text-[#141413]">
          Switch Output Format
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siblingPages.map((sib) => (
            <Link
              key={sib.slug}
              href={`/convert/${sib.slug}`}
              className="group bg-white rounded-2xl border border-[#E6E1D6] hover:border-[#D97757] p-4 flex items-center justify-between transition"
            >
              <div>
                <span className="text-[10px] font-semibold text-[#87837B]">
                  {sib.badge}
                </span>
                <h3 className="text-sm font-bold text-[#141413] mt-0.5">
                  {sib.navLabel}
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#D97757]" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
