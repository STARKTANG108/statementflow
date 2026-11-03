import { ImageResponse } from "next/og";

export const alt =
  "StatementFlow - Convert PDF Bank Statements to Math-Verified QuickBooks (.QBO), Xero CSV & Excel";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF8F5",
          padding: "64px 72px",
          color: "#141413",
        }}
      >
        {/* Top Brand Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#D97757",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FAF8F5",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              SF
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              StatementFlow
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "#EAF4EE",
              border: "2px solid #B7DFC5",
              color: "#2D6A4F",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Math Verified - $0.00 Discrepancy
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "66px",
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              maxWidth: "980px",
            }}
          >
            PDF Bank Statements to QuickBooks, Xero & Excel.
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#57544E",
              maxWidth: "880px",
            }}
          >
            Every row checked against Opening & Closing balances before export.
            Zero server retention.
          </div>
        </div>

        {/* Bottom Visual Pipeline Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              padding: "14px 28px",
              borderRadius: "18px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #E6E1D6",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            1. Drop PDF Statement
          </div>
          <div style={{ fontSize: "24px", color: "#D97757", fontWeight: 700 }}>
            -&gt;
          </div>
          <div
            style={{
              padding: "14px 28px",
              borderRadius: "18px",
              backgroundColor: "#FFF6F2",
              border: "2px solid #D97757",
              color: "#D97757",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            2. Auto-Audit Math ($0.00 Diff)
          </div>
          <div style={{ fontSize: "24px", color: "#2D6A4F", fontWeight: 700 }}>
            -&gt;
          </div>
          <div
            style={{
              padding: "14px 28px",
              borderRadius: "18px",
              backgroundColor: "#141413",
              color: "#FAF8F5",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            3. Export .QBO / Xero CSV / .XLSX
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
