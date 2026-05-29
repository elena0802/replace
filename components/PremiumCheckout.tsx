"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PREMIUM_PRICE_LABEL } from "@/lib/payments/constants";

type CheckoutSession = {
  clientKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  successUrl: string;
  failUrl: string;
};

type WidgetController = {
  destroy: () => Promise<void> | void;
};

type TossPaymentWidgets = {
  setAmount: (amount: { value: number; currency: "KRW" }) => Promise<void>;
  renderPaymentMethods: (params: {
    selector: string;
    variantKey?: string;
  }) => Promise<WidgetController>;
  renderAgreement: (params: {
    selector: string;
    variantKey?: string;
  }) => Promise<WidgetController>;
  requestPayment: (params: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
};

type TossPaymentsSdk = {
  widgets: (params: { customerKey: string }) => TossPaymentWidgets;
};

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsSdk;
  }
}

type CheckoutStatus =
  | "idle"
  | "creating"
  | "rendering"
  | "ready"
  | "requesting"
  | "error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "결제를 준비하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

export default function PremiumCheckout() {
  const router = useRouter();
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [message, setMessage] = useState("");
  const widgetsRef = useRef<TossPaymentWidgets | null>(null);
  const paymentMethodWidgetRef = useRef<WidgetController | null>(null);
  const agreementWidgetRef = useRef<WidgetController | null>(null);

  useEffect(() => {
    const currentCheckout = checkout;
    const tossPaymentsFactory = window.TossPayments;

    if (!currentCheckout || !isSdkReady || typeof tossPaymentsFactory !== "function") {
      return;
    }

    let isMounted = true;
    const activeCheckout: CheckoutSession = currentCheckout;
    const createTossPayments: (clientKey: string) => TossPaymentsSdk =
      tossPaymentsFactory;

    async function renderWidgets() {
      setStatus("rendering");
      setMessage("");

      try {
        await paymentMethodWidgetRef.current?.destroy();
        await agreementWidgetRef.current?.destroy();

        const tossPayments = createTossPayments(activeCheckout.clientKey);
        const widgets = tossPayments.widgets({
          customerKey: activeCheckout.customerKey,
        });

        await widgets.setAmount({
          value: activeCheckout.amount,
          currency: "KRW",
        });

        const [paymentMethodWidget, agreementWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#replace-payment-methods",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#replace-payment-agreement",
          }),
        ]);

        if (!isMounted) {
          await paymentMethodWidget.destroy();
          await agreementWidget.destroy();
          return;
        }

        widgetsRef.current = widgets;
        paymentMethodWidgetRef.current = paymentMethodWidget;
        agreementWidgetRef.current = agreementWidget;
        setStatus("ready");
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setStatus("error");
          setMessage(getErrorMessage(error));
        }
      }
    }

    renderWidgets();

    return () => {
      isMounted = false;
    };
  }, [checkout, isSdkReady]);

  async function handleStartPremium() {
    setStatus("creating");
    setMessage("");

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
      });
      const data = (await response.json().catch(() => ({}))) as
        | Partial<CheckoutSession>
        | { message?: string };

      if (response.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "message" in data && data.message
            ? data.message
            : "결제를 준비하지 못했습니다.",
        );
      }

      if (
        !("clientKey" in data) ||
        !data.clientKey ||
        !data.customerKey ||
        !data.orderId ||
        !data.orderName ||
        !data.amount ||
        !data.successUrl ||
        !data.failUrl
      ) {
        throw new Error("결제 시작 응답이 올바르지 않습니다.");
      }

      setCheckout(data as CheckoutSession);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  async function handleRequestPayment() {
    if (!checkout || !widgetsRef.current) {
      setMessage("결제 위젯이 아직 준비되지 않았습니다.");
      return;
    }

    setStatus("requesting");
    setMessage("");

    try {
      await widgetsRef.current.requestPayment({
        orderId: checkout.orderId,
        orderName: checkout.orderName,
        successUrl: checkout.successUrl,
        failUrl: checkout.failUrl,
      });
    } catch (error) {
      console.error(error);
      setStatus("ready");
      setMessage(getErrorMessage(error));
    }
  }

  const isPreparing = status === "creating" || status === "rendering";
  const isPaymentButtonDisabled = status !== "ready";

  return (
    <div className="space-y-6">
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
        onLoad={() => setIsSdkReady(true)}
        onError={() => {
          setStatus("error");
          setMessage("Toss Payments 위젯을 불러오지 못했습니다.");
        }}
      />

      <button
        type="button"
        onClick={handleStartPremium}
        disabled={isPreparing || status === "requesting"}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#87977F] px-7 py-4 text-lg font-semibold text-[#FCFBF8] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPreparing ? "결제 준비 중..." : "Premium 시작하기"}
      </button>

      {message && (
        <div
          role="alert"
          className="rounded-2xl border border-[#E5C8BA] bg-[#FFF8F4] px-4 py-3 text-base font-semibold leading-7 text-[#7A4B3A]"
        >
          {message}
        </div>
      )}

      {checkout && (
        <div className="space-y-5 border-t border-[#EFEAE2] pt-6">
          <div className="flex flex-col gap-1 text-[#4D5748] sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xl font-semibold">Re:Place Premium</p>
            <p className="text-lg font-semibold">{PREMIUM_PRICE_LABEL}</p>
          </div>

          <div
            id="replace-payment-methods"
            className="min-h-[190px] rounded-[24px] bg-white/70"
          />
          <div
            id="replace-payment-agreement"
            className="min-h-[64px] rounded-[24px] bg-white/70"
          />

          <button
            type="button"
            onClick={handleRequestPayment}
            disabled={isPaymentButtonDisabled}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#4D5748] px-7 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(77,87,72,0.16)] transition hover:bg-[#354033] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "requesting" ? "결제창 여는 중..." : "4,900원 결제하기"}
          </button>
        </div>
      )}
    </div>
  );
}
