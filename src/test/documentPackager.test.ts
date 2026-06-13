import { describe, expect, it } from "vitest";
import {
  buildChecklist,
  createSubmissionList,
  findMissingDocuments,
  makeDocumentZipFileName,
  recommendDocumentFileName,
  sanitizeFileName
} from "../lib/documents/documentPackager";
describe("document packager", () => {
  it("sanitizes filename", () => expect(sanitizeFileName("a/b:c")).toBe("a-b-c"));
  it("builds checklist", () => expect(buildChecklist(["a"], ["a", "b"])).toEqual(["a", "b"]));
  it("finds missing", () => expect(findMissingDocuments(["a"], {})).toEqual(["a"]));
  it("creates list", () => expect(createSubmissionList("홍길동", "입사지원", ["이력서"], { "이력서": "resume.pdf" })).toContain("resume.pdf"));
  it("uses fallbacks for blank submitter names", () => {
    expect(createSubmissionList("   ", "입사지원", ["이력서"], {})).toContain("제출자: 미입력");
    expect(recommendDocumentFileName("   ", "이력서", "resume.pdf")).toBe("제출자_이력서.pdf");
    expect(makeDocumentZipFileName("   ", "입사지원")).toBe("입사지원_서류.zip");
  });
  it("uses submitter name for zip filename when present", () => expect(makeDocumentZipFileName("홍길동", "입사지원")).toBe("홍길동_서류.zip"));
  it("recommends filename", () => expect(recommendDocumentFileName("홍길동", "이력서", "resume.pdf")).toBe("홍길동_이력서.pdf"));
});
