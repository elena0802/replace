"use client";

const KAKAO_SDK_SCRIPT_ID = "kakao-js-sdk";
const KAKAO_SDK_SRC =
  "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js";
const KAKAO_SDK_INTEGRITY =
  "sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J";
const KAKAO_SDK_LOAD_TIMEOUT_MS = 10000;

export type KakaoShareFeedPayload = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
};

export type KakaoSdk = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share?: {
    sendDefault: (payload: KakaoShareFeedPayload) => void | Promise<unknown>;
  };
};

type KakaoWindow = Window & {
  Kakao?: KakaoSdk;
};

let kakaoSdkLoadPromise: Promise<KakaoSdk> | null = null;

function getKakaoSdk() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return (window as KakaoWindow).Kakao;
}

function isKakaoInitialized(kakao: KakaoSdk) {
  try {
    return kakao.isInitialized();
  } catch {
    return false;
  }
}

function resolveLoadedKakaoSdk(resolve: (kakao: KakaoSdk) => void, reject: () => void) {
  const kakao = getKakaoSdk();

  if (!kakao) {
    reject();
    return;
  }

  resolve(kakao);
}

function loadKakaoSdkScript() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new Error("Kakao JavaScript SDK can only be loaded in the browser."),
    );
  }

  const loadedKakao = getKakaoSdk();

  if (loadedKakao) {
    return Promise.resolve(loadedKakao);
  }

  if (kakaoSdkLoadPromise) {
    return kakaoSdkLoadPromise;
  }

  kakaoSdkLoadPromise = new Promise<KakaoSdk>((resolve, reject) => {
    const existingScript = document.getElementById(
      KAKAO_SDK_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const loadTimeout = window.setTimeout(
      rejectWithLoadError,
      KAKAO_SDK_LOAD_TIMEOUT_MS,
    );

    function cleanup() {
      window.clearTimeout(loadTimeout);
    }

    function rejectWithLoadError() {
      cleanup();
      document.getElementById(KAKAO_SDK_SCRIPT_ID)?.remove();
      kakaoSdkLoadPromise = null;
      reject(new Error("Kakao JavaScript SDK failed to load."));
    }

    function resolveWithKakaoSdk(kakao: KakaoSdk) {
      cleanup();
      resolve(kakao);
    }

    if (existingScript) {
      const kakao = getKakaoSdk();

      if (kakao) {
        resolveWithKakaoSdk(kakao);
        return;
      }

      existingScript.addEventListener(
        "load",
        () => resolveLoadedKakaoSdk(resolveWithKakaoSdk, rejectWithLoadError),
        { once: true },
      );
      existingScript.addEventListener("error", rejectWithLoadError, {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.addEventListener(
      "load",
      () => resolveLoadedKakaoSdk(resolveWithKakaoSdk, rejectWithLoadError),
      { once: true },
    );
    script.addEventListener("error", rejectWithLoadError, { once: true });

    document.head.appendChild(script);
  });

  return kakaoSdkLoadPromise;
}

export async function getInitializedKakaoSdk(appKey: string) {
  const kakao = await loadKakaoSdkScript();

  if (!isKakaoInitialized(kakao)) {
    kakao.init(appKey);
  }

  if (!isKakaoInitialized(kakao)) {
    throw new Error("Kakao JavaScript SDK initialization failed.");
  }

  return kakao;
}
