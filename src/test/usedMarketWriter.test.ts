import { describe, expect, it } from "vitest";
import {
  checklistForCategory,
  formatMarketPrice,
  hasMarketRequiredInput,
  makeMarketLongBody,
  makeMarketShortBody,
  makeMarketTitle,
  type MarketInput
} from "../lib/market/usedMarketWriter";

const baseInput: MarketInput = {
  category: "전자기기",
  product: "무선 키보드",
  boughtAt: "2025년 5월",
  usedFor: "3개월",
  originalPrice: "89000",
  price: "45000",
  included: "본체, 리시버",
  condition: "사용감 있음",
  defect: "",
  place: "홍대입구역",
  delivery: true,
  negotiable: false,
  refund: ""
};

describe("used market writer", () => {
  it("formats numeric prices without changing custom text", () => {
    expect(formatMarketPrice("45000")).toBe("45000원");
    expect(formatMarketPrice("45,000")).toBe("45,000원");
    expect(formatMarketPrice("무료나눔")).toBe("무료나눔");
  });

  it("requires a product name before copy actions", () => {
    expect(hasMarketRequiredInput({ product: "무선 키보드" })).toBe(true);
    expect(hasMarketRequiredInput({ product: "   " })).toBe(false);
  });

  it("builds short and long bodies from user input", () => {
    expect(makeMarketTitle(baseInput)).toBe("[전자기기] 무선 키보드 판매합니다 (45000원)");
    expect(makeMarketShortBody(baseInput)).toContain("구성품: 본체, 리시버");
    expect(makeMarketLongBody(baseInput)).toContain("구매가: 89000원");
    expect(makeMarketLongBody(baseInput)).toContain("직거래: 홍대입구역");
  });

  it("returns category checklist items", () => {
    expect(checklistForCategory("전자기기")).toContain("전원 켜진 사진");
    expect(checklistForCategory("기타")).toContain("실사용 사진");
  });
});
