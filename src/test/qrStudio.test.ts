import { describe, expect, it } from "vitest";
import { escapeWifiField, makeQrFileName, makeTextPayload, makeUrlPayload, makeWifiPayload } from "../lib/qr/qrStudio";
describe("qr studio", () => {
  it("builds url payload", () => expect(makeUrlPayload(" https://example.com ")).toBe("https://example.com"));
  it("builds text payload", () => expect(makeTextPayload(" 안내 ")).toBe("안내"));
  it("builds wifi payload", () => expect(makeWifiPayload("shop", "pw")).toContain("WIFI:T:WPA;S:shop;P:pw;;"));
  it("escapes wifi payload fields", () => {
    expect(escapeWifiField('shop:1,2;"\\')).toBe('shop\\:1\\,2\\;\\\"\\\\');
    expect(makeWifiPayload(" cafe:1 ", "pw,;:", "WPA")).toBe("WIFI:T:WPA;S:cafe\\:1;P:pw\\,\\;\\:;;");
  });
  it("omits wifi passwords when security is none", () => expect(makeWifiPayload(" cafe ", "secret", "없음")).toBe("WIFI:T:nopass;S:cafe;P:;;"));
  it("builds filename", () => expect(makeQrFileName("가게 QR", "png")).toBe("가게-QR.png"));
});
