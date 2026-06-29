"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  mapPaymentError,
  userMessages,
} from "@/lib/errors/userMessages";

type PaymentSuccessResultProps = {
  paymentKey: string;
  orderId: string;
  amount: string;
  paymentType: string;
};

type ConfirmStatus = "checking" | "paid" | "error";

type ConfirmResponse = {
  message?: string;
  status?: string;
  code?: string;
  requiresSupport?: boolean;
  payment?: {
    orderId?: string;
    amount?: number;
    approvedAt?: string | null;
  };
};

function formatAmount(amount: number | undefined) {
  return typeof amount === "number" ? `${amount.toLocaleString("ko-KR")}원` : "";
}

export default function PaymentSuccessResult({
  paymentKey,
  orderId,
  amount,
  paymentType,
}: PaymentSuccessResultProps) {
  const [status, setStatus] = useState<ConfirmStatus>("checking");
  const [result, setResult] = useState<ConfirmResponse | null>(null);
  const hasConfirmedRef = useRef(false);

  const confirmPayment = useCallback(async () => {
    if (hasConfirmedRef.current) {
      return;
    }

    hasConfirmedRef.current = true;
    setStatus("checking");
    setResult(null);

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setResult({
        message: userMessages.paymentMissingInfo,
        code: "MISSING_PAYMENT_QUERY",
      });
      return;
    }

    try {
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
          paymentType,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as ConfirmResponse;

      setResult(data);

      if (!response.ok || data.status !== "paid") {
        setStatus("error");
        return;
      }

      setStatus("paid");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setResult({
        message: userMessages.paymentConfirmFailed,
        code: "CONFIRM_REQUEST_FAILED",
      });
    }
  }, [amount, orderId, paymentKey, paymentType]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      confirmPayment();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [confirmPayment]);

  function handleRetry() {
    hasConfirmedRef.current = false;
    confirmPayment();
  }

  const errorMessage = mapPaymentError(result?.message, result?.code);

  if (status === "checking") {
    return (
      <section className="mx-auto max-w-2xl rounded-[28px] border border-[#E5E0D8] bg-[#FCFBF8] p-7 text-center shadow-[0_18px_44px_rgba(77,87,72,0.08)] sm:p-9">
        <p className="text-lg font-semibold text-[#4D5748]">결제 승인 확인 중</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          Premium을 활성화하고 있어요
        </h1>
        <p className="mt-4 text-lg leading-8 text-[#6B6B68]">
          잠시만 기다려주세요.
        </p>
      </section>
    );
  }

  if (status === "paid") {
    return (
      <section className="mx-auto max-w-2xl rounded-[28px] border border-[#A8B2A1]/70 bg-[#FCFBF8] p-7 text-center shadow-[0_18px_44px_rgba(77,87,72,0.1)] sm:p-9">
        <p className="text-lg font-semibold text-[#4D5748]">결제 완료</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          Premium이 활성화되었어요
        </h1>
        <div className="mt-6 rounded-2xl bg-[#F7F5EF] px-5 py-4 text-base leading-7 text-[#5F625A]">
          <p>주문번호 {result?.payment?.orderId ?? orderId}</p>
          <p>{formatAmount(result?.payment?.amount)}</p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/my-places"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#87977F] px-7 py-3 text-base font-semibold text-[#FCFBF8] transition hover:bg-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            내 장소로 이동
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D8D1C6] bg-[#FCFBF8] px-7 py-3 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F3EFE8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            요금제 보기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl rounded-[28px] border border-[#E5C8BA] bg-[#FCFBF8] p-7 text-center shadow-[0_18px_44px_rgba(77,87,72,0.08)] sm:p-9">
      <p className="text-lg font-semibold text-[#7A4B3A]">승인 확인 실패</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#3F3F3B]">
        Premium 활성화를 완료하지 못했어요
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#6B6B68]">
        {errorMessage}
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#87977F] px-7 py-3 text-base font-semibold text-[#FCFBF8] transition hover:bg-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          다시 확인하기
        </button>
        <Link
          href="/pricing"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D8D1C6] bg-[#FCFBF8] px-7 py-3 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F3EFE8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          다시 시도하기
        </Link>
      </div>
    </section>
  );
}
