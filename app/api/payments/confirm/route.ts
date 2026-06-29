import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import {
  PREMIUM_PAYMENT_AMOUNT,
  PREMIUM_PLAN,
} from "@/lib/payments/constants";
import { isHumanKoreanMessage, userMessages } from "@/lib/errors/userMessages";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSupabaseRouteClient,
  jsonWithAuthCookies,
} from "@/lib/supabase/server";
import type { Database, PaymentRow } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

type ConfirmPaymentBody = {
  paymentKey?: unknown;
  orderId?: unknown;
  amount?: unknown;
  paymentType?: unknown;
};

type TossPaymentResponse = {
  status?: string;
  approvedAt?: string;
  code?: string;
  message?: string;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getAmount(value: unknown) {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedAmount = Number(value);

    return Number.isInteger(parsedAmount) ? parsedAmount : null;
  }

  return null;
}

async function markPaymentFailed(
  admin: SupabaseClient<Database>,
  orderId: string,
  userId: string,
) {
  const { error } = await admin
    .from("payments")
    .update({ status: "failed" })
    .eq("order_id", orderId)
    .eq("user_id", userId)
    .neq("status", "paid");

  if (error) {
    console.error("Payment failed status update failed:", error);
  }
}

async function confirmTossPayment({
  paymentKey,
  orderId,
  amount,
}: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TOSS_SECRET_KEY is not configured.");
  }

  const authorization = Buffer.from(`${secretKey}:`).toString("base64");
  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `replace-confirm-${orderId}`,
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as TossPaymentResponse;

  return {
    data,
    ok: response.ok,
    status: response.status,
  };
}

function getInvalidRequest(message: string) {
  return {
    message,
    code: "INVALID_PAYMENT_CONFIRM_REQUEST",
  };
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
      { message: "결제 승인을 완료하려면 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let body: ConfirmPaymentBody;

  try {
    body = (await request.json()) as ConfirmPaymentBody;
  } catch {
    return jsonWithAuthCookies(
      routeClient,
      getInvalidRequest("결제 승인 요청 형식이 올바르지 않습니다."),
      { status: 400 },
    );
  }

  const paymentKey = getString(body.paymentKey);
  const orderId = getString(body.orderId);
  const requestedAmount = getAmount(body.amount);
  const paymentType = getString(body.paymentType);

  if (!paymentKey || paymentKey.length > 200) {
    return jsonWithAuthCookies(
      routeClient,
      getInvalidRequest("paymentKey가 올바르지 않습니다."),
      { status: 400 },
    );
  }

  if (!ORDER_ID_PATTERN.test(orderId)) {
    return jsonWithAuthCookies(
      routeClient,
      getInvalidRequest("orderId가 올바르지 않습니다."),
      { status: 400 },
    );
  }

  if (requestedAmount !== PREMIUM_PAYMENT_AMOUNT) {
    return jsonWithAuthCookies(
      routeClient,
      getInvalidRequest("결제 금액이 서버 기준 금액과 일치하지 않습니다."),
      { status: 400 },
    );
  }

  if (paymentType && paymentType !== "NORMAL") {
    return jsonWithAuthCookies(
      routeClient,
      getInvalidRequest("지원하지 않는 결제 유형입니다."),
      { status: 400 },
    );
  }

  try {
    const admin = getSupabaseAdminClient();
    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (paymentError || !payment) {
      console.error("Payment row lookup failed:", paymentError);

      return jsonWithAuthCookies(
        routeClient,
        { message: "결제를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.", code: "PAYMENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (payment.user_id !== user.id) {
      return jsonWithAuthCookies(
        routeClient,
        { message: "이 결제 주문을 승인할 권한이 없습니다.", code: "PAYMENT_FORBIDDEN" },
        { status: 403 },
      );
    }

    if (payment.plan !== PREMIUM_PLAN || payment.amount !== PREMIUM_PAYMENT_AMOUNT) {
      await markPaymentFailed(admin, orderId, user.id);

      return jsonWithAuthCookies(
        routeClient,
        {
          message: "결제 금액이 일치하지 않습니다. 잠시 후 다시 시도해주세요.",
          code: "PAYMENT_AMOUNT_MISMATCH",
        },
        { status: 400 },
      );
    }

    if (payment.status === "paid") {
      if (payment.payment_key && payment.payment_key !== paymentKey) {
        return jsonWithAuthCookies(
          routeClient,
          {
            message: "이미 처리된 결제입니다.",
            code: "PAYMENT_ALREADY_CONFIRMED_WITH_DIFFERENT_KEY",
          },
          { status: 409 },
        );
      }

      return jsonWithAuthCookies(routeClient, {
        message: "이미 승인된 결제입니다.",
        status: "paid",
        alreadyConfirmed: true,
        payment: {
          orderId: payment.order_id,
          amount: payment.amount,
          approvedAt: payment.approved_at,
        },
      });
    }

    const tossResult = await confirmTossPayment({
      paymentKey,
      orderId,
      amount: payment.amount,
    });

    if (!tossResult.ok) {
      await markPaymentFailed(admin, orderId, user.id);

      return jsonWithAuthCookies(
        routeClient,
        {
          message:
            (tossResult.data.message &&
            isHumanKoreanMessage(tossResult.data.message)
              ? tossResult.data.message
              : null) ?? userMessages.paymentConfirmFailed,
          code: tossResult.data.code ?? "TOSS_CONFIRM_FAILED",
        },
        { status: tossResult.status >= 500 ? 502 : 400 },
      );
    }

    if (tossResult.data.status && tossResult.data.status !== "DONE") {
      await admin
        .from("payments")
        .update({
          payment_key: paymentKey,
          status: tossResult.data.status.toLowerCase(),
        })
        .eq("order_id", orderId)
        .eq("user_id", user.id);

      return jsonWithAuthCookies(
        routeClient,
        {
          message: "결제가 아직 완료 상태가 아닙니다.",
          code: "PAYMENT_NOT_DONE",
          tossStatus: tossResult.data.status,
        },
        { status: 409 },
      );
    }

    const approvedAt = tossResult.data.approvedAt ?? new Date().toISOString();
    const { data: updatedPayment, error: updateError } = await admin
      .from("payments")
      .update({
        payment_key: paymentKey,
        status: "paid",
        approved_at: approvedAt,
      })
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .select("*")
      .single<PaymentRow>();

    if (updateError || !updatedPayment) {
      console.error("Payment approved but DB update failed:", updateError);

      return jsonWithAuthCookies(
        routeClient,
        {
          message: "결제 승인은 완료됐지만 기록을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
          code: "PAYMENT_APPROVED_DB_UPDATE_FAILED",
          requiresSupport: true,
        },
        { status: 500 },
      );
    }

    return jsonWithAuthCookies(routeClient, {
      message: "Premium이 활성화되었습니다.",
      status: "paid",
      payment: {
        orderId: updatedPayment.order_id,
        amount: updatedPayment.amount,
        approvedAt: updatedPayment.approved_at,
      },
    });
  } catch (error) {
    console.error("Payment confirmation failed:", error);

    return jsonWithAuthCookies(
      routeClient,
      { message: userMessages.paymentConfirmFailed, code: "PAYMENT_CONFIRM_ERROR" },
      { status: 500 },
    );
  }
}
