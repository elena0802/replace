"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceForm from "@/components/PlaceForm";
import StatusMessage from "@/components/StatusMessage";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default function NewPlaceForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const user = await getCurrentUser();

      if (isMounted) {
        setRequiresLogin(!user);
        setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <StatusMessage>로그인 상태를 확인하는 중...</StatusMessage>;
  }

  if (requiresLogin) {
    return (
      <EmptyState
        title="로그인이 필요해요"
        description="로그인하고 나만의 장소 아카이브를 만들어보세요."
        actionHref="/login"
        actionLabel="로그인하기"
      />
    );
  }

  return <PlaceForm />;
}
