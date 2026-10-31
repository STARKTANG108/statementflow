import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">1. Service Scope</h2>
        <p>
          {siteConfig.brandName} provides automated financial document extraction,
          balance verification, and accounting format conversion utilities. We do
          not provide licensed tax, audit, or legal advice.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          2. User Verification Responsibility
        </h2>
        <p>
          While our deterministic reconciliation engine flags arithmetic
          discrepancies automatically, users and accounting professionals remain
          responsible for reviewing exported ledgers prior to final tax or
          statutory filing.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          3. Authorized Documents Only
        </h2>
        <p>
          You represent that you have lawful authority to process any financial
          statement or vendor invoice uploaded to the service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">4. Support</h2>
        <p>
          Contact us anytime at{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="text-slate-900 font-semibold underline"
          >
            {siteConfig.supportEmail}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
