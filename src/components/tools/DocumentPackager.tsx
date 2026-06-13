import { useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import templates from "../../data/document-package-templates.json";
import {
  buildChecklist,
  createSubmissionList,
  findMissingDocuments,
  makeDocumentZipFileName,
  recommendDocumentFileName,
} from "../../lib/documents/documentPackager";

type MatchMap = Record<string, number | "">;

export default function DocumentPackager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contexts = Object.keys(templates);
  const [context, setContext] = useState(contexts[0]);
  const [name, setName] = useState("");
  const [extraItem, setExtraItem] = useState("");
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [matches, setMatches] = useState<MatchMap>({});
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const statusClass = status.includes("못했습니다") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted";

  const checklist = useMemo(
    () => buildChecklist(templates[context as keyof typeof templates], customItems),
    [context, customItems]
  );
  const matchedNames = Object.fromEntries(checklist.map((item) => {
    const index = matches[item];
    return [item, typeof index === "number" ? files[index]?.name : undefined];
  }));
  const missing = findMissingDocuments(checklist, matchedNames);

  const addItem = () => {
    const value = extraItem.trim();
    if (!value) return;
    setCustomItems((items) => Array.from(new Set([...items, value])));
    setExtraItem("");
    setStatus("");
  };

  const removeItem = (item: string) => {
    setCustomItems((items) => items.filter((current) => current !== item));
    setMatches((current) => {
      const copy = { ...current };
      delete copy[item];
      return copy;
    });
  };

  const handleFiles = (nextFiles: File[]) => {
    setFiles(nextFiles);
    setMatches({});
    setStatus(nextFiles.length ? `파일 ${nextFiles.length}개를 선택했습니다. 항목에 다시 연결해 주세요.` : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const download = async () => {
    if (isWorking) return;
    setStatus("ZIP을 만드는 중입니다.");
    setIsWorking(true);
    try {
      const zip = new JSZip();
      const list = createSubmissionList(name, context, checklist, matchedNames);
      zip.file("제출서류목록.txt", list);
      checklist.forEach((item, index) => {
        const fileIndex = matches[item];
        if (typeof fileIndex !== "number") return;
        const file = files[fileIndex];
        if (!file) return;
        zip.file(`${String(index + 1).padStart(2, "0")}_${recommendDocumentFileName(name, item, file.name)}`, file);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      let url = "";
      try {
        url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = makeDocumentZipFileName(name, context);
        a.click();
        setStatus("ZIP을 저장했습니다.");
      } catch {
        setStatus("ZIP을 저장하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        if (url) URL.revokeObjectURL(url);
      }
    } catch {
      setStatus("ZIP을 만들지 못했습니다. 파일을 다시 선택해 주세요.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="panel">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="label">제출 상황
          <select className="field" value={context} onChange={(event) => { setContext(event.target.value); setMatches({}); setStatus(""); }}>
            {contexts.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="label">제출자 이름
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 홍길동" />
        </label>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">체크리스트</h2>
        <div className="mt-3 grid gap-2">
          {checklist.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-3">
              <label className="flex min-w-0 items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(matchedNames[item])} readOnly aria-label={`${item} 연결 여부`} />
                <span className="truncate">{item}</span>
              </label>
              {customItems.includes(item) && <button type="button" className="btn-secondary px-3" onClick={() => removeItem(item)} aria-label={`${item} 항목 삭제`}>삭제</button>}
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="label">항목 추가
            <input className="field" value={extraItem} onChange={(event) => setExtraItem(event.target.value)} placeholder="예: 경력증명서" />
          </label>
          <button className="btn-secondary self-end" type="button" onClick={addItem}>항목 추가</button>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">파일 연결</h2>
        <label className="mt-3 block rounded-lg border-2 border-dashed border-border-strong bg-slate-50 p-5 text-center text-sm">
          여러 파일 선택
          <input ref={fileInputRef} className="sr-only" type="file" multiple onChange={(event) => handleFiles(Array.from(event.target.files ?? []))} />
        </label>
        {files.length > 0 && (
          <div className="mt-3 grid gap-3">
            {checklist.map((item) => (
              <label key={item} className="label rounded-lg border border-border bg-white p-3">
                {item}
                <select
                  className="field"
                  value={matches[item] ?? ""}
                  onChange={(event) => setMatches((current) => ({ ...current, [item]: event.target.value === "" ? "" : Number(event.target.value) }))}
                >
                  <option value="">연결할 파일 선택</option>
                  {files.map((file, index) => <option key={`${file.name}-${index}`} value={index}>{file.name}</option>)}
                </select>
                {typeof matches[item] === "number" && files[matches[item] as number] && (
                  <span className="mt-2 block text-xs text-muted">추천 파일명: {recommendDocumentFileName(name, item, files[matches[item] as number].name)}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-warning-border bg-warning-soft p-4">
        <h2 className="text-lg font-semibold">결과</h2>
        <p className="mt-2 text-sm text-secondary">{missing.length ? `누락 항목: ${missing.join(", ")}` : "누락 항목이 없습니다."}</p>
        <button className="btn mt-4" type="button" onClick={download} disabled={isWorking || files.length === 0}>
          {isWorking ? "ZIP 만드는 중" : "서류 ZIP 만들기"}
        </button>
        {status && <p className={statusClass} role="status" aria-live="polite">{status}</p>}
      </section>
    </div>
  );
}
