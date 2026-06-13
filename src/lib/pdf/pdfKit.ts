export function parsePageRanges(input: string, totalPages: number): number[] {
  if (!input.trim()) return Array.from({ length: totalPages }, (_, index) => index);
  const pages = new Set<number>();
  for (const part of input.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;
    const match = chunk.match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error("페이지 범위가 올바르지 않습니다.");
    const startRaw = Number(match[1]);
    const endRaw = match[2] ? Number(match[2]) : startRaw;
    if (!Number.isInteger(startRaw) || startRaw < 1) throw new Error("페이지 범위가 올바르지 않습니다.");
    const end = endRaw;
    if (!Number.isInteger(end) || end < startRaw || end > totalPages) throw new Error("페이지 범위가 전체 페이지 수를 벗어났습니다.");
    for (let page = startRaw; page <= end; page++) pages.add(page - 1);
  }
  return [...pages];
}

export function makePdfFileName(name: string) {
  const safe = name.trim().replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${safe || "sseulmo-pdf"}.pdf`;
}

export function validatePdfFiles(files: File[]) {
  if (files.length === 0) return "PDF 파일을 1개 이상 선택하세요.";
  if (files.some((file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))) return "PDF 파일만 선택할 수 있습니다.";
  return "";
}

export function sortPages(pages: number[], order: "asc" | "desc" = "asc") {
  return [...pages].sort((a, b) => order === "asc" ? a - b : b - a);
}
