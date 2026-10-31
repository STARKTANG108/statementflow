"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Download,
  Plus,
  Trash2,
  ShieldCheck,
  Wand2,
  FileSpreadsheet,
} from "lucide-react";
import {
  StatementDocument,
  DateFormatPreference,
  ExportFormatType,
  DocumentKind,
} from "@/lib/types";
import {
  CLEAN_SAMPLE_STATEMENT,
  DISCREPANCY_SAMPLE_STATEMENT,
} from "@/lib/sampleData";
import { runReconciliationAudit } from "@/lib/reconcile";
import {
  generateQboFileContent,
  generateXeroCsvContent,
  generateQuickBooksCsvContent,
  generateVerifiedXlsxArrayBuffer,
} from "@/lib/exporters";
import { getRemainingFreePages, consumeFreePages } from "@/components/Navbar";

interface StatementWorkbenchProps {
  defaultExportFormat?: ExportFormatType;
  defaultDateFormat?: DateFormatPreference;
  defaultDocumentKind?: DocumentKind;
}

function triggerBrowserDownload(
  content: string | ArrayBuffer,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function StatementWorkbench({
  defaultExportFormat = "qbo",
  defaultDateFormat = "MM/DD/YYYY",
  defaultDocumentKind = "bank_statement",
}: StatementWorkbenchProps) {
  const [doc, setDoc] = useState<StatementDocument>(CLEAN_SAMPLE_STATEMENT);
  const [datePref, setDatePref] =
    useState<DateFormatPreference>(defaultDateFormat);
  const [redactAccount, setRedactAccount] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const audit = useMemo(() => runReconciliationAudit(doc), [doc]);

  const handlePdfUpload = async (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);
    setStatusBanner(null);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid .PDF bank statement or invoice.");
      return;
    }

    const freeLeft = getRemainingFreePages();
    if (freeLeft <= 0) {
      setErrorMsg(
        "You have used all 5 free trial pages. Unlock an 80-Page Tax Season Pass ($15) or SMB Monthly Plan ($19/mo) to continue."
      );
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentKind", defaultDocumentKind);

      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "PDF extraction failed.");
      }

      const extracted: StatementDocument = data.document;
      consumeFreePages(Math.min(extracted.pageCount || 1, freeLeft));
      setDoc(extracted);
      setStatusBanner(
        `Extracted ${extracted.rows.length} rows across ${extracted.pageCount} page(s) in ephemeral memory — source PDF immediately purged.`
      );
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to parse uploaded PDF."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const updateCell = (
    rowId: string,
    field: "date" | "description" | "debit" | "credit",
    value: string
  ) => {
    setDoc((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => {
        if (r.id !== rowId) return r;
        if (field === "debit" || field === "credit") {
          const num = Math.max(0, parseFloat(value) || 0);
          return { ...r, [field]: num };
        }
        return { ...r, [field]: value };
      }),
    }));
  };

  const flipRowPolarity = (rowId: string) => {
    setDoc((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === rowId
          ? {
              ...r,
              debit: r.credit,
              credit: r.debit,
            }
          : r
      ),
    }));
  };

  const deleteRow = (rowId: string) => {
    setDoc((prev) => ({
      ...prev,
      rows: prev.rows.filter((r) => r.id !== rowId),
    }));
  };

  const addBlankRow = () => {
    setDoc((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: `manual-${Date.now()}`,
          date: prev.periodEnd || "2026-10-31",
          payee: "NEW ENTRY",
          description: "MANUAL ADJUSTMENT ENTRY",
          debit: 0,
          credit: 0,
          reportedBalance: null,
        },
      ],
    }));
  };

  const baseFileName = doc.fileName.replace(/\.[^/.]+$/, "");

  const handleExport = (format: ExportFormatType) => {
    if (format === "qbo") {
      const qbo = generateQboFileContent(doc, redactAccount);
      triggerBrowserDownload(
        qbo,
        `${baseFileName}-quickbooks.qbo`,
        "application/vnd.intu.qbo"
      );
    } else if (format === "xero_csv") {
      const csv = generateXeroCsvContent(doc, datePref);
      triggerBrowserDownload(csv, `${baseFileName}-xero.csv`, "text/csv");
    } else if (format === "qbo_csv") {
      const csv = generateQuickBooksCsvContent(doc, datePref);
      triggerBrowserDownload(
        csv,
        `${baseFileName}-quickbooks-4col.csv`,
        "text/csv"
      );
    } else if (format === "xlsx") {
      const buf = generateVerifiedXlsxArrayBuffer(
        doc,
        audit,
        datePref,
        redactAccount
      );
      triggerBrowserDownload(
        buf,
        `${baseFileName}-reconciled.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
      {/* Top Upload & Interactive Demo Selector Bar */}
      <div className="p-5 sm:p-7 bg-slate-50 border-b border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handlePdfUpload(e.dataTransfer.files?.[0]);
          }}
          className="lg:col-span-7 border-2 border-dashed border-slate-300 hover:border-slate-900 bg-white rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => handlePdfUpload(e.target.files?.[0])}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">
              {isUploading
                ? "Extracting & Reconciling PDF in Memory..."
                : "Drop Bank Statement or Invoice PDF Here (or Click to Browse)"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Retention RAM Only
              </span>
              <span>•</span>
              <a
                href="/samples/sample-bank-statement.pdf"
                download
                onClick={(e) => e.stopPropagation()}
                className="underline hover:text-slate-900 font-medium"
              >
                Download Sample PDF to Test Upload
              </a>
            </p>
          </div>
        </div>

        {/* Instant Interactive Scenarios so CPAs See Reconciliation Engine Immediately */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Live Interactive Audit Sandbox:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setDoc(CLEAN_SAMPLE_STATEMENT);
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                doc.extractionMode === "sample_clean"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              ✅ Clean Statement ($0 Diff)
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setDoc(DISCREPANCY_SAMPLE_STATEMENT);
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                doc.extractionMode === "sample_discrepancy"
                  ? "border-rose-600 bg-rose-50 text-rose-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              ⚠️ Test OCR Sign Error (+Fix)
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-4">
          <span>{errorMsg}</span>
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg bg-rose-700 text-white font-semibold shrink-0"
          >
            Upgrade Quota →
          </Link>
        </div>
      )}

      {statusBanner && (
        <div className="mx-6 mt-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {statusBanner}
        </div>
      )}

      {/* Reconciliation Math Proof Strip */}
      <div className="p-5 sm:p-7 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              Active File: <strong className="text-slate-800">{doc.fileName}</strong> •{" "}
              {doc.institutionName}
            </span>
          </div>

          {/* Live Reconciliation Badge */}
          {audit.isReconciled ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>100% Math Reconciled ($0.00 Discrepancy)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span>
                Discrepancy Detected: {audit.discrepancy >= 0 ? "+" : ""}
                {audit.discrepancy.toFixed(2)} {doc.currency} (
                {audit.flaggedRowIds.length} Row Flagged)
              </span>
            </div>
          )}
        </div>

        {/* Smart Polarity Flip One-Click Fix Banner */}
        {audit.suggestedPolarityFlip && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-700" />
                Smart Reconciliation Diagnosis: Polarity Flip Detected on Row #
                {audit.suggestedPolarityFlip.rowIndex}
              </p>
              <p className="text-xs text-amber-900">
                &ldquo;{audit.suggestedPolarityFlip.description}&rdquo; ($
                {audit.suggestedPolarityFlip.amount.toFixed(2)}) appears to have
                its Debit/Credit sign inverted—causing an exact 2× ($
                {Math.abs(audit.discrepancy).toFixed(2)}) balance gap.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                flipRowPolarity(audit.suggestedPolarityFlip!.rowId)
              }
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold shrink-0 cursor-pointer transition"
            >
              Fix Row #{audit.suggestedPolarityFlip.rowIndex} Sign in 1 Click →
            </button>
          </div>
        )}

        {/* 5-Box Accounting Equation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 tabular-nums">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-500">
              Opening Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={doc.openingBalance}
              onChange={(e) =>
                setDoc((p) => ({
                  ...p,
                  openingBalance: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1 w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-900"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500">
              + Total Credits (In)
            </span>
            <p className="mt-2 text-sm font-bold text-emerald-700">
              +{audit.totalCredits.toFixed(2)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500">
              - Total Debits (Out)
            </span>
            <p className="mt-2 text-sm font-bold text-slate-900">
              -{audit.totalDebits.toFixed(2)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500">
              = Calculated Closing
            </span>
            <p className="mt-2 text-sm font-bold text-slate-900">
              {audit.calculatedClosingBalance.toFixed(2)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-500">
              PDF Closing Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={doc.closingBalance}
              onChange={(e) =>
                setDoc((p) => ({
                  ...p,
                  closingBalance: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1 w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Editable Ledger Verification Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3 w-10">#</th>
              <th className="py-3 px-3 w-32">Date (ISO)</th>
              <th className="py-3 px-3 min-w-[220px]">Description / Payee</th>
              <th className="py-3 px-3 w-28 text-right">Debit (-)</th>
              <th className="py-3 px-3 w-10 text-center">Flip</th>
              <th className="py-3 px-3 w-28 text-right">Credit (+)</th>
              <th className="py-3 px-3 w-32 text-right">Calc Balance</th>
              <th className="py-3 px-3 w-28 text-right">PDF Balance</th>
              <th className="py-3 px-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {doc.rows.map((row, idx) => {
              const rowAudit = audit.rowStatuses[row.id];
              const isFlagged = rowAudit?.hasRunningMismatch;
              return (
                <tr
                  key={row.id}
                  className={
                    isFlagged ? "bg-rose-50/90" : "hover:bg-slate-50/80"
                  }
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={row.date}
                      onChange={(e) =>
                        updateCell(row.id, "date", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-medium"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        updateCell(row.id, "description", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.01"
                      value={row.debit || ""}
                      placeholder="0.00"
                      onChange={(e) =>
                        updateCell(row.id, "debit", e.target.value)
                      }
                      className="w-full text-right bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-medium"
                    />
                  </td>
                  <td className="py-2.5 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => flipRowPolarity(row.id)}
                      title="Swap Debit <-> Credit sign"
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.01"
                      value={row.credit || ""}
                      placeholder="0.00"
                      onChange={(e) =>
                        updateCell(row.id, "credit", e.target.value)
                      }
                      className="w-full text-right bg-white border border-slate-200 rounded px-2 py-1 text-emerald-700 font-medium"
                    />
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold ${
                      isFlagged ? "text-rose-700" : "text-slate-800"
                    }`}
                  >
                    {rowAudit?.calculatedRunningBalance.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    {row.reportedBalance !== null
                      ? row.reportedBalance.toFixed(2)
                      : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(row.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Controls & Native Accounting Export Bar */}
      <div className="p-5 sm:p-7 bg-slate-50 border-t border-slate-200 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={addBlankRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Manual Row
          </button>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <label className="inline-flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={redactAccount}
                onChange={(e) => setRedactAccount(e.target.checked)}
                className="accent-slate-900 rounded"
              />
              <span>Redact Account # in Export</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">CSV Date:</span>
              {(
                ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as DateFormatPreference[]
              ).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDatePref(fmt)}
                  className={`px-2.5 py-1 rounded-md font-semibold border cursor-pointer ${
                    datePref === fmt
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-300"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Commercial Export Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleExport("qbo")}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              defaultExportFormat === "qbo"
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export QuickBooks (.QBO)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("xero_csv")}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              defaultExportFormat === "xero_csv"
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Xero CSV (*Date)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("xlsx")}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              defaultExportFormat === "xlsx"
                ? "bg-emerald-700 hover:bg-emerald-600 text-white shadow-md"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Verified .XLSX (2 Tabs)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("qbo_csv")}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              defaultExportFormat === "qbo_csv"
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>QuickBooks 4-Col CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
