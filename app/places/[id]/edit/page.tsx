import type { Metadata } from "next";
import EditPlaceForm from "@/components/EditPlaceForm";

type EditPlacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "장소 수정 | Re:Place",
};

export default async function EditPlacePage({ params }: EditPlacePageProps) {
  const { id } = await params;

  return <EditPlaceForm id={id} />;
}
