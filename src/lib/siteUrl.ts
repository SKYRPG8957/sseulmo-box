export function normalizeSiteUrl(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path === "/" ? "" : path}`;
  } catch {
    return "";
  }
}
