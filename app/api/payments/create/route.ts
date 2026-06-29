import type { NextRequest } from "next/server";
import {
  PREMIUM_ORDER_NAME,
  PREMIUM_PAYMENT_AMOUNT,
  PREMIUM_PLAN,
} from "@/lib/payments/constants";
import { userMessages } from "@/lib/errors/userMessages";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSupabaseRouteClient,
  jsonWithAuthCookies,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function createOrderId() {
  const randomId = crypto.randomUUID().replaceAll("-", "").slice(0, 18);

  return `replace_${Date.now()}_${randomId}`;
}

export async function POST(request: NextRequest) {
  const routeClient = createSupabaseRouteClient(request);

  const {
    data: { user },
    error: userError,
  } = await routeClient.supabase.auth.getUser();

  if (userError || !user) {
    return jsonWithAuthCookies(
      routeClient,
      { message: "Premium 결제를 시작하려면 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  if (!clientKey) {
    return jsonWithAuthCookies(
      routeClient,
      { message: userMessages.paymentPrepareFailed },
      { status: 500 },
    );
  }

  try {
    const admin = getSupabaseAdminClient();
    const orderId = createOrderId();
    const origin = request.nextUrl.origin;

    const { error } = await admin.from("payments").insert({
      user_id: user.id,
      order_id: orderId,
      amount: PREMIUM_PAYMENT_AMOUNT,
      status: "pending",
      plan: PREMIUM_PLAN,
    });

    if (error) {
      console.error("Payment row creation failed:", error);

      return jsonWithAuthCookies(
        routeClient,
        { message: "결제 정보를 준비하지 못했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }

    return jsonWithAuthCookies(routeClient, {
      clientKey,
      customerKey: user.id,
      orderId,
      orderName: PREMIUM_ORDER_NAME,
      amount: PREMIUM_PAYMENT_AMOUNT,
      successUrl: `${origin}/payment/success`,
      failUrl: `${origin}/payment/fail`,
    });
  } catch (error) {
    console.error("Payment creation failed:", error);

    return jsonWithAuthCookies(
      routeClient,
      { message: userMessages.paymentPrepareFailed },
      { status: 500 },
    );
  }
}
