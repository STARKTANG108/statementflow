"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, RefreshCw } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { PAGES_QUOTA_KEY, QUOTA_UPDATED_EVENT } from "@/components/Navbar";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId);
    setNotice(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setNotice(data.message || data.error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const resetFreeQuota = () => {
    window.localStorage.setItem(
      PAGES_QUOTA_KEY,
      String(siteConfig.freeTrialPages)
    );
    window.dispatchEvent(new Event(QUOTA_UPDATED_EVENT));
    setNotice("Local preview helper: Free trial quota reset to 5 pages!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-12">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          Expense-Friendly B2B Pricing • Tax Deductible Receipt Included
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Save Hours of Manual Data Entry
        </h1>
        <p className="text-slate-600 text-base">
          One manual bookkeeping mistake costs more than a full year of{" "}
          {siteConfig.brandName}. Pick a one-time Tax Season Pass or recurring
          CPA plan.
        </p>
      </div>

      {notice && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-sm text-emerald-950 text-center font-medium">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {siteConfig.pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col justify-between border bg-white transition ${
              plan.highlighted
                ? "border-slate-900 ring-2 ring-slate-900 shadow-xl"
                : "border-slate-200 shadow-sm"
            }`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                {plan.badge && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      plan.highlighted
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {plan.period}
                </span>
              </div>

              <p className="text-sm text-slate-600">{plan.description}</p>

              <ul className="space-y-3 pt-4 border-t border-slate-100">
                {plan.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`mt-8 w-full py-3.5 px-5 rounded-xl font-bold text-sm transition cursor-pointer ${
                plan.highlighted
                  ? "bg-slate-900 hover:bg-slate-800 text-white"
                  : "bg-emerald-700 hover:bg-emerald-600 text-white"
              }`}
            >
              {loadingPlan === plan.id ? "Initializing..." : plan.ctaText}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center space-y-3 pt-4">
        <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Global VAT/GST invoices issued automatically via Merchant of Record. 7-day satisfaction refund policy.
        </p>
        <div>
          <button
            type="button"
            onClick={resetFreeQuota}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Local Preview Helper: Reset My 5 Free Trial Pages
          </button>
        </div>
      </div>
    </div>
  );
}
