import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          1. Ephemeral Zero-Retention Processing
        </h2>
        <p>
          Uploaded PDF statements and invoices are processed strictly in volatile
          server memory (RAM) to return structured rows to your browser and are
          never persisted to disk, object storage, or training datasets.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          2. Billing &amp; Merchant of Record
        </h2>
        <p>
          Payments and tax invoices are handled by our PCI-DSS Level 1 Merchant
          of Record partner. {siteConfig.brandName} only stores your account
          email and remaining page quota.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">3. Privacy Inquiries</h2>
        <p>
          Reach our data protection contact at{" "}
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
