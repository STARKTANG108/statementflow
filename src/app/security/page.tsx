import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Trash2, Lock, EyeOff } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Zero-Retention Security & Financial Privacy Architecture",
  description:
    "Learn how StatementFlow protects sensitive bank statements and client financial PDFs with ephemeral RAM-only extraction and optional account redaction.",
};

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Security-First Design for CPAs &amp; Businesses
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Zero-Retention Financial Data Architecture
        </h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          We built {siteConfig.brandName} on a strict principle: we cannot lose
          or leak documents we never store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5">
          <Trash2 className="w-6 h-6 text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">
            Ephemeral RAM Processing
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Uploaded PDFs are read directly from an in-memory buffer, converted
            into structured JSON rows, and immediately garbage-collected—zero
            S3 buckets or database blobs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5">
          <EyeOff className="w-6 h-6 text-slate-900" />
          <h2 className="text-base font-bold text-slate-900">
            Zero AI Model Training
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Financial API calls use enterprise zero-data-retention endpoints
            that prohibit training foundation models on customer inputs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5">
          <Lock className="w-6 h-6 text-blue-700" />
          <h2 className="text-base font-bold text-slate-900">
            Account Number Redaction
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our workbench masks account identifiers before generating .QBO and
            .XLSX workpapers so exported files can be shared safely across your
            team.
          </p>
        </div>
      </div>
    </div>
  );
}
