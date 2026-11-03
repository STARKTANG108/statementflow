"use client";

import React, { useState } from "react";
import { Check, RefreshCw } from "lucide-react";
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
    setNotice("Free trial quota reset to 5 pages.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 space-y-12">
      <div className="max-w-xl mx-auto text-center space-y-3">
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#141413]">
          Simple, transparent pricing
        </h1>
        <p className="text-sm text-[#6B6860]">
          Pay once for tax season, or subscribe monthly for client bookkeeping.
        </p>
      </div>

      {notice && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#FFF6F2] border border-[#D97757]/40 text-xs text-[#141413] text-center font-medium">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {siteConfig.pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-7 flex flex-col justify-between border bg-white transition ${
              plan.highlighted
                ? "border-[#D97757] ring-2 ring-[#D97757]/20 shadow-lg"
                : "border-[#E6E1D6]"
            }`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-editorial text-2xl text-[#141413]">
                  {plan.name}
                </h2>
                {plan.badge && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      plan.highlighted
                        ? "bg-[#D97757] text-white"
                        : "bg-[#F3EFE6] text-[#57544E]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="font-editorial text-4xl text-[#141413]">
                  {plan.price}
                </span>
                <span className="text-xs text-[#6B6860]">{plan.period}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#EFECE4]">
                {plan.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#4A4842]"
                  >
                    <Check className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`mt-8 w-full py-3 px-5 rounded-full font-semibold text-xs transition cursor-pointer ${
                plan.highlighted
                  ? "bg-[#D97757] hover:bg-[#C46243] text-white"
                  : "bg-[#141413] hover:bg-[#2C2B29] text-white"
              }`}
            >
              {loadingPlan === plan.id ? "Loading..." : plan.ctaText}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={resetFreeQuota}
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6860] hover:text-[#141413] underline cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Reset 5 Free Trial Pages (Local Preview)
        </button>
      </div>
    </div>
  );
}
