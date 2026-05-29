import type { Metadata } from "next";
import Link from "next/link";

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

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-2xl rounded-[28px] border border-[#E5C8BA] bg-[#FCFBF8] p-7 text-center shadow-[0_18px_44px_rgba(77,87,72,0.08)] sm:p-9">
        <p className="text-lg font-semibold text-[#7A4B3A]">결제 실패</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          Premium 결제를 완료하지 못했어요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#6B6B68]">
          {message || "결제가 취소되었거나 승인되지 않았습니다."}
        </p>
        {(code || orderId) && (
          <div className="mt-6 rounded-2xl bg-[#F7F5EF] px-5 py-4 text-sm font-semibold leading-7 text-[#7D786F]">
            {code && <p>{code}</p>}
            {orderId && <p>주문번호 {orderId}</p>}
          </div>
        )}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#87977F] px-7 py-3 text-base font-semibold text-[#FCFBF8] transition hover:bg-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D8D1C6] bg-[#FCFBF8] px-7 py-3 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F3EFE8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
