import { describe, expect, it } from "vitest";
import { makePdfFileName, parsePageRanges, sortPages } from "../lib/pdf/pdfKit";
describe("pdf kit utils", () => {
  it("parses page ranges", () => expect(parsePageRanges("1-2,4", 5)).toEqual([0,1,3]));
  it("rejects malformed page ranges", () => {
    expect(() => parsePageRanges("1-", 5)).toThrow("페이지 범위가 올바르지 않습니다.");
    expect(() => parsePageRanges("1-2-3", 5)).toThrow("페이지 범위가 올바르지 않습니다.");
    expect(() => parsePageRanges("0", 5)).toThrow("페이지 범위가 올바르지 않습니다.");
    expect(() => parsePageRanges("3-2", 5)).toThrow("페이지 범위가 전체 페이지 수를 벗어났습니다.");
    expect(() => parsePageRanges("6", 5)).toThrow("페이지 범위가 전체 페이지 수를 벗어났습니다.");
  });
  it("creates filename", () => expect(makePdfFileName("제출 파일")).toBe("제출-파일.pdf"));
  it("sorts pages", () => expect(sortPages([3,1,2], "desc")).toEqual([3,2,1]));
});
