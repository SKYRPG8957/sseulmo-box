import { useRef, useState } from "react";
import { drawRedaction, normalizeRect, scaleRectToCanvas, type Rect, type RedactionMode } from "../../lib/image/redactImage";

type Point = { x: number; y: number };

const modeLabels: Record<RedactionMode, string> = {
  blur: "블러",
  mosaic: "모자이크",
  black: "검은 박스",
  white: "흰 박스",
  red: "빨간 박스"
};

const fileTypeLabels: Record<"image/png" | "image/jpeg" | "image/webp", string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP"
};

export default function ScreenshotRedactor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<string>("");
  const history = useRef<ImageData[]>([]);
  const dragStart = useRef<Point | null>(null);
  const [mode, setMode] = useState<RedactionMode>("black");
  const [note, setNote] = useState("");
  const [selection, setSelection] = useState<Rect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [status, setStatus] = useState("이미지를 선택한 뒤 가릴 영역을 드래그하세요.");
  const statusClass = status.includes("못했습니다") || status.includes("없습니다") || status.includes("선택할 수") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted";

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const revokeImageUrl = () => {
    if (!imageUrlRef.current) return;
    URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = "";
  };

  const getPoint = (event: React.PointerEvent<HTMLDivElement>): Point | null => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(event.clientX - bounds.left, bounds.width)),
      y: Math.max(0, Math.min(event.clientY - bounds.top, bounds.height))
    };
  };

  const load = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("이미지 파일만 선택할 수 있습니다.");
      clearFileInput();
      return;
    }
    revokeImageUrl();
    let url = "";
    try {
      url = URL.createObjectURL(file);
    } catch {
      setStatus("이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.");
      clearFileInput();
      return;
    }
    imageUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        revokeImageUrl();
        clearFileInput();
        setStatus("이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.");
        return;
      }
      const maxSide = 1800;
      const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        revokeImageUrl();
        clearFileInput();
        setStatus("이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.");
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      history.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      setSelection(null);
      setHasImage(true);
      setStatus("가릴 영역을 드래그하세요.");
      revokeImageUrl();
      clearFileInput();
    };
    img.onerror = () => {
      revokeImageUrl();
      setStatus("이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.");
      clearFileInput();
    };
    img.src = url;
  };

  const apply = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setStatus("이미지를 먼저 선택해 주세요.");
      return;
    }
    if (!selection || selection.width < 6 || selection.height < 6) {
      setStatus("가릴 영역을 먼저 선택해 주세요.");
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    const canvasRect = scaleRectToCanvas(selection, bounds.width, bounds.height, canvas.width, canvas.height);
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    drawRedaction(ctx, canvasRect, mode);
    if (note.trim()) {
      ctx.fillStyle = "#DC2626";
      ctx.font = `${Math.max(18, Math.round(canvas.height * 0.035))}px sans-serif`;
      ctx.fillText(note.trim(), canvasRect.x, Math.min(canvas.height - 12, canvasRect.y + canvasRect.height + 28));
    }
    setSelection(null);
    setStatus(`${modeLabels[mode]} 처리했습니다.`);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || history.current.length <= 1) {
      setStatus("되돌릴 내용이 없습니다.");
      return;
    }
    history.current.pop();
    const last = history.current[history.current.length - 1];
    ctx.putImageData(last, 0, 0);
    setSelection(null);
    setStatus("되돌렸습니다.");
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const first = history.current[0];
    if (canvas && ctx && first) {
      ctx.putImageData(first, 0, 0);
      history.current = [first];
      setSelection(null);
      setStatus("처음 상태로 돌렸습니다.");
    }
  };

  const download = (type: "image/png" | "image/jpeg" | "image/webp") => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setStatus("저장할 이미지가 없습니다.");
      return;
    }
    try {
      const url = canvas.toDataURL(type, 0.92);
      if (!url) {
        setStatus("저장할 이미지가 없습니다.");
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = `screenshot-redacted.${type.split("/")[1]}`;
      a.click();
      setStatus(`가린 이미지를 ${fileTypeLabels[type]}로 저장했습니다.`);
    } catch {
      setStatus(`이미지를 ${fileTypeLabels[type]}로 저장하지 못했습니다. 다시 시도해 주세요.`);
    }
  };

  return (
    <div className="panel">
      <label className="label">이미지 선택
        <input ref={fileInputRef} className="field" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => event.target.files?.[0] && load(event.target.files[0])} />
      </label>

      <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-end">
        <label className="label">가림 방식
          <select className="field" value={mode} onChange={(event) => setMode(event.target.value as RedactionMode)}>
            <option value="blur">블러</option>
            <option value="mosaic">모자이크</option>
            <option value="black">검은 박스</option>
            <option value="white">흰 박스</option>
            <option value="red">빨간 박스</option>
          </select>
        </label>
        <label className="label">텍스트 주석
          <input className="field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="필요할 때만 입력" />
        </label>
        <div className="grid grid-cols-2 gap-2 md:flex">
          <button className="btn" type="button" onClick={apply}>선택 영역 가리기</button>
          <button className="btn-secondary" type="button" onClick={undo}>되돌리기</button>
        </div>
      </div>

      <div
        aria-label="가릴 영역 선택"
        className="relative mt-5 touch-none overflow-hidden rounded-lg border border-border bg-slate-50"
        onPointerDown={(event) => {
          const point = getPoint(event);
          if (!point || !canvasRef.current?.width) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = point;
          setSelection({ x: point.x, y: point.y, width: 0, height: 0 });
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          if (!isDragging || !dragStart.current) return;
          const point = getPoint(event);
          if (!point) return;
          setSelection(normalizeRect(dragStart.current.x, dragStart.current.y, point.x, point.y));
        }}
        onPointerUp={(event) => {
          if (isDragging) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setIsDragging(false);
            setStatus("선택 영역을 확인한 뒤 적용하세요.");
          }
        }}
      >
        <canvas ref={canvasRef} className="block max-h-[68vh] w-full object-contain" />
        {selection && (
          <div
            className="pointer-events-none absolute border-2 border-brand bg-teal-200/25"
            style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }}
          />
        )}
      </div>

      <p className={statusClass} role="status" aria-live="polite">{status}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-secondary" type="button" onClick={() => download("image/png")} disabled={!hasImage}>가린 이미지 PNG 저장</button>
        <button className="btn-secondary" type="button" onClick={() => download("image/jpeg")} disabled={!hasImage}>가린 이미지 JPG 저장</button>
        <button className="btn-secondary" type="button" onClick={() => download("image/webp")} disabled={!hasImage}>가린 이미지 WebP 저장</button>
        <button className="btn-secondary" type="button" onClick={reset} disabled={!hasImage}>가림 초기화</button>
      </div>
    </div>
  );
}
