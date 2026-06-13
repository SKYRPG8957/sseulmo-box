import { describe, expect, it } from "vitest";
import { averageBlockColor, clampRect, getMosaicBlockSize, normalizeRect, scaleRectToCanvas } from "../lib/image/redactImage";

describe("redact image utils", () => {
  it("normalizes drag direction", () => {
    expect(normalizeRect(100, 80, 20, 10)).toEqual({ x: 20, y: 10, width: 80, height: 70 });
  });

  it("clamps rect inside canvas", () => {
    expect(clampRect({ x: -10, y: 5, width: 200, height: 50 }, 100, 80)).toEqual({ x: 0, y: 5, width: 100, height: 50 });
  });

  it("scales display rect to canvas rect", () => {
    expect(scaleRectToCanvas({ x: 10, y: 20, width: 50, height: 40 }, 100, 100, 200, 300)).toEqual({ x: 20, y: 60, width: 100, height: 120 });
  });

  it("keeps mosaic block size moderate", () => {
    expect(getMosaicBlockSize(50, 50)).toBe(6);
    expect(getMosaicBlockSize(360, 240)).toBe(13);
    expect(getMosaicBlockSize(2000, 2000)).toBe(18);
  });

  it("averages mosaic colors without turning transparent pixels black", () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 0,
      100, 50, 0, 255,
      200, 100, 0, 255,
      0, 0, 0, 0
    ]);

    expect(averageBlockColor(pixels, 2, 0, 0, 2, 2)).toEqual({ red: 150, green: 75, blue: 0, alpha: 0.5 });
    expect(averageBlockColor(new Uint8ClampedArray([0, 0, 0, 0]), 1, 0, 0, 1, 1)).toEqual({ red: 0, green: 0, blue: 0, alpha: 0 });
  });
});
