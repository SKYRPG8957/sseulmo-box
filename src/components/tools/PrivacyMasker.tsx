import { useEffect, useMemo, useState } from "react";
import {
  clearPrivacyDraft,
  readPrivacyDraft,
  savePrivacyDraft,
  updatePrivacyDraftText
} from "../../lib/privacyDraftStorage";
import { defaultMaskOptions, maskText, type MaskOptions, type MaskStrength } from "../../lib/tools/privacyMasker";

const downloadText = (text: string, filename: string, type = "text/plain;charset=utf-8") => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
};

const copy = async (text: string) => navigator.clipboard.writeText(text);

const sample = `거래 연락처는 010-1234-5678입니다.
메일은 test.user@sample.invalid로 주세요.
계좌는 110-123-456789이고, 링크는 https://sample.invalid/order?id=123&token=secret 입니다.`;

const optionLabels: { key: keyof Omit<MaskOptions, "strength">; label: string }[] = [
  { key: "phone", label: "휴대폰 번호" },
  { key: "email", label: "이메일" },
  { key: "account", label: "계좌번호처럼 보이는 숫자" },
  { key: "card", label: "카드번호처럼 보이는 숫자" },
  { key: "rrn", label: "주민번호처럼 보이는 패턴" },
  { key: "query", label: "URL 뒤 긴 값" }
];

const countLabels: Record<keyof Omit<MaskOptions, "strength">, string> = {
  phone: "휴대폰",
  email: "이메일",
  account: "계좌",
  card: "카드",
  rrn: "주민번호 패턴",
  query: "URL 값"
};

export default function PrivacyMasker() {
  const [text, setText] = useState("");
  const [save, setSave] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const [options, setOptions] = useState<MaskOptions>(defaultMaskOptions);
  const result = useMemo(() => maskText(text, options), [text, options]);
  const total = Object.values(result.counts).reduce((sum, count) => sum + count, 0);
  const statusMessage = copied ? "가린 텍스트를 복사했습니다." : status;
  const statusClass = !statusMessage ? "sr-only" : statusMessage.includes("못했습니다") || statusMessage.includes("없습니다") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted";

  useEffect(() => {
    const syncSavedText = () => {
      const draft = readPrivacyDraft(window.localStorage);
      setSave(draft.save);
      if (draft.save) setText(draft.text);
      if (!draft.available) setStatus("임시 저장을 사용할 수 없습니다. 텍스트 처리는 계속됩니다.");
    };

    syncSavedText();
    window.addEventListener("storage", syncSavedText);
    return () => window.removeEventListener("storage", syncSavedText);
  }, []);

  const setOption = (key: keyof MaskOptions, value: boolean | MaskStrength) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleText = (value: string) => {
    setText(value);
    setCopied(false);
    setStatus("");
    if (save && !updatePrivacyDraftText(window.localStorage, value)) {
      setSave(false);
      setStatus("임시 저장을 사용할 수 없습니다. 텍스트 처리는 계속됩니다.");
    }
  };

  const handleSave = (checked: boolean) => {
    if (checked) {
      if (!savePrivacyDraft(window.localStorage, text)) {
        setSave(false);
        setStatus("임시 저장을 사용할 수 없습니다. 텍스트 처리는 계속됩니다.");
        return;
      }
      setSave(true);
      setStatus("이 브라우저에 임시 저장합니다.");
      return;
    }
    clearPrivacyDraft(window.localStorage);
    setSave(false);
    setStatus("임시 저장을 껐습니다.");
  };

  const handleCopy = async () => {
    try {
      await copy(result.output);
      setCopied(true);
      setStatus("");
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setStatus("복사하지 못했습니다. 직접 선택해 복사해 주세요.");
    }
  };

  const handleDownload = () => {
    try {
      downloadText(result.output, "masked-text.txt");
      setCopied(false);
      setStatus("가린 텍스트 TXT를 저장했습니다.");
    } catch {
      setCopied(false);
      setStatus("TXT로 저장하지 못했습니다. 직접 선택해 복사해 주세요.");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <section className="panel">
        <label className="label">가릴 텍스트
          <textarea
            className="field min-h-56 resize-y"
            value={text}
            onChange={(event) => handleText(event.target.value)}
            placeholder="공유하기 전 확인할 텍스트를 붙여넣으세요."
          />
        </label>

        <div className="mt-4">
          <p className="text-sm font-semibold">가릴 항목</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {optionLabels.map((item) => (
              <label key={item.key} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(options[item.key])}
                  onChange={(event) => setOption(item.key, event.target.checked)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="label">가림 정도
            <select className="field" value={options.strength} onChange={(event) => setOption("strength", event.target.value as MaskStrength)}>
              <option value="weak">약하게</option>
              <option value="normal">보통</option>
              <option value="strong">강하게</option>
            </select>
          </label>
          <label className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm">
            <input type="checkbox" checked={save} onChange={(event) => handleSave(event.target.checked)} />
            이 브라우저에 임시 저장
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-secondary" type="button" onClick={() => handleText(sample)}>예시 넣기</button>
          <button className="btn-secondary" type="button" onClick={() => { handleText(""); setStatus("입력한 텍스트를 비웠습니다."); }}>비우기</button>
        </div>
      </section>

      <section className="panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">결과</h2>
            <p className="mt-1 text-sm text-muted">{total > 0 ? `${total}개 항목을 가렸습니다.` : "가릴 내용이 발견되지 않았습니다."}</p>
          </div>
          <span className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs text-muted">패턴 기준</span>
        </div>

        <textarea
          aria-label="가린 결과"
          className="field mt-4 min-h-56 resize-y"
          readOnly
          value={result.output}
          placeholder="결과가 여기에 표시됩니다."
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(Object.entries(result.counts) as [keyof Omit<MaskOptions, "strength">, number][]).map(([key, count]) => (
            <span key={key} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">{countLabels[key]} {count}</span>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button className="btn" type="button" onClick={handleCopy} disabled={!result.output}>{copied ? "복사됨" : "가린 텍스트 복사"}</button>
          <button className="btn-secondary" type="button" onClick={handleDownload} disabled={!result.output}>가린 텍스트 TXT 저장</button>
        </div>
        <p className={statusClass} role="status" aria-live="polite">{statusMessage}</p>
        <p className="mt-3 text-sm text-muted">자동 감지는 참고용입니다. 공유 전 원문과 결과를 다시 확인하세요.</p>
      </section>
    </div>
  );
}
