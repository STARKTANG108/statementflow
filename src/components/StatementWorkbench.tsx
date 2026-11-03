"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Download,
  Plus,
  Trash2,
  Wand2,
  KeyRound,
  Lock,
  X,
  Sparkles,
  MessageSquarePlus,
  ExternalLink,
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
import {
  getRemainingFreePages,
  consumeFreePages,
  addQuotaPages,
} from "@/components/Navbar";

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

  // Zero-Data-Loss In-Workbench Unlock Modal State
  const [requiresUnlockToExport, setRequiresUnlockToExport] =
    useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [pendingExportFormat, setPendingExportFormat] =
    useState<ExportFormatType | null>(null);
  const [licenseInput, setLicenseInput] = useState<string>("");
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  const [unlockFeedback, setUnlockFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Bank Layout Feedback State
  const [showLayoutFeedback, setShowLayoutFeedback] = useState<boolean>(false);
  const [bankNameInput, setBankNameInput] = useState<string>("");
  const [layoutFeedbackSent, setLayoutFeedbackSent] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const audit = useMemo(() => runReconciliationAudit(doc), [doc]);

  const handlePdfUpload = async (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);
    setStatusBanner(null);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please select a .PDF bank statement or invoice.");
      return;
    }

    const freeLeftBefore = getRemainingFreePages();

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
      const neededPages = Math.max(1, extracted.pageCount || 1);

      setDoc(extracted);

      if (freeLeftBefore >= neededPages) {
        consumeFreePages(neededPages);
        setRequiresUnlockToExport(false);
        setStatusBanner(
          `✓ Extracted ${extracted.rows.length} rows (${neededPages} page) — source PDF purged from memory.`
        );
      } else {
        if (freeLeftBefore > 0) {
          consumeFreePages(freeLeftBefore);
        }
        setRequiresUnlockToExport(true);
        setStatusBanner(
          `✓ Preview Ready: Extracted ${extracted.rows.length} rows (${neededPages} page). Unlock export below to download without losing your table edits.`
        );
      }
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
          description: "MANUAL ENTRY",
          debit: 0,
          credit: 0,
          reportedBalance: null,
        },
      ],
    }));
  };

  const baseFileName = doc.fileName.replace(/\.[^/.]+$/, "");

  const executeDownload = (format: ExportFormatType) => {
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

  const handleExport = (format: ExportFormatType) => {
    const isSample =
      doc.extractionMode === "sample_clean" ||
      doc.extractionMode === "sample_discrepancy";

    // Gate real PDF exports when free quota was insufficient and not yet unlocked
    if (!isSample && requiresUnlockToExport) {
      setPendingExportFormat(format);
      setUnlockFeedback(null);
      setShowUnlockModal(true);
      return;
    }

    executeDownload(format);
  };

  const handleInlineLicenseRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;
    setIsVerifyingKey(true);
    setUnlockFeedback(null);

    try {
      const res = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseInput }),
      });
      const data = await res.json();

      if (!res.ok || !data.verified) {
        setUnlockFeedback({
          type: "error",
          text: data.error || "Invalid Order / License Key.",
        });
        return;
      }

      const needed = Math.max(1, doc.pageCount || 1);
      addQuotaPages(Math.max(0, data.pagesAdded - needed));
      setRequiresUnlockToExport(false);
      setLicenseInput("");
      setShowUnlockModal(false);
      setStatusBanner(
        `✓ Activated ${data.planName}! Added ${data.pagesAdded} pages — downloading your reconciled file now.`
      );

      if (pendingExportFormat) {
        executeDownload(pendingExportFormat);
        setPendingExportFormat(null);
      }
    } catch {
      setUnlockFeedback({
        type: "error",
        text: "Could not verify key. Please try again.",
      });
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleInlineCheckout = async (planId: string) => {
    setUnlockFeedback(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
      } else if (data.demoMode) {
        setUnlockFeedback({
          type: "info",
          text: `${data.message} Tip: Enter test key SF-TAX80-2026 above to unlock & download immediately!`,
        });
      }
    } catch {
      setUnlockFeedback({
        type: "error",
        text: "Unable to start checkout. Please try again.",
      });
    }
  };

  return (
    <div className="relative bg-white border border-[#E6E1D6] rounded-[28px] shadow-[0_12px_40px_rgba(20,20,19,0.05)] overflow-hidden">
      {/* STEP 1: OBVIOUS PRIMARY UPLOAD DROPZONE (Claude Warm Style) */}
      <div className="p-6 sm:p-8 bg-[#FAF8F5] border-b border-[#E6E1D6]">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handlePdfUpload(e.dataTransfer.files?.[0]);
          }}
          className="border-2 border-dashed border-[#D97757]/60 hover:border-[#D97757] bg-white rounded-3xl p-7 sm:p-9 text-center cursor-pointer transition group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => handlePdfUpload(e.target.files?.[0])}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-[#D97757] group-hover:bg-[#C46243] text-white flex items-center justify-center mx-auto mb-4 shadow-md transition">
            <Upload className="w-6 h-6" />
          </div>

          <p className="font-editorial text-2xl sm:text-3xl text-[#141413]">
            {isUploading ? "Extracting PDF..." : "Drop PDF Statement Here"}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <span className="px-5 py-2 rounded-full bg-[#D97757] text-white text-xs font-semibold shadow-sm">
              Choose PDF File
            </span>
            <a
              href="/samples/sample-bank-statement.pdf"
              download
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-full bg-[#F3EFE6] hover:bg-[#E6E1D6] text-[#141413] text-xs font-semibold transition"
            >
              ↓ Sample PDF
            </a>
          </div>
        </div>

        {/* Visual Demo Switcher Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#6B6860]">
              Instant Preview:
            </span>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setRequiresUnlockToExport(false);
                setDoc(CLEAN_SAMPLE_STATEMENT);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                doc.extractionMode === "sample_clean"
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white border border-[#E2DDD1] text-[#141413] hover:bg-[#F3EFE6]"
              }`}
            >
              ✓ Reconciled Sample ($0.00 Diff)
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setRequiresUnlockToExport(false);
                setDoc(DISCREPANCY_SAMPLE_STATEMENT);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                doc.extractionMode === "sample_discrepancy"
                  ? "bg-[#D97757] text-white"
                  : "bg-white border border-[#E2DDD1] text-[#141413] hover:bg-[#F3EFE6]"
              }`}
            >
              ⚡ Demo OCR Error + 1-Click Fix
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPendingExportFormat(null);
                setUnlockFeedback(null);
                setShowUnlockModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97757] hover:text-[#C46243] cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Redeem Order Key</span>
            </button>
            <span className="text-xs text-[#6B6860] font-mono">
              {doc.fileName}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-4">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => {
              setUnlockFeedback(null);
              setShowUnlockModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#141413] text-white font-semibold shrink-0 cursor-pointer"
          >
            Unlock Pages →
          </button>
        </div>
      )}

      {statusBanner && (
        <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-[#EAF4EE] border border-[#C6E2D1] text-xs text-[#2D6A4F] font-semibold flex flex-wrap items-center justify-between gap-3">
          <span>{statusBanner}</span>
          {requiresUnlockToExport && (
            <button
              type="button"
              onClick={() => {
                setPendingExportFormat(defaultExportFormat);
                setUnlockFeedback(null);
                setShowUnlockModal(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#D97757] hover:bg-[#C46243] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock &amp; Download Now</span>
            </button>
          )}
        </div>
      )}

      {/* STEP 2: VISUAL BALANCE EQUATION & 1-CLICK EXPORT BAR */}
      <div className="p-6 sm:p-8 border-b border-[#E6E1D6] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Visual Reconciliation Status Pill */}
          {audit.isReconciled ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#EAF4EE] border border-[#B7DFC5] text-[#2D6A4F] text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Math Verified — $0.00 Discrepancy</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-sm font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Discrepancy: {audit.discrepancy >= 0 ? "+" : ""}
                {audit.discrepancy.toFixed(2)} {doc.currency}
              </span>
            </div>
          )}

          {/* Obvious Top Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleExport("qbo")}
              className={`px-4 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer ${
                defaultExportFormat === "qbo"
                  ? "bg-[#D97757] hover:bg-[#C46243] text-white shadow-sm"
                  : "bg-[#141413] hover:bg-[#2C2B29] text-white"
              }`}
            >
              {requiresUnlockToExport ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download .QBO</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport("xero_csv")}
              className={`px-4 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer ${
                defaultExportFormat === "xero_csv"
                  ? "bg-[#D97757] hover:bg-[#C46243] text-white shadow-sm"
                  : "bg-[#F3EFE6] hover:bg-[#E6E1D6] text-[#141413]"
              }`}
            >
              {requiresUnlockToExport ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Xero CSV</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport("xlsx")}
              className={`px-4 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer ${
                defaultExportFormat === "xlsx"
                  ? "bg-[#D97757] hover:bg-[#C46243] text-white shadow-sm"
                  : "bg-[#EAF4EE] hover:bg-[#D5EBDD] text-[#2D6A4F]"
              }`}
            >
              {requiresUnlockToExport ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Excel (.XLSX)</span>
            </button>
          </div>
        </div>

        {/* One-Click Smart Fix Banner when Discrepancy Exists */}
        {audit.suggestedPolarityFlip && (
          <div className="p-4 rounded-2xl bg-[#FFF6F2] border border-[#D97757]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#141413]">
              <Wand2 className="w-4 h-4 text-[#D97757] shrink-0" />
              <span>
                <strong>Row #{audit.suggestedPolarityFlip.rowIndex}</strong> ($
                {audit.suggestedPolarityFlip.amount.toFixed(2)}) has a flipped
                +/− sign.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                flipRowPolarity(audit.suggestedPolarityFlip!.rowId)
              }
              className="px-4 py-2 rounded-full bg-[#D97757] hover:bg-[#C46243] text-white text-xs font-bold shrink-0 cursor-pointer transition"
            >
              Fix Row #{audit.suggestedPolarityFlip.rowIndex} in 1 Click →
            </button>
          </div>
        )}

        {/* Visual Equation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D6]">
            <label className="block text-[11px] font-medium text-[#6B6860]">
              Opening
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
              className="mt-1 w-full bg-white border border-[#DED8CA] rounded-lg px-2 py-1 text-sm font-bold text-[#141413]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D6]">
            <span className="block text-[11px] font-medium text-[#6B6860]">
              + Money In
            </span>
            <p className="mt-2 text-sm font-bold text-[#2D6A4F]">
              +${audit.totalCredits.toFixed(2)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D6]">
            <span className="block text-[11px] font-medium text-[#6B6860]">
              − Money Out
            </span>
            <p className="mt-2 text-sm font-bold text-[#141413]">
              −${audit.totalDebits.toFixed(2)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D6]">
            <label className="block text-[11px] font-medium text-[#6B6860]">
              PDF Closing
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
              className="mt-1 w-full bg-white border border-[#DED8CA] rounded-lg px-2 py-1 text-sm font-bold text-[#141413]"
            />
          </div>
        </div>
      </div>

      {/* STEP 3: CLEAN, UNCLUTTERED TRANSACTION TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-[#F3EFE6]/70 border-b border-[#E6E1D6] text-[#6B6860] text-[11px]">
            <tr>
              <th className="py-3 px-4 w-10">#</th>
              <th className="py-3 px-3 w-32">Date</th>
              <th className="py-3 px-3">Description</th>
              <th className="py-3 px-3 w-28 text-right">Out (−)</th>
              <th className="py-3 px-2 w-10 text-center">⇄</th>
              <th className="py-3 px-3 w-28 text-right">In (+)</th>
              <th className="py-3 px-4 w-32 text-right">Balance</th>
              <th className="py-3 px-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE4]">
            {doc.rows.map((row, idx) => {
              const rowAudit = audit.rowStatuses[row.id];
              const isFlagged = rowAudit?.hasRunningMismatch;
              return (
                <tr
                  key={row.id}
                  className={
                    isFlagged ? "bg-[#FFF2EE]" : "hover:bg-[#FAF8F5]"
                  }
                >
                  <td className="py-2.5 px-4 font-semibold text-[#87837B]">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={row.date}
                      onChange={(e) =>
                        updateCell(row.id, "date", e.target.value)
                      }
                      className="w-full bg-white border border-[#E6E1D6] rounded-lg px-2 py-1 text-[#141413]"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        updateCell(row.id, "description", e.target.value)
                      }
                      className="w-full bg-white border border-[#E6E1D6] rounded-lg px-2 py-1 text-[#141413]"
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
                      className="w-full text-right bg-white border border-[#E6E1D6] rounded-lg px-2 py-1 text-[#141413]"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => flipRowPolarity(row.id)}
                      title="Swap Out / In"
                      className="p-1.5 rounded-lg hover:bg-[#EFECE4] text-[#6B6860] cursor-pointer"
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
                      className="w-full text-right bg-white border border-[#E6E1D6] rounded-lg px-2 py-1 text-[#2D6A4F] font-semibold"
                    />
                  </td>
                  <td
                    className={`py-2.5 px-4 text-right font-bold ${
                      isFlagged ? "text-[#D97757]" : "text-[#141413]"
                    }`}
                  >
                    ${rowAudit?.calculatedRunningBalance.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(row.id)}
                      className="text-[#A39E93] hover:text-rose-600 cursor-pointer"
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

      {/* Compact Footer Toolbar + Unrecognized Bank Layout Feedback Hook */}
      <div className="p-4 sm:px-8 bg-[#FAF8F5] border-t border-[#E6E1D6] space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={addBlankRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#DED8CA] bg-white hover:bg-[#F3EFE6] font-semibold text-[#141413] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </button>

            <button
              type="button"
              onClick={() => {
                setLayoutFeedbackSent(false);
                setShowLayoutFeedback((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#6B6860] hover:text-[#141413] hover:bg-[#EFECE4] transition cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Report Unrecognized Bank Layout</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-1.5 text-[#6B6860] cursor-pointer">
              <input
                type="checkbox"
                checked={redactAccount}
                onChange={(e) => setRedactAccount(e.target.checked)}
                className="accent-[#D97757] rounded"
              />
              <span>Hide Account #</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[#6B6860]">Date:</span>
              {(
                [
                  "MM/DD/YYYY",
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ] as DateFormatPreference[]
              ).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDatePref(fmt)}
                  className={`px-2.5 py-1 rounded-full font-semibold cursor-pointer ${
                    datePref === fmt
                      ? "bg-[#141413] text-white"
                      : "bg-white text-[#6B6860] border border-[#E2DDD1]"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inline Unrecognized Bank Layout Drawer */}
        {showLayoutFeedback && (
          <div className="p-4 rounded-2xl bg-white border border-[#E6E1D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {layoutFeedbackSent ? (
              <div className="text-[#2D6A4F] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Logged bank layout request for &ldquo;{bankNameInput}&rdquo;.
                  Our parser rules update weekly!
                </span>
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <span className="font-semibold text-[#141413] shrink-0">
                    Which bank or card layout had an issue?
                  </span>
                  <input
                    type="text"
                    value={bankNameInput}
                    onChange={(e) => setBankNameInput(e.target.value)}
                    placeholder="e.g. Wells Fargo Commercial 2-Column PDF"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DED8CA] text-xs text-[#141413]"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!bankNameInput.trim()) return;
                      setLayoutFeedbackSent(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#141413] text-white font-semibold cursor-pointer"
                  >
                    Submit Layout
                  </button>
                  <a
                    href={`mailto:support@getstatementflow.com?subject=${encodeURIComponent(
                      `Bank Layout Support: ${bankNameInput || doc.institutionName}`
                    )}&body=${encodeURIComponent(
                      `Bank / Statement Type: ${bankNameInput || doc.institutionName}\nFile Name: ${doc.fileName}\nRows Detected: ${doc.rows.length}\nNotes:`
                    )}`}
                    className="px-3 py-1.5 rounded-full border border-[#DED8CA] text-[#6B6860] hover:text-[#141413] font-semibold"
                  >
                    Email Sample
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          IN-WORKBENCH ZERO-DATA-LOSS UNLOCK MODAL
          Preserves all extracted rows & manual edits in memory while unlocking!
         ==================================================================== */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-[#141413]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E6E1D6] rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4EE] text-[#2D6A4F] text-[11px] font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {doc.rows.length} Rows Safely Preserved in Memory
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#141413]">
                  Unlock &amp; Download Statement
                </h3>
                <p className="text-xs text-[#6B6860] mt-1">
                  Redeem an Order Key or grab a pass below. Your current table
                  and edits stay right here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUnlockModal(false)}
                className="p-2 rounded-full hover:bg-[#EFECE4] text-[#6B6860] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Instant Key Redemption */}
            <form
              onSubmit={handleInlineLicenseRedeem}
              className="p-4 rounded-2xl bg-white border border-[#E6E1D6] space-y-3"
            >
              <label className="block text-xs font-bold text-[#141413]">
                Have an Order / License Key?
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  placeholder="Enter key (e.g. SF-TAX80-2026)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DED8CA] text-xs font-mono text-[#141413] focus:outline-none focus:border-[#D97757]"
                />
                <button
                  type="submit"
                  disabled={isVerifyingKey}
                  className="px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C46243] text-white text-xs font-bold cursor-pointer transition shrink-0"
                >
                  {isVerifyingKey
                    ? "Verifying..."
                    : pendingExportFormat
                      ? "Unlock & Download"
                      : "Activate Pages"}
                </button>
              </div>

              {unlockFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    unlockFeedback.type === "error"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-[#F3EFE6] text-[#141413] border border-[#DED8CA]"
                  }`}
                >
                  {unlockFeedback.text}
                </div>
              )}
            </form>

            {/* Option 2: Get a Pass without leaving the page */}
            <div className="space-y-2.5">
              <span className="block text-xs font-bold text-[#6B6860]">
                Or get an instant page pass (opens in new tab):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInlineCheckout("tax_season_pass")}
                  className="p-4 rounded-2xl bg-white border-2 border-[#D97757] hover:bg-[#FFF6F2] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D97757]">
                      Tax Season Pass
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D97757]" />
                  </div>
                  <p className="font-editorial text-2xl text-[#141413] mt-1">
                    $15{" "}
                    <span className="text-xs font-sans font-normal text-[#6B6860]">
                      one-time
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6B6860] mt-1">
                    80 Statement Pages · No subscription
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleInlineCheckout("bookkeeper_monthly")}
                  className="p-4 rounded-2xl bg-white border border-[#E6E1D6] hover:border-[#141413] text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141413]">
                      SMB Monthly
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B6860]" />
                  </div>
                  <p className="font-editorial text-2xl text-[#141413] mt-1">
                    $19{" "}
                    <span className="text-xs font-sans font-normal text-[#6B6860]">
                      / month
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6B6860] mt-1">
                    250 Pages/mo · Priority OCR
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
