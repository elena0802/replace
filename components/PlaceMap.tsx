"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type NaverLatLng = object;
type NaverMapInstance = object;

type NaverMapsApi = {
  Event: {
    trigger: (target: NaverMapInstance, eventName: string) => void;
  };
  LatLng: new (latitude: number, longitude: number) => NaverLatLng;
  Map: new (
    element: HTMLElement,
    options: {
      center: NaverLatLng;
      draggable?: boolean;
      logoControl?: boolean;
      mapDataControl?: boolean;
      scaleControl?: boolean;
      scrollWheel?: boolean;
      zoom?: number;
      zoomControl?: boolean;
    },
  ) => NaverMapInstance;
  Marker: new (options: {
    map: NaverMapInstance;
    position: NaverLatLng;
  }) => object;
};

declare global {
  interface Window {
    naver?: {
      maps?: NaverMapsApi;
    };
  }
}

type PlaceMapProps = {
  latitude: number | null;
  longitude: number | null;
};

const naverMapClientId =
  process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim() ?? "";

export default function PlaceMap({ latitude, longitude }: PlaceMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [hasScriptError, setHasScriptError] = useState(false);

  const hasCoordinates = latitude !== null && longitude !== null;
  const canLoadMap = Boolean(naverMapClientId && hasCoordinates);

  useEffect(() => {
    if (
      !canLoadMap ||
      !isScriptReady ||
      !mapRef.current ||
      !window.naver?.maps ||
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    let isMounted = true;
    const mapElement = mapRef.current;

    try {
      mapElement.replaceChildren();

      const { Event, LatLng, Map, Marker } = window.naver.maps;
      const center = new LatLng(latitude, longitude);
      const map = new Map(mapElement, {
        center,
        draggable: true,
        logoControl: true,
        mapDataControl: false,
        scaleControl: false,
        scrollWheel: false,
        zoom: 16,
        zoomControl: false,
      });

      new Marker({
        map,
        position: center,
      });

      window.requestAnimationFrame(() => {
        if (isMounted) {
          Event.trigger(map, "resize");
        }
      });
    } catch (error) {
      console.error("Naver map initialization failed:", error);
      queueMicrotask(() => {
        if (isMounted) {
          setHasScriptError(true);
        }
      });
    }

    return () => {
      isMounted = false;
      mapElement.replaceChildren();
    };
  }, [canLoadMap, isScriptReady, latitude, longitude]);

  if (!hasCoordinates) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[#D9D2C8] bg-[#F8F6F2] px-5 text-center text-lg font-semibold leading-8 text-[#6B6B68] md:h-64">
        지도 위치 정보가 아직 없어요.
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#EAE3D8] md:h-64">
      {naverMapClientId && (
        <Script
          id="replace-naver-map-script"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(
            naverMapClientId,
          )}`}
          strategy="afterInteractive"
          onReady={() => setIsScriptReady(Boolean(window.naver?.maps))}
          onLoad={() => setIsScriptReady(Boolean(window.naver?.maps))}
          onError={() => setHasScriptError(true)}
        />
      )}

      <div
        ref={mapRef}
        className="h-full w-full"
        role="img"
        aria-label="네이버 지도"
      />

      {(!naverMapClientId || hasScriptError || !isScriptReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F8F6F2] px-5 text-center text-lg font-semibold leading-8 text-[#6B6B68]">
          {!naverMapClientId || hasScriptError
            ? "지도를 불러오지 못했어요."
            : "지도를 불러오는 중..."}
        </div>
      )}
    </div>
  );
}
