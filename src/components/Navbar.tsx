"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck2, FileText } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
              {siteConfig.brandName}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 tracking-wide mt-0.5">
              VERIFIED RECONCILIATION
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/convert/pdf-to-qbo"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
          >
            PDF to .QBO
          </Link>
          <Link
            href="/convert/pdf-to-xero-csv"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
          >
            PDF to Xero CSV
          </Link>
          <Link
            href="/convert/scanned-bank-statement-ocr"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
          >
            Scanned OCR
          </Link>
          <Link
            href="/convert/invoice-pdf-to-excel"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
          >
            Invoices to Excel
          </Link>
          <Link
            href="/tools/qbo-viewer"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition inline-flex items-center gap-1.5"
          >
            <span>.QBO Viewer</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              FREE
            </span>
          </Link>
          <Link
            href="/security"
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Retention</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/pricing"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 transition"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>{pagesLeft} Free Pages</span>
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
          >
            Pricing &amp; Plans
          </Link>
        </div>
      </div>
    </header>
  );
}
