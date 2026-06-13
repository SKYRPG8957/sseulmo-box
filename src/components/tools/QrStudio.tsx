import { useEffect, useMemo, useRef, useState } from "react";
import * as QRCode from "qrcode";
import { makeQrFileName, makeTextPayload, makeUrlPayload, makeWifiPayload, type QrType } from "../../lib/qr/qrStudio";

const renderSvg = (payload: string) => {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const margin = 2;
  const viewSize = size + margin * 2;
  const path = Array.from(qr.modules.data)
    .map((dark, index) => {
      if (!dark) return "";
      const x = index % size + margin;
      const y = Math.floor(index / size) + margin;
      return `M${x} ${y}h1v1H${x}z`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 ${viewSize} ${viewSize}" shape-rendering="crispEdges"><path fill="#FFFFFF" d="M0 0h${viewSize}v${viewSize}H0z"/><path fill="#0F766E" d="${path}"/></svg>`;
};

export default function QrStudio() {
  const [type, setType] = useState<QrType>("URL");
  const [label, setLabel] = useState("QR");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [saveStatus, setSaveStatus] = useState("");
  const labelRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const ssidRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncRestoredValues = () => {
      const restoredLabel = labelRef.current?.value;
      const restoredUrl = urlRef.current?.value;
      const restoredText = textRef.current?.value;
      const restoredSsid = ssidRef.current?.value;
      const restoredPassword = passwordRef.current?.value;

      if (restoredLabel && restoredLabel !== label) setLabel(restoredLabel);
      if (restoredUrl && restoredUrl !== url) setUrl(restoredUrl);
      if (restoredText && restoredText !== text) setText(restoredText);
      if (restoredSsid && restoredSsid !== ssid) setSsid(restoredSsid);
      if (restoredPassword && restoredPassword !== password) setPassword(restoredPassword);
    };

    syncRestoredValues();
    const frame = window.requestAnimationFrame(syncRestoredValues);
    const interval = window.setInterval(syncRestoredValues, 300);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);

  const payload = useMemo(() => {
    if (type === "URL") return makeUrlPayload(url);
    if (type === "일반 텍스트") return makeTextPayload(text);
    return makeWifiPayload(ssid, password, security);
  }, [type, url, text, ssid, password, security]);

  const preview = useMemo(() => {
    if (!payload) return { svg: "", error: "입력한 내용이 없습니다." };
    try {
      return { svg: renderSvg(payload), error: "" };
    } catch {
      return { svg: "", error: "QR을 만들지 못했습니다. 입력 내용을 다시 확인해 주세요." };
    }
  }, [payload]);
  const ready = Boolean(preview.svg);
  const statusMessage = preview.error || saveStatus || "QR을 만들었습니다.";
  const statusClass = preview.error || saveStatus.includes("못했습니다") ? "mt-3 text-sm text-danger" : saveStatus ? "mt-3 text-sm text-muted" : "sr-only";

  const changeType = (value: QrType) => {
    setType(value);
    setSaveStatus("");
  };

  const changeLabel = (value: string) => {
    setLabel(value);
    setSaveStatus("");
  };

  const changeUrl = (value: string) => {
    setUrl(value);
    setSaveStatus("");
  };

  const changeText = (value: string) => {
    setText(value);
    setSaveStatus("");
  };

  const changeSsid = (value: string) => {
    setSsid(value);
    setSaveStatus("");
  };

  const changePassword = (value: string) => {
    setPassword(value);
    setSaveStatus("");
  };

  const changeSecurity = (value: string) => {
    setSecurity(value);
    if (value === "없음") setPassword("");
    setSaveStatus("");
  };

  const downloadPng = async () => {
    if (!preview.svg) return;
    setSaveStatus("");
    let svgUrl = "";
    try {
      svgUrl = URL.createObjectURL(new Blob([preview.svg], { type: "image/svg+xml" }));
    } catch {
      setSaveStatus("PNG로 저장하지 못했습니다. SVG로 저장해 주세요.");
      return;
    }
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setSaveStatus("PNG로 저장하지 못했습니다. SVG로 저장해 주세요.");
          return;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = makeQrFileName(label, "png");
        a.click();
        setSaveStatus("QR PNG를 저장했습니다.");
      } catch {
        setSaveStatus("PNG로 저장하지 못했습니다. SVG로 저장해 주세요.");
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      setSaveStatus("PNG로 저장하지 못했습니다. SVG로 저장해 주세요.");
    };
    image.src = svgUrl;
  };

  const downloadSvg = () => {
    if (!preview.svg) return;
    setSaveStatus("");
    let url = "";
    try {
      url = URL.createObjectURL(new Blob([preview.svg], { type: "image/svg+xml" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = makeQrFileName(label, "svg");
      a.click();
      setSaveStatus("QR SVG를 저장했습니다.");
    } catch {
      setSaveStatus("SVG로 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
  };

  const reset = () => {
    setLabel("QR");
    setUrl("");
    setText("");
    setSsid("");
    setPassword("");
    setSecurity("WPA");
    setSaveStatus("");
  };

  return (
    <div className="panel grid gap-6 lg:grid-cols-[1fr_300px]">
      <section>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="label">QR 유형
            <select className="field" value={type} onChange={(event) => changeType(event.target.value as QrType)}>
              <option>URL</option>
              <option>일반 텍스트</option>
              <option>Wi-Fi</option>
            </select>
          </label>
          <label className="label">라벨
            <input ref={labelRef} className="field" value={label} onInput={(event) => changeLabel(event.currentTarget.value)} onKeyUp={(event) => changeLabel(event.currentTarget.value)} onBlur={(event) => changeLabel(event.currentTarget.value)} onChange={(event) => changeLabel(event.target.value)} placeholder="예: 메뉴판" />
          </label>
        </div>

        {type === "URL" && <label className="label mt-4">URL<input ref={urlRef} className="field" value={url} onInput={(event) => changeUrl(event.currentTarget.value)} onKeyUp={(event) => changeUrl(event.currentTarget.value)} onBlur={(event) => changeUrl(event.currentTarget.value)} onChange={(event) => changeUrl(event.target.value)} placeholder="https://사이트주소" /></label>}
        {type === "일반 텍스트" && <label className="label mt-4">내용<textarea ref={textRef} className="field min-h-32" value={text} onInput={(event) => changeText(event.currentTarget.value)} onKeyUp={(event) => changeText(event.currentTarget.value)} onBlur={(event) => changeText(event.currentTarget.value)} onChange={(event) => changeText(event.target.value)} placeholder="QR에 넣을 문구" /></label>}
        {type === "Wi-Fi" && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="label">네트워크 이름<input ref={ssidRef} className="field" value={ssid} onInput={(event) => changeSsid(event.currentTarget.value)} onKeyUp={(event) => changeSsid(event.currentTarget.value)} onBlur={(event) => changeSsid(event.currentTarget.value)} onChange={(event) => changeSsid(event.target.value)} /></label>
            <label className="label">비밀번호<input ref={passwordRef} className="field" type="password" autoComplete="off" value={password} onInput={(event) => changePassword(event.currentTarget.value)} onKeyUp={(event) => changePassword(event.currentTarget.value)} onBlur={(event) => changePassword(event.currentTarget.value)} onChange={(event) => changePassword(event.target.value)} disabled={security === "없음"} placeholder={security === "없음" ? "필요 없음" : ""} /></label>
            <label className="label">보안 방식<select className="field" value={security} onChange={(event) => changeSecurity(event.target.value)}><option>WPA</option><option>WEP</option><option>없음</option></select></label>
          </div>
        )}
        <p className="mt-3 text-sm text-muted">입력한 내용을 QR로 바꿉니다. Wi-Fi QR에는 입력한 네트워크 정보가 들어갑니다.</p>
        <button className="btn-secondary mt-4" type="button" onClick={reset}>입력 초기화</button>
      </section>

      <section className="rounded-lg border border-border bg-white p-5 text-center">
        <h2 className="text-lg font-semibold">미리보기</h2>
        {ready ? (
          <div
            role="img"
            aria-label="생성된 QR 미리보기"
            className="mx-auto mt-4 flex min-h-[244px] max-w-[244px] items-center justify-center rounded-lg border border-border bg-white p-3"
            dangerouslySetInnerHTML={{ __html: preview.svg }}
          />
        ) : (
          <div
            role="img"
            aria-label="QR 미리보기 대기"
            className="mx-auto mt-4 flex min-h-[244px] max-w-[244px] items-center justify-center rounded-lg border border-border bg-white p-3 text-sm text-muted"
          >
            입력 대기
          </div>
        )}
        <p className={statusClass} role="status" aria-live="polite">
          {statusMessage}
        </p>
        <div className="mt-4 grid gap-2">
          <button className="btn" type="button" onClick={downloadPng} disabled={!ready}>QR PNG 저장</button>
          <button className="btn-secondary" type="button" onClick={downloadSvg} disabled={!ready}>QR SVG 저장</button>
        </div>
      </section>
    </div>
  );
}
