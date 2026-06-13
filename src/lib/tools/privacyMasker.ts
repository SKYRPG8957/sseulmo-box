export type MaskStrength = "weak" | "normal" | "strong";
export type MaskOptions = {
  phone: boolean;
  email: boolean;
  account: boolean;
  card: boolean;
  rrn: boolean;
  query: boolean;
  strength: MaskStrength;
};

export const defaultMaskOptions: MaskOptions = { phone: true, email: true, account: true, card: true, rrn: true, query: true, strength: "normal" };

const repeat = (count: number) => "*".repeat(Math.max(2, count));
const middleMask = (value: string, strength: MaskStrength) => {
  const visible = strength === "weak" ? 3 : strength === "normal" ? 2 : 1;
  if (value.length <= visible * 2) return repeat(value.length);
  return value.slice(0, visible) + repeat(value.length - visible * 2) + value.slice(-visible);
};
const maskDigits = (value: string, strength: MaskStrength) => {
  const digits = value.replace(/\D/g, "");
  const masked = middleMask(digits, strength);
  let index = 0;
  return value.replace(/\d/g, () => masked[index++] ?? "*");
};
const rrnFrontPattern = /(^|[^\d])(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))(?![-\s]?[1-4]\d{6})(?!\d)/g;

export function maskText(input: string, options: Partial<MaskOptions> = {}) {
  const config = { ...defaultMaskOptions, ...options };
  let output = input;
  const counts: Record<string, number> = { phone: 0, email: 0, account: 0, card: 0, rrn: 0, query: 0 };
  if (config.email) output = output.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (match) => { counts.email++; const [local, domain] = match.split("@"); return `${middleMask(local, config.strength)}@${domain.replace(/^[^.]+/, "***")}`; });
  if (config.phone) output = output.replace(/01[016789][-\s]?\d{3,4}[-\s]?\d{4}/g, (match) => { counts.phone++; return maskDigits(match, config.strength); });
  if (config.rrn) output = output.replace(/\b\d{6}[-\s]?[1-4]\d{6}\b/g, (match) => { counts.rrn++; return maskDigits(match, "strong"); });
  if (config.rrn) output = output.replace(rrnFrontPattern, (_match, prefix, front) => { counts.rrn++; return `${prefix}${maskDigits(front, "strong")}`; });
  if (config.card) output = output.replace(/\b(?:\d[ -]?){13,19}\b/g, (match) => { const digitCount = match.replace(/\D/g, "").length; if (digitCount < 14 || digitCount > 19) return match; counts.card++; return maskDigits(match, config.strength); });
  if (config.account) output = output.replace(/\b\d{2,6}[-\s]\d{2,6}[-\s]\d{2,8}\b/g, (match) => { counts.account++; return maskDigits(match, config.strength); });
  if (config.query) output = output.replace(/([?&][^=&#\s]+)=([^&#\s]+)/g, (_match, key) => { counts.query++; return `${key}=***`; });
  return { output, counts };
}
