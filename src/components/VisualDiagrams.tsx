import React from "react";

/**
 * ============================================================================
 * Claude 审美风格：暖色纸感矢量信息图组件 (VisualDiagrams.tsx)
 * ============================================================================
 * 用直观图形代替大段文字说明，访客扫一眼图片即懂全流程：
 * 1. HeroPipelineIllustration: 首屏三步视觉流转图 (PDF 账单 -> 自动平账 -> 导出软件图标)
 * 2. VisualFeatureCards: 三张纯图解式核心价值卡 (扫描提取 / 算术平账 / 原生导入)
 */

export function HeroPipelineIllustration() {
  return (
    <div className="w-full max-w-3xl mx-auto py-3">
      <svg
        viewBox="0 0 760 150"
        className="w-full h-auto"
        role="img"
        aria-label="PDF Statement to Reconciled QuickBooks, Xero, and Excel"
      >
        {/* Background Warm Pill */}
        <rect
          x="4"
          y="8"
          width="752"
          height="134"
          rx="28"
          fill="#F3EFE6"
          stroke="#E5DFD2"
          strokeWidth="1.5"
        />

        {/* STEP 1: Messy PDF Document Graphic */}
        <g transform="translate(36, 24)">
          <rect
            x="0"
            y="0"
            width="165"
            height="102"
            rx="16"
            fill="#FFFFFF"
            stroke="#DED8CA"
            strokeWidth="1.5"
          />
          {/* PDF Badge */}
          <rect x="16" y="14" width="44" height="20" rx="6" fill="#D97757" />
          <text
            x="38"
            y="28"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="700"
          >
            PDF
          </text>
          <text x="68" y="28" fill="#141413" fontSize="12" fontWeight="700">
            Bank Statement
          </text>
          {/* Simulated statement lines */}
          <rect x="16" y="46" width="85" height="6" rx="3" fill="#D8D2C5" />
          <rect x="112" y="46" width="36" height="6" rx="3" fill="#D97757" opacity="0.6" />
          <rect x="16" y="60" width="70" height="6" rx="3" fill="#D8D2C5" />
          <rect x="112" y="60" width="36" height="6" rx="3" fill="#2D6A4F" opacity="0.6" />
          <rect x="16" y="74" width="90" height="6" rx="3" fill="#D8D2C5" />
          <rect x="112" y="74" width="36" height="6" rx="3" fill="#D97757" opacity="0.6" />
        </g>

        {/* Connector Arrow 1 */}
        <g transform="translate(216, 65)">
          <line
            x1="0"
            y1="10"
            x2="52"
            y2="10"
            stroke="#C96442"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <polygon points="52,4 64,10 52,16" fill="#C96442" />
        </g>

        {/* STEP 2: Auto Math Verification Graphic */}
        <g transform="translate(294, 24)">
          <rect
            x="0"
            y="0"
            width="172"
            height="102"
            rx="16"
            fill="#FFFFFF"
            stroke="#2D6A4F"
            strokeWidth="2"
          />
          <circle cx="34" cy="34" r="14" fill="#EAF4EE" />
          <path
            d="M28 34 L32 38 L40 29"
            stroke="#2D6A4F"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <text x="56" y="32" fill="#141413" fontSize="12" fontWeight="700">
            Math Verified
          </text>
          <text x="56" y="46" fill="#2D6A4F" fontSize="11" fontWeight="700">
            $0.00 Diff
          </text>
          {/* Mini equation pill */}
          <rect x="16" y="62" width="140" height="26" rx="8" fill="#FAF8F5" stroke="#E5DFD2" />
          <text
            x="86"
            y="79"
            textAnchor="middle"
            fill="#4A4842"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="700"
          >
            In − Out = Closing ✓
          </text>
        </g>

        {/* Connector Arrow 2 */}
        <g transform="translate(480, 65)">
          <line
            x1="0"
            y1="10"
            x2="52"
            y2="10"
            stroke="#2D6A4F"
            strokeWidth="2.5"
          />
          <polygon points="52,4 64,10 52,16" fill="#2D6A4F" />
        </g>

        {/* STEP 3: Ready-to-Import File Badges */}
        <g transform="translate(558, 24)">
          <rect
            x="0"
            y="0"
            width="166"
            height="102"
            rx="16"
            fill="#FFFFFF"
            stroke="#DED8CA"
            strokeWidth="1.5"
          />
          {/* .QBO Pill */}
          <rect x="14" y="13" width="138" height="23" rx="7" fill="#141413" />
          <text
            x="83"
            y="28"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="700"
          >
            QuickBooks (.QBO)
          </text>
          {/* Xero CSV Pill */}
          <rect x="14" y="41" width="138" height="23" rx="7" fill="#F3EFE6" stroke="#D8D2C5" />
          <text
            x="83"
            y="56"
            textAnchor="middle"
            fill="#141413"
            fontSize="11"
            fontWeight="700"
          >
            Xero CSV (*Date)
          </text>
          {/* Excel Pill */}
          <rect x="14" y="69" width="138" height="23" rx="7" fill="#EAF4EE" />
          <text
            x="83"
            y="84"
            textAnchor="middle"
            fill="#2D6A4F"
            fontSize="11"
            fontWeight="700"
          >
            Verified Excel (.XLSX)
          </text>
        </g>
      </svg>
    </div>
  );
}

