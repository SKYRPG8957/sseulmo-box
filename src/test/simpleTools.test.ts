import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatDateOnly, parseDateOnly } from "../lib/date/dateCalculator";
import { parseParticipants, pickRandomItems } from "../lib/random/randomPicker";
import { countText } from "../lib/text/characterCounter";

describe("simple browser tools", () => {
  it("counts text characters, words, lines, and bytes", () => {
    expect(countText("안녕 test\n두번째")).toEqual({
      chars: 11,
      charsNoSpaces: 9,
      words: 3,
      lines: 2,
      bytes: 21
    });
  });

  it("calculates date differences and offsets", () => {
    expect(formatDateOnly(parseDateOnly("2026-06-14")!)).toBe("2026-06-14");
    expect(parseDateOnly("2026-02-31")).toBeNull();
    expect(daysBetween("2026-06-14", "2026-06-21")).toBe(7);
    expect(daysBetween("2026-06-21", "2026-06-14")).toBe(-7);
    expect(addDays("2026-06-14", 10)).toBe("2026-06-24");
    expect(addDays("2026-06-14", -3)).toBe("2026-06-11");
  });

  it("parses participants and picks without duplicates", () => {
    expect(parseParticipants("민수, 지영\n민수\n서준")).toEqual(["민수", "지영", "서준"]);
    expect(pickRandomItems(["a", "b", "c"], 2, () => 0)).toEqual(["a", "b"]);
    expect(pickRandomItems(["a"], 3, () => 0)).toEqual(["a"]);
  });
});
