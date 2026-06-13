export type QrType = "URL" | "일반 텍스트" | "Wi-Fi";
export function makeUrlPayload(url: string) {
  return url.trim();
}
export function makeTextPayload(text: string) {
  return text.trim();
}
export function escapeWifiField(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}
export function makeWifiPayload(ssid: string, password: string, encryption = "WPA") {
  const type = encryption === "없음" ? "nopass" : encryption;
  const safePassword = type === "nopass" ? "" : escapeWifiField(password);
  return `WIFI:T:${type};S:${escapeWifiField(ssid.trim())};P:${safePassword};;`;
}
export function makeQrFileName(label: string, ext: "png" | "svg") {
  const safe = label.trim().replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^-|-$/g, "") || "qr-code";
  return `${safe}.${ext}`;
}
