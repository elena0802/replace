export const defaultLoginRedirectPath = "/my-places";

const safeRedirectOrigin = "https://replace.local";

export function getSafeAuthRedirectPath(
  value: string | null | undefined,
  fallback = defaultLoginRedirectPath,
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, safeRedirectOrigin);

    if (url.origin !== safeRedirectOrigin) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
