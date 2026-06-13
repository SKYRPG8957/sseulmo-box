import { describe, expect, it } from "vitest";
import { clearPrivacyDraft, readPrivacyDraft, savePrivacyDraft, updatePrivacyDraftText } from "../lib/privacyDraftStorage";
import { maskText } from "../lib/tools/privacyMasker";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key)
  } as Pick<Storage, "getItem" | "setItem" | "removeItem">;
}

const brokenStorage = {
  getItem: () => { throw new Error("blocked"); },
  setItem: () => { throw new Error("blocked"); },
  removeItem: () => { throw new Error("blocked"); }
} as Pick<Storage, "getItem" | "setItem" | "removeItem">;

describe("privacy masker", () => {
  it("masks phone numbers", () => expect(maskText("010-1234-5678").output).not.toContain("1234"));
  it("masks email", () => expect(maskText("mail test@example.com").output).toContain("@***.com"));
  it("masks card-like pattern", () => expect(maskText("1234-5678-9012-3456").counts.card).toBe(1));
  it("masks rrn-like pattern", () => expect(maskText("900101-1234567").counts.rrn).toBe(1));
  it("masks rrn front digits when only the birth-date part is present", () => {
    const result = maskText("주민번호 앞자리는 900101 입니다.");

    expect(result.counts.rrn).toBe(1);
    expect(result.output).not.toContain("900101");
    expect(result.output).toContain("9****1");
  });
  it("does not mask arbitrary six digit numbers as rrn front digits", () => {
    const result = maskText("인증번호는 123456 입니다.");

    expect(result.counts.rrn).toBe(0);
    expect(result.output).toContain("123456");
  });
  it("changes by strength", () => expect(maskText("01012345678", { strength: "weak" }).output).not.toBe(maskText("01012345678", { strength: "strong" }).output));
  it("stores and clears privacy drafts", () => {
    const storage = createMemoryStorage();
    expect(readPrivacyDraft(storage)).toEqual({ available: true, save: false, text: "" });
    expect(savePrivacyDraft(storage, "draft")).toBe(true);
    expect(readPrivacyDraft(storage)).toEqual({ available: true, save: true, text: "draft" });
    expect(updatePrivacyDraftText(storage, "changed")).toBe(true);
    expect(readPrivacyDraft(storage).text).toBe("changed");
    expect(clearPrivacyDraft(storage)).toBe(true);
    expect(readPrivacyDraft(storage).save).toBe(false);
  });
  it("keeps privacy draft helpers safe when storage is blocked", () => {
    expect(readPrivacyDraft(brokenStorage)).toEqual({ available: false, save: false, text: "" });
    expect(savePrivacyDraft(brokenStorage, "draft")).toBe(false);
    expect(updatePrivacyDraftText(brokenStorage, "draft")).toBe(false);
    expect(clearPrivacyDraft(brokenStorage)).toBe(false);
  });
});
