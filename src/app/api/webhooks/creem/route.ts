import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * ============================================================================
 * Creem.io 自动化收款 Webhook 接收端点 (/api/webhooks/creem)
 * ============================================================================
 * 用途：
 * 当海外用户在 Creem.io 完成美元付款（$15 报税季包 / $19 月付 / $49 会计师版）时，
 * Creem 会向 `https://你的域名/api/webhooks/creem` 发送 POST 通知。
 * 本接口支持 HMAC-SHA256 签名校验（配置 CREEM_WEBHOOK_SECRET 后自动开启），
 * 并根据所购套餐映射对应的激活码与页数额度。
 */

const PLAN_PASSCODE_MAP: Record<
  string,
  { licenseKey: string; pages: number; planName: string }
> = {
  tax_season_pass: {
    licenseKey: "SF-TAX80-2026",
    pages: 80,
    planName: "Tax Season Pass (80 Pages)",
  },
  bookkeeper_monthly: {
    licenseKey: "SF-SMB250-2026",
    pages: 250,
    planName: "SMB Monthly (250 Pages/mo)",
  },
  cpa_firm_pro: {
    licenseKey: "SF-CPA1200-2026",
    pages: 1200,
    planName: "CPA Firm Pro (1,200 Pages/mo)",
  },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

    // Verify HMAC signature if CREEM_WEBHOOK_SECRET is configured
    if (webhookSecret) {
      const signature = req.headers.get("x-creem-signature") || "";
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expected) {
        return NextResponse.json(
          { error: "Invalid webhook signature." },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody || "{}");
    const eventType: string =
      payload.eventType || payload.event || "unknown_event";
    const productId: string =
      payload?.object?.product?.id || payload?.data?.product_id || "";

    // Match product ID back to configured env vars
    let matchedPlanKey = "tax_season_pass";
    if (
      productId &&
      productId === process.env.CREEM_PRODUCT_SMB_MONTHLY
    ) {
      matchedPlanKey = "bookkeeper_monthly";
    } else if (
      productId &&
      productId === process.env.CREEM_PRODUCT_CPA_PRO
    ) {
      matchedPlanKey = "cpa_firm_pro";
    }

    const provisioned = PLAN_PASSCODE_MAP[matchedPlanKey];

    return NextResponse.json({
      received: true,
      eventType,
      provisionedPlan: provisioned.planName,
      pagesGranted: provisioned.pages,
      activationCode: provisioned.licenseKey,
    });
  } catch (err) {
    console.error("/api/webhooks/creem error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 400 }
    );
  }
}
