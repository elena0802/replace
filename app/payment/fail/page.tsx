import type { Metadata } from "next";
import Link from "next/link";
import { mapPaymentFailMessage } from "@/lib/errors/userMessages";

export const metadata: Metadata = {
  title: "결제 실패 | Re:Place",
};

type PaymentFailPageProps = {
  searchParams?: Promise<{
    code?: string | string[];
    message?: string | string[];
    orderId?: string | string[];
  }>;
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const params = await searchParams;
  const code = getFirstParam(params?.code);
  const message = getFirstParam(params?.message);
  const orderId = getFirstParam(params?.orderId);

  if (code) {
    console.error("Payment fail code:", code);
  }

  const displayMessage = mapPaymentFailMessage(message);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-2xl rounded-xl border border-danger-border bg-surface p-7 text-center shadow-card sm:p-9">
        <p className="text-lg font-semibold text-danger">결제 실패</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-ink">
          Premium 결제를 완료하지 못했어요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-stone">
          {displayMessage}
        </p>
        {orderId && (
          <div className="mt-6 rounded-2xl bg-page px-5 py-4 text-sm font-semibold leading-7 text-meta">
            <p>주문번호 {orderId}</p>
          </div>
        )}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-3 text-base font-semibold text-brand-foreground transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-surface px-7 py-3 text-base font-semibold text-link transition hover:border-brand-muted hover:bg-subtle focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
