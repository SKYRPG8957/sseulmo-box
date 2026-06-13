const dayMs = 24 * 60 * 60 * 1000;

export function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function formatDateOnly(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(startValue: string, endValue: string) {
  const start = parseDateOnly(startValue);
  const end = parseDateOnly(endValue);
  if (!start || !end) return null;
  return Math.round((end.getTime() - start.getTime()) / dayMs);
}

export function addDays(dateValue: string, amount: number) {
  const date = parseDateOnly(dateValue);
  if (!date || !Number.isFinite(amount)) return "";
  const next = new Date(date.getTime() + Math.trunc(amount) * dayMs);
  return formatDateOnly(next);
}
