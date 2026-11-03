"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Upload, Download, ArrowRight } from "lucide-react";
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
      setErrorMsg("No valid <OFX> / .QBO Web Connect tags found.");
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
    a.download = "qbo-to-xero.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#E6E1D6] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="border-2 border-dashed border-[#D97757]/60 hover:border-[#D97757] rounded-3xl p-8 text-center bg-[#FAF8F5] cursor-pointer transition"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".qbo,.ofx,.qfx,.txt"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-2xl bg-[#D97757] text-white flex items-center justify-center mx-auto mb-3">
          <Upload className="w-5 h-5" />
        </div>
        <p className="font-editorial text-2xl text-[#141413]">
          Drop .QBO or .OFX File Here
        </p>
        <p className="text-xs text-[#6B6860] mt-1">
          100% Browser-Local — Zero Cloud Upload
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={loadSampleQbo}
          className="px-4 py-1.5 rounded-full bg-[#F3EFE6] hover:bg-[#E6E1D6] font-semibold text-[#141413] cursor-pointer"
        >
          ✓ Load Sample .QBO File
        </button>

        <Link
          href="/convert/pdf-to-qbo"
          className="font-semibold text-[#D97757] hover:underline inline-flex items-center gap-1"
        >
          Convert PDF to .QBO instead <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {parsedDoc && (
        <div className="space-y-4 pt-4 border-t border-[#E6E1D6]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#6B6860] space-x-3 tabular-nums">
              <span>
                <strong className="text-[#141413]">Account:</strong> ****
                {parsedDoc.accountLast4}
              </span>
              <span>•</span>
              <span>
                <strong className="text-[#141413]">Closing:</strong> $
                {parsedDoc.closingBalance.toFixed(2)} {parsedDoc.currency}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadAsXlsx}
                className="px-4 py-2 rounded-full bg-[#D97757] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Excel (.XLSX)
              </button>
              <button
                type="button"
                onClick={downloadAsXeroCsv}
                className="px-4 py-2 rounded-full bg-[#F3EFE6] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Xero CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E6E1D6] rounded-2xl">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#F3EFE6]/70 text-[#6B6860] border-b border-[#E6E1D6]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payee</th>
                  <th className="py-2.5 px-3">Memo</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE4]">
                {parsedDoc.rows.map((r) => {
                  const signed = r.credit - r.debit;
                  return (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-medium text-[#141413]">
                        {r.date}
                      </td>
                      <td className="py-2.5 px-3 text-[#141413]">{r.payee}</td>
                      <td className="py-2.5 px-3 text-[#6B6860]">
                        {r.description}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          signed >= 0 ? "text-[#2D6A4F]" : "text-[#141413]"
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
  );
}
