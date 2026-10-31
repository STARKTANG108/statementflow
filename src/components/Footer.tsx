import React from "react";
import Link from "next/link";
import { FileCheck2, Lock } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { seoPagesConfig } from "@/config/seoPages.config";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 font-bold text-lg"
          >
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>{siteConfig.brandName}</span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Retention Ephemeral Processing</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
            Accounting Converters
          </h3>
          <ul className="space-y-2.5 text-sm">
            {seoPagesConfig.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/convert/${page.slug}`}
                  className="hover:text-slate-900 transition"
                >
                  {page.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
            Free Bookkeeper Utilities
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/tools/qbo-viewer"
                className="hover:text-slate-900 transition"
              >
                Free Online .QBO / .OFX File Viewer
              </Link>
            </li>
            <li>
              <Link
                href="/tools/csv-to-qbo"
                className="hover:text-slate-900 transition"
              >
                Free CSV to QuickBooks (.QBO) Builder
              </Link>
            </li>
            <li>
              <Link
                href="/samples/sample-bank-statement.pdf"
                className="hover:text-slate-900 transition"
              >
                Download Sample PDF Bank Statement
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
            Security, Pricing &amp; Legal
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/pricing" className="hover:text-slate-900 transition">
                Pricing &amp; Page Quota
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-slate-900 transition">
                Zero-Retention Security Architecture
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-slate-900 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-slate-900 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-slate-900 transition">
                Refund Policy
              </Link>
            </li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            Support:{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-slate-900 underline"
            >
              {siteConfig.supportEmail}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © 2026 {siteConfig.brandName}. Independent accounting workflow utility. QuickBooks® and Xero™ are trademarks of Intuit Inc. and Xero Limited respectively.
      </div>
    </footer>
  );
}
