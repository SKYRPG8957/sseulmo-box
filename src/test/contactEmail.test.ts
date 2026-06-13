import { describe, expect, it } from "vitest";
import { makeContactMailto, normalizeContactEmail } from "../lib/contactEmail";

describe("contact email helper", () => {
  it("accepts plain contact emails", () => {
    expect(normalizeContactEmail(" owner@sseulmo.test ")).toBe("owner@sseulmo.test");
  });

  it("rejects invalid contact emails", () => {
    expect(normalizeContactEmail("owner")).toBe("");
    expect(normalizeContactEmail("owner@")).toBe("");
    expect(normalizeContactEmail(undefined)).toBe("");
  });

  it("builds a mailto link only for valid emails", () => {
    expect(makeContactMailto("owner@sseulmo.test")).toBe("mailto:owner@sseulmo.test?subject=%EC%93%B8%EB%AA%A8%EC%83%81%EC%9E%90%20%EB%AC%B8%EC%9D%98");
    expect(makeContactMailto("owner")).toBe("");
  });
});
