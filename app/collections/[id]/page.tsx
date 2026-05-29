import type { Metadata } from "next";
import CollectionDetailView from "@/components/CollectionDetailView";

type CollectionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "컬렉션 상세 | Re:Place",
};

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <CollectionDetailView id={id} />
    </div>
  );
}
