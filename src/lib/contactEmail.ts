export function normalizeContactEmail(value: string | undefined) {
  const email = value?.trim() ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export function makeContactMailto(email: string, subject = "쓸모상자 문의") {
  const normalized = normalizeContactEmail(email);
  return normalized ? `mailto:${normalized}?subject=${encodeURIComponent(subject)}` : "";
}
