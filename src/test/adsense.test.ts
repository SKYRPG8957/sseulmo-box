import { describe, expect, it } from "vitest";
import { makeAdsTxt, normalizeAdSenseClient, normalizeAdSenseSlot } from "../lib/adsense";

describe("adsense helpers", () => {
  it("accepts only valid AdSense client values", () => {
    expect(normalizeAdSenseClient(" ca-pub-1234567890123456 ")).toBe("ca-pub-1234567890123456");
    expect(normalizeAdSenseClient("pub-1234567890123456")).toBe("");
    expect(normalizeAdSenseClient("ca-pub-demo")).toBe("");
    expect(normalizeAdSenseClient(undefined)).toBe("");
  });

  it("accepts only numeric ad slot values", () => {
    expect(normalizeAdSenseSlot(" 1234567890 ")).toBe("1234567890");
    expect(normalizeAdSenseSlot("slot-123")).toBe("");
    expect(normalizeAdSenseSlot(undefined)).toBe("");
  });

  it("builds ads.txt only from a valid client", () => {
    expect(makeAdsTxt("ca-pub-1234567890123456")).toBe("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
    expect(makeAdsTxt("pub-1234567890123456")).not.toContain("google.com, pub-");
  });
});
