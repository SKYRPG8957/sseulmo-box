export function normalizeAdSenseClient(value: string | undefined) {
  const client = value?.trim() ?? "";
  return /^ca-pub-\d{10,}$/.test(client) ? client : "";
}

export function normalizeAdSenseSlot(value: string | undefined) {
  const slot = value?.trim() ?? "";
  return /^\d+$/.test(slot) ? slot : "";
}

export function makeAdsTxt(value: string | undefined) {
  const client = normalizeAdSenseClient(value);
  const publisher = client.replace(/^ca-/, "");
  return publisher
    ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt is generated after a valid PUBLIC_ADSENSE_CLIENT is set.\n";
}