export function VisualComparisonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Digital & Scanned PDF Visual */}
      <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
        <svg viewBox="0 0 220 130" className="w-full h-32">
          <rect width="220" height="130" rx="16" fill="#FAF8F5" />
          {/* Tilted scanned page */}
          <g transform="translate(65, 16) rotate(-4)">
            <rect
              width="90"
              height="98"
              rx="8"
              fill="#FFFFFF"
              stroke="#D5CFC0"
              strokeWidth="1.5"
            />
            <rect x="12" y="14" width="40" height="6" rx="3" fill="#141413" />
            <rect x="12" y="30" width="66" height="5" rx="2.5" fill="#D8D2C5" />
            <rect x="12" y="42" width="66" height="5" rx="2.5" fill="#D8D2C5" />
            <rect x="12" y="54" width="66" height="5" rx="2.5" fill="#D8D2C5" />
            <rect x="12" y="66" width="48" height="5" rx="2.5" fill="#D8D2C5" />
          </g>
          {/* Glowing Terracotta Scan Beam */}
          <line
            x1="42"
            y1="66"
            x2="178"
            y2="66"
            stroke="#D97757"
            strokeWidth="3"
          />
          <rect
            x="42"
            y="66"
            width="136"
            height="22"
            fill="#D97757"
            opacity="0.12"
          />
        </svg>
        <div>
          <h3 className="font-editorial text-lg font-normal text-[#141413]">
            1. Digital or Scanned PDF
          </h3>
          <p className="text-xs text-[#6B6860] mt-1">
            Reads native text &amp; paper scans without manual templates.
          </p>
        </div>
      </div>

      {/* Card 2: Auto Balance Scale Visual */}
      <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
        <svg viewBox="0 0 220 130" className="w-full h-32">
          <rect width="220" height="130" rx="16" fill="#FAF8F5" />
          {/* Balance Comparison Bars */}
          <rect
            x="24"
            y="26"
            width="172"
            height="34"
            rx="10"
            fill="#FFFFFF"
            stroke="#E5DFD2"
          />
          <text x="36" y="47" fill="#6B6860" fontSize="11" fontWeight="600">
            PDF Closing
          </text>
          <text
            x="184"
            y="47"
            textAnchor="end"
            fill="#141413"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="700"
          >
            $18,412.35
          </text>

          <rect
            x="24"
            y="68"
            width="172"
            height="36"
            rx="10"
            fill="#EAF4EE"
            stroke="#2D6A4F"
            strokeWidth="1.5"
          />
          <text x="36" y="90" fill="#2D6A4F" fontSize="11" fontWeight="700">
            Math Check ✓
          </text>
          <text
            x="184"
            y="90"
            textAnchor="end"
            fill="#2D6A4F"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="700"
          >
            $18,412.35
          </text>
        </svg>
        <div>
          <h3 className="font-editorial text-lg font-normal text-[#141413]">
            2. Zero-Discrepancy Proof
          </h3>
          <p className="text-xs text-[#6B6860] mt-1">
            Flags any smudged digit or flipped sign automatically.
          </p>
        </div>
      </div>

      {/* Card 3: Direct Accounting Import Visual */}
      <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
        <svg viewBox="0 0 220 130" className="w-full h-32">
          <rect width="220" height="130" rx="16" fill="#FAF8F5" />
          {/* 3 Clean File Icons */}
          <g transform="translate(22, 28)">
            <rect width="52" height="72" rx="10" fill="#141413" />
            <text
              x="26"
              y="41"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="700"
            >
              .QBO
            </text>
          </g>
          <g transform="translate(84, 28)">
            <rect
              width="52"
              height="72"
              rx="10"
              fill="#FFFFFF"
              stroke="#141413"
              strokeWidth="1.5"
            />
            <text
              x="26"
              y="41"
              textAnchor="middle"
              fill="#141413"
              fontSize="12"
              fontWeight="700"
            >
              XERO
            </text>
          </g>
          <g transform="translate(146, 28)">
            <rect width="52" height="72" rx="10" fill="#D97757" />
            <text
              x="26"
              y="41"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="700"
            >
              .XLSX
            </text>
          </g>
        </svg>
        <div>
          <h3 className="font-editorial text-lg font-normal text-[#141413]">
            3. One-Click Ledger Import
          </h3>
          <p className="text-xs text-[#6B6860] mt-1">
            Ready for QuickBooks, Xero, or Excel with zero reformatting.
          </p>
        </div>
      </div>
    </div>
  );
}
