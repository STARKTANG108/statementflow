"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Upload, Download, ShieldCheck, ArrowRight } from "lucide-react";
import { StatementDocument } from "@/lib/types";
import {
  parseQboOrOfxContent,
  generateXeroCsvContent,
  generateVerifiedXlsxArrayBuffer,
} from "@/lib/exporters";
import { runReconciliationAudit } from "@/lib/reconcile";

export default function QboViewerClient() {
  const [parsedDoc, setParsedDoc] = useState<StatementDocument | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadRawText = (raw: string, fileName: string) => {
    setErrorMsg(null);
    if (!raw.toUpperCase().includes("<OFX")) {
      setErrorMsg(
        "This file does not contain valid <OFX> / .QBO Web Connect tags."
      );
      return;
    }
    const doc = parseQboOrOfxContent(raw);
    doc.fileName = fileName;
    setParsedDoc(doc);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadRawText(String(reader.result || ""), file.name);
    reader.readAsText(file);
  };

  const loadSampleQbo = async () => {
    const res = await fetch("/samples/sample-quickbooks.qbo");
    const txt = await res.text();
    loadRawText(txt, "sample-quickbooks.qbo");
  };

  const downloadAsXlsx = () => {
    if (!parsedDoc) return;
    const audit = runReconciliationAudit(parsedDoc);
    const buf = generateVerifiedXlsxArrayBuffer(
      parsedDoc,
      audit,
      "MM/DD/YYYY",
      false
    );
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inspected-qbo.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsXeroCsv = () => {
    if (!parsedDoc) return;
    const csv = generateXeroCsvContent(parsedDoc, "DD/MM/YYYY");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qbo-converted-to-xero.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 rounded-2xl p-8 text-center bg-emerald-50/40 cursor-pointer transition"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".qbo,.ofx,.qfx,.txt"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
          <Upload className="w-9 h-9 text-emerald-700 mx-auto mb-2" />
          <p className="text-base font-bold text-slate-900">
            Drop .QBO, .OFX, or .QFX File Here to Inspect Instantly
          </p>
          <p className="text-xs text-slate-600 mt-1 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Client-Side Browser Parser — Your Financial File Never Leaves Your Computer
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 text-xs">
          <button
            type="button"
            onClick={loadSampleQbo}
            className="font-semibold text-emerald-700 underline cursor-pointer"
          >
            Don&apos;t have a .QBO file handy? Click to Load Sample .QBO File →
          </button>

          <Link
            href="/convert/pdf-to-qbo"
            className="font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
          >
            Need to convert a PDF into .QBO instead?{" "}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        {parsedDoc && (
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-x-3 tabular-nums">
                <span>
                  <strong className="text-slate-900">Feed:</strong>{" "}
                  {parsedDoc.institutionName}
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-900">Account:</strong> ****
                  {parsedDoc.accountLast4}
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-900">Ledger Balance:</strong>{" "}
                  {parsedDoc.closingBalance.toFixed(2)} {parsedDoc.currency}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadAsXlsx}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Convert .QBO to Excel (.XLSX)
                </button>
                <button
                  type="button"
                  onClick={downloadAsXeroCsv}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Convert to Xero CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs tabular-nums">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Payee / Name</th>
                    <th className="py-2.5 px-3">Memo</th>
                    <th className="py-2.5 px-3">FITID</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {parsedDoc.rows.map((r) => {
                    const signed = r.credit - r.debit;
                    return (
                      <tr key={r.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {r.date}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">{r.payee}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {r.description}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                          {r.reference}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-bold ${
                            signed >= 0 ? "text-emerald-700" : "text-slate-900"
                          }`}
                        >
                          {signed >= 0 ? "+" : ""}
                          {signed.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
