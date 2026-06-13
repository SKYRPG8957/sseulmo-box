import { describe, expect, it } from "vitest";
import { normalizeSiteUrl } from "../lib/siteUrl";

describe("site url helper", () => {
  it("keeps http and https site urls", () => {
    expect(normalizeSiteUrl(" https://sseulmo.example/ ")).toBe("https://sseulmo.example");
    expect(normalizeSiteUrl("http://localhost:4321")).toBe("http://localhost:4321");
  });

  it("rejects invalid or unsupported site urls", () => {
    expect(normalizeSiteUrl("sseulmo.example")).toBe("");
    expect(normalizeSiteUrl("ftp://sseulmo.example")).toBe("");
    expect(normalizeSiteUrl(undefined)).toBe("");
  });
});
