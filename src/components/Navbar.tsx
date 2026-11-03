"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileCheck2, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const PAGES_QUOTA_KEY = "statementflow_free_pages";
export const QUOTA_UPDATED_EVENT = "statementflow_quota_updated";

export function getRemainingFreePages(): number {
  if (typeof window === "undefined") return siteConfig.freeTrialPages;
  const raw = window.localStorage.getItem(PAGES_QUOTA_KEY);
  if (raw === null) {
    window.localStorage.setItem(
      PAGES_QUOTA_KEY,
      String(siteConfig.freeTrialPages)
    );
    return siteConfig.freeTrialPages;
  }
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? siteConfig.freeTrialPages : parsed;
}

export function consumeFreePages(pages: number): number {
  const current = getRemainingFreePages();
  const next = Math.max(0, current - pages);
  window.localStorage.setItem(PAGES_QUOTA_KEY, String(next));
  window.dispatchEvent(new Event(QUOTA_UPDATED_EVENT));
  return next;
}

export default function Navbar() {
  const [pagesLeft, setPagesLeft] = useState<number>(siteConfig.freeTrialPages);

  useEffect(() => {
    setPagesLeft(getRemainingFreePages());
    const sync = () => setPagesLeft(getRemainingFreePages());
    window.addEventListener(QUOTA_UPDATED_EVENT, sync);
    return () => window.removeEventListener(QUOTA_UPDATED_EVENT, sync);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6E1D6] bg-[#FAF8F5]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Claude Editorial Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#D97757] text-white flex items-center justify-center shadow-sm">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <span className="font-editorial text-xl tracking-tight text-[#141413]">
            {siteConfig.brandName}
          </span>
        </Link>

        {/* Obvious 4-Item Visual Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#57544E]">
          <Link
            href="/convert/pdf-to-qbo"
            className="px-3.5 py-1.5 rounded-full hover:text-[#141413] hover:bg-[#EFECE4] transition"
          >
            PDF → .QBO
          </Link>
          <Link
            href="/convert/pdf-to-xero-csv"
            className="px-3.5 py-1.5 rounded-full hover:text-[#141413] hover:bg-[#EFECE4] transition"
          >
            PDF → Xero
          </Link>
          <Link
            href="/convert/scanned-bank-statement-ocr"
            className="px-3.5 py-1.5 rounded-full hover:text-[#141413] hover:bg-[#EFECE4] transition"
          >
            Scanned PDF
          </Link>
          <Link
            href="/tools/qbo-viewer"
            className="px-3.5 py-1.5 rounded-full hover:text-[#141413] hover:bg-[#EFECE4] transition inline-flex items-center gap-1.5"
          >
            <span>.QBO Viewer</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4EE] text-[#2D6A4F]">
              FREE
            </span>
          </Link>
        </nav>

        {/* Quota & Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/pricing"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3EFE6] text-[#4A4842] border border-[#E2DDD1] hover:border-[#C96442] transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
            <span>{pagesLeft} Free Pages</span>
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#141413] hover:bg-[#2C2B29] text-white transition"
          >
            Pricing
          </Link>
        </div>
      </div>
    </header>
  );
}
