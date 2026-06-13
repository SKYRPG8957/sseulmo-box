export function sanitizeFileName(input: string) {
  return input.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "_").replace(/_+/g, "_").slice(0, 90) || "document";
}

export function buildChecklist(template: string[], extras: string[] = []) {
  return Array.from(new Set([...template, ...extras.map((item) => item.trim()).filter(Boolean)]));
}

export function findMissingDocuments(checklist: string[], matched: Record<string, string | undefined>) {
  return checklist.filter((item) => !matched[item]);
}

export function createSubmissionList(name: string, context: string, checklist: string[], matched: Record<string, string | undefined>) {
  return [`제출자: ${name.trim() || "미입력"}`, `제출 상황: ${context}`, "", ...checklist.map((item, index) => `${index + 1}. ${item}: ${matched[item] || "누락"}`)].join("\n");
}

export function recommendDocumentFileName(personName: string, itemName: string, originalFileName: string) {
  const extension = originalFileName.includes(".") ? originalFileName.split(".").pop() : "";
  const base = [personName.trim() || "제출자", itemName].map(sanitizeFileName).join("_");
  return extension ? `${base}.${extension}` : base;
}

export function makeDocumentZipFileName(personName: string, context: string) {
  return `${sanitizeFileName(personName.trim() || context || "서류")}_서류.zip`;
}
