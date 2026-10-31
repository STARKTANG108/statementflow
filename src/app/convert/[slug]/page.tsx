import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import {
  seoPagesConfig,
  getSeoWorkflowBySlug,
} from "@/config/seoPages.config";
import { siteConfig } from "@/config/site.config";
import StatementWorkbench from "@/components/StatementWorkbench";
import SeoSchema from "@/components/SeoSchema";

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
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-20">
      <SeoSchema
        name={page.h1}
        description={page.seoDescription}
        urlPath={`/convert/${page.slug}`}
        faqs={page.faqs}
      />

      {/* Hero + Pre-configured Commercial Workbench */}
      <section className="space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            {page.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            {page.h1}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {page.subtitle}
          </p>
        </div>

        <StatementWorkbench
          defaultExportFormat={page.defaultExportFormat}
          defaultDateFormat={page.defaultDateFormat}
          defaultDocumentKind={page.documentKind}
        />
      </section>

      {/* Format Technical Specifications Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {page.technicalSpecNotes.map((spec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {spec.label}
            </span>
            <p className="text-sm font-bold text-white">{spec.value}</p>
          </div>
        ))}
      </section>

      {/* Pain Points Solved */}
      <section className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">
          How This Solves Broken Accounting Imports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {page.painPointsSolved.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h3>{item.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow-Specific FAQs */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          Technical &amp; Accounting FAQs
        </h2>
        <div className="space-y-4">
          {page.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2"
            >
              <h3 className="text-base font-bold text-slate-900">
                {faq.question}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Accounting Converters Internal Link Matrix */}
      <section className="pt-8 border-t border-slate-200 space-y-5">
        <h2 className="text-lg font-extrabold text-slate-900">
          Related Financial Document Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siblingPages.map((sib) => (
            <Link
              key={sib.slug}
              href={`/convert/${sib.slug}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-900 p-4 flex flex-col justify-between gap-3 transition"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {sib.badge}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {sib.navLabel}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-600 inline-flex items-center gap-1">
                Open Tool <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
