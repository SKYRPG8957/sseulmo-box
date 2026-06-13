import { useRef, useState } from "react";
import { makePdfFileName, validatePdfFiles } from "../../lib/pdf/pdfKit";

const formatSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
};

export default function PdfKit() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("정리한-PDF");
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const statusClass = status.includes("못했습니다") || status.includes("선택할 수") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted";

  const addFiles = (nextFiles: File[]) => {
    const pdfs = nextFiles.filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
    setFiles((current) => [...current, ...pdfs]);
    setStatus(pdfs.length === nextFiles.length ? "" : "PDF 파일만 선택할 수 있습니다.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
    setStatus("");
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setStatus("");
  };

  const merge = async () => {
    if (isWorking) return;
    const error = validatePdfFiles(files);
    if (error) {
      setStatus(error);
      return;
    }
    setIsWorking(true);
    setStatus("PDF를 합치는 중입니다.");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const output = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const copied = await output.copyPages(doc, doc.getPageIndices());
        copied.forEach((page) => output.addPage(page));
      }
      const bytes = await output.save();
      let url = "";
      try {
        url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = makePdfFileName(name);
        a.click();
        setStatus("저장했습니다.");
      } catch {
        setStatus("PDF를 저장하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        if (url) URL.revokeObjectURL(url);
      }
    } catch {
      setStatus("파일을 처리하지 못했습니다. PDF 파일을 다시 선택해 주세요.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="panel">
      <div
        className="rounded-lg border-2 border-dashed border-border-strong bg-slate-50 p-5 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <p className="font-semibold">PDF를 끌어다 놓거나 선택하세요</p>
        <p className="mt-1 text-sm text-muted">여러 파일을 선택한 뒤 순서를 바꿀 수 있습니다.</p>
        <label className="btn-secondary mt-4 cursor-pointer">
          파일 선택
          <input ref={fileInputRef} className="sr-only" type="file" multiple accept="application/pdf" onChange={(event) => addFiles(Array.from(event.target.files ?? []))} />
        </label>
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-semibold">파일 순서</h2>
        {files.length === 0 ? (
          <p className="mt-2 text-sm text-muted">아직 선택한 PDF가 없습니다.</p>
        ) : (
          <ol className="mt-3 grid gap-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{index + 1}. {file.name}</p>
                  <p className="text-xs text-muted">{formatSize(file.size)}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:flex">
                  <button className="btn-secondary px-3" type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} aria-label={`${file.name} 위로 이동`}>위로</button>
                  <button className="btn-secondary px-3" type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} aria-label={`${file.name} 아래로 이동`}>아래로</button>
                  <button className="btn-secondary px-3" type="button" onClick={() => removeFile(index)} aria-label={`${file.name} 삭제`}>삭제</button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="label">저장할 파일명
          <input className="field" value={name} onChange={(event) => { setName(event.target.value); setStatus(""); }} placeholder="예: 제출서류" />
        </label>
        <button className="btn" type="button" onClick={merge} disabled={isWorking || files.length === 0}>
          {isWorking ? "처리 중" : "PDF 합치기"}
        </button>
      </div>
      {status && <p className={statusClass} role="status" aria-live="polite">{status}</p>}
    </div>
  );
}
