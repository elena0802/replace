import type { Metadata } from "next";
import PlaceDetail from "@/components/PlaceDetail";

type PlaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "장소 상세 | Re:Place",
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;

  return <PlaceDetail id={id} />;
}
