import type { Metadata } from "next";
import PaymentSuccessResult from "@/components/PaymentSuccessResult";

export const metadata: Metadata = {
  title: "결제 완료 | Re:Place",
};

type PaymentSuccessPageProps = {
  searchParams?: Promise<{
    paymentKey?: string | string[];
    orderId?: string | string[];
    amount?: string | string[];
    paymentType?: string | string[];
  }>;
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <PaymentSuccessResult
        paymentKey={getFirstParam(params?.paymentKey)}
        orderId={getFirstParam(params?.orderId)}
        amount={getFirstParam(params?.amount)}
        paymentType={getFirstParam(params?.paymentType)}
      />
    </div>
  );
}
