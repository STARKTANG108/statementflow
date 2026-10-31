"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { StatementDocument, TransactionRow } from "@/lib/types";
import { generateQboFileContent } from "@/lib/exporters";

const SAMPLE_CSV = `Date,Description,Amount
2026-10-02,STRIPE PAYOUT #9912,2450.00
2026-10-06,GOOGLE WORKSPACE SUBSCRIPTION,-28.80
2026-10-12,CLIENT INVOICE #108 WIRE,1800.00
2026-10-18,FEDEX SHIPPING CHARGE,-64.15`;

export default function CsvToQboClient() {
  const [csvText, setCsvText] = useState<string>(SAMPLE_CSV);
  const [acctType, setAcctType] = useState<"bank_statement" | "credit_card">(
    "bank_statement"
  );
  const [currency, setCurrency] = useState<string>("USD");

  const handleDownloadQbo = () => {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return;

    const rows: TransactionRow[] = lines.slice(1).map((line, i) => {
      const parts = line.split(",");
      const rawDate = (parts[0] || "2026-10-01").trim();
      const desc = (parts[1] || "CSV Transaction").trim();
      const amt = parseFloat((parts[2] || "0").replace(/[^0-9.\-]/g, "")) || 0;
      return {
        id: `csv-${i + 1}`,
        date: rawDate,
        payee: desc.slice(0, 30),
        description: desc,
        debit: amt < 0 ? Math.abs(amt) : 0,
        credit: amt >= 0 ? amt : 0,
        reportedBalance: null,
      };
    });

    const net = rows.reduce((a, r) => a + r.credit - r.debit, 0);
    const doc: StatementDocument = {
      documentType: acctType,
      fileName: "csv-converted.qbo",
      institutionName: "CSV Web Connect Export",
      accountLast4: "0001",
      currency,
      periodStart: rows[0]?.date || "2026-10-01",
      periodEnd: rows[rows.length - 1]?.date || "2026-10-31",
      openingBalance: 0,
      closingBalance: Number(net.toFixed(2)),
      pageCount: 1,
      extractionMode: "local_pdf_parser",
      rows,
    };

    const qbo = generateQboFileContent(doc, false);
    const blob = new Blob([qbo], { type: "application/vnd.intu.qbo" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-quickbooks.qbo";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            QuickBooks Target Account Type
          </label>
          <select
            value={acctType}
            onChange={(e) =>
              setAcctType(e.target.value as "bank_statement" | "credit_card")
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
          >
            <option value="bank_statement">Bank Checking / Savings (CHECKING)</option>
            <option value="credit_card">Credit Card Liability (CREDITLINE)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Statement Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
          >
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Paste 3-Column CSV Data (Date, Description, Signed Amount)
        </label>
        <textarea
          rows={7}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full font-mono text-xs rounded-2xl border border-slate-300 p-4 text-slate-900 bg-slate-50"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleDownloadQbo}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition"
        >
          <Download className="w-4 h-4" />
          Download Compliant .QBO File (100% Free)
        </button>

        <Link
          href="/convert/pdf-to-qbo"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
        >
          Starting from a PDF Bank Statement instead? Use PDF-to-QBO OCR{" "}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
