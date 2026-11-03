import React from "react";
import Link from "next/link";
import { FileCheck2, Lock } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { seoPagesConfig } from "@/config/seoPages.config";

export default function Footer() {
  return (
    <footer className="border-t border-[#E6E1D6] bg-[#F3EFE6]/70 text-[#6B6860] mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#141413] font-editorial text-xl"
          >
            <FileCheck2 className="w-5 h-5 text-[#D97757]" />
            <span>{siteConfig.brandName}</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F] bg-[#EAF4EE] border border-[#C6E2D1] px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Retention Memory Only</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-3">
            Converters
          </h3>
          <ul className="space-y-2 text-xs">
            {seoPagesConfig.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/convert/${page.slug}`}
                  className="hover:text-[#141413] transition"
                >
                  {page.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-3">
            Free Utilities
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href="/tools/qbo-viewer"
                className="hover:text-[#141413] transition"
              >
                Free .QBO / .OFX Viewer
              </Link>
            </li>
            <li>
              <Link
                href="/tools/csv-to-qbo"
                className="hover:text-[#141413] transition"
              >
                Free CSV to .QBO Builder
              </Link>
            </li>
            <li>
              <Link
                href="/samples/sample-bank-statement.pdf"
                className="hover:text-[#141413] transition"
              >
                Sample Bank PDF
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-3">
            Company &amp; Legal
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/pricing" className="hover:text-[#141413] transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/security"
                className="hover:text-[#141413] transition"
              >
                Security
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#141413] transition">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#141413] transition">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-[#141413] transition">
                Refunds
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E6E1D6] py-5 text-center text-xs text-[#87837B]">
        © 2026 {siteConfig.brandName} •{" "}
        <a
          href={`mailto:${siteConfig.supportEmail}`}
          className="underline hover:text-[#141413]"
        >
          {siteConfig.supportEmail}
        </a>
      </div>
    </footer>
  );
}
