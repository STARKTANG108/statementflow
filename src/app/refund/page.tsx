import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900">Refund Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          1. 7-Day Accuracy &amp; Satisfaction Guarantee
        </h2>
        <p>
          If you purchase a Tax Season Pass or monthly plan and have processed
          fewer than 15 pages within 7 days of purchase—or if a statement fails
          to import cleanly into QuickBooks or Xero—we provide a 100% full
          refund upon request.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          2. Subscription Cancellation
        </h2>
        <p>
          Recurring plans can be canceled anytime in one click with zero
          cancellation penalties.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">
          3. Requesting a Refund
        </h2>
        <p>
          Email your receipt ID to{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="text-slate-900 font-semibold underline"
          >
            {siteConfig.supportEmail}
          </a>{" "}
          for prompt processing within 1–2 business days.
        </p>
      </section>
    </div>
  );
}
