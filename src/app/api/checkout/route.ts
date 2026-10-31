import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    const plan = siteConfig.pricingPlans.find((p) => p.id === planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID." }, { status: 400 });
    }

    const creemKey = process.env.CREEM_API_KEY;
    const productId = process.env[plan.checkoutProductIdEnvKey];

    if (!creemKey || !productId) {
      return NextResponse.json({
        demoMode: true,
        message: `Checkout ready for "${plan.name}" (${plan.price} ${plan.period}). After personal approval on Creem.io or Polar.sh, add CREEM_API_KEY and ${plan.checkoutProductIdEnvKey} in .env.local to accept global USD payments.`,
      });
    }

    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "x-api-key": creemKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${siteConfig.siteUrl}/pricing?checkout=success&plan=${plan.id}`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Payment gateway unreachable." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ checkoutUrl: data.checkout_url });
  } catch (err) {
    console.error("/api/checkout error:", err);
    return NextResponse.json(
      { error: "Checkout initialization failed." },
      { status: 500 }
    );
  }
}
