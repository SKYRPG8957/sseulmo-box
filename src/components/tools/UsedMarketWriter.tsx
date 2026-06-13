import { useState } from "react";
import {
  checklistForCategory,
  defectChecklist,
  hasMarketRequiredInput,
  makeMarketLongBody,
  makeMarketShortBody,
  makeMarketTitle,
  type MarketInput
} from "../../lib/market/usedMarketWriter";

const copy = async (text: string) => navigator.clipboard.writeText(text);

const initial: MarketInput = {
  category: "전자기기",
  product: "",
  boughtAt: "",
  usedFor: "",
  originalPrice: "",
  price: "",
  included: "",
  condition: "사용감 있음",
  defect: "",
  place: "",
  delivery: false,
  negotiable: false,
  refund: ""
};

const resultTabs = [
  { id: "short", label: "짧은 글" },
  { id: "long", label: "자세한 글" },
  { id: "checklist", label: "체크" }
] as const;

export default function UsedMarketWriter() {
  const [input, setInput] = useState(initial);
  const [tab, setTab] = useState<"short" | "long" | "checklist">("short");
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const copyStatusClass = !copyStatus ? "sr-only" : copyStatus.includes("못했습니다") || copyStatus.includes("먼저") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted";
  const set = (key: keyof MarketInput, value: string | boolean) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
    setCopyStatus("");
  };
  const shortBody = makeMarketShortBody(input);
  const longBody = makeMarketLongBody(input);
  const currentText = tab === "short" ? shortBody : tab === "long" ? longBody : [...defectChecklist(input), ...checklistForCategory(input.category)].map((item) => `- ${item}`).join("\n");
  const canCopy = hasMarketRequiredInput(input);
  const resultNotice = canCopy ? "작성된 글은 게시 전 다시 확인하세요." : "상품명을 입력하면 복사할 수 있습니다.";
  const handleCopy = async () => {
    if (!canCopy) {
      setCopyStatus("상품명을 먼저 입력해 주세요.");
      return;
    }
    try {
      await copy(currentText);
      setCopied(true);
      setCopyStatus("판매글을 복사했습니다.");
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setCopyStatus("복사하지 못했습니다. 직접 선택해 복사해 주세요.");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <section className="panel">
        <h2 className="text-lg font-semibold">상품 정보</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="label">상품명<input className="field" value={input.product} onChange={(event) => set("product", event.target.value)} /></label>
          <label className="label">카테고리<select className="field" value={input.category} onChange={(event) => set("category", event.target.value)}>{["전자기기", "가전", "의류", "가구", "도서", "유아용품", "취미용품", "기타"].map((cat) => <option key={cat}>{cat}</option>)}</select></label>
          <label className="label">구매 시기<input className="field" value={input.boughtAt} onChange={(event) => set("boughtAt", event.target.value)} placeholder="예: 2024년 3월" /></label>
          <label className="label">사용 기간<input className="field" value={input.usedFor} onChange={(event) => set("usedFor", event.target.value)} placeholder="예: 6개월" /></label>
          <label className="label">구매가<input className="field" value={input.originalPrice} onChange={(event) => set("originalPrice", event.target.value)} inputMode="numeric" /></label>
          <label className="label">희망 판매가<input className="field" value={input.price} onChange={(event) => set("price", event.target.value)} inputMode="numeric" /></label>
          <label className="label md:col-span-2">구성품<input className="field" value={input.included} onChange={(event) => set("included", event.target.value)} placeholder="예: 본체, 충전기, 박스" /></label>
        </div>

        <h2 className="mt-6 text-lg font-semibold">상태</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {(["거의 새것", "사용감 있음", "하자 있음"] as const).map((condition) => (
            <label key={condition} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3">
              <input type="radio" name="condition" checked={input.condition === condition} onChange={() => set("condition", condition)} />
              {condition}
            </label>
          ))}
        </div>
        <label className="label mt-3">하자 설명<input className="field" value={input.defect} onChange={(event) => set("defect", event.target.value)} placeholder="하자가 있으면 구체적으로 적기" /></label>

        <h2 className="mt-6 text-lg font-semibold">거래 조건</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="label">직거래 장소<input className="field" value={input.place} onChange={(event) => set("place", event.target.value)} placeholder="예: 홍대입구역 근처" /></label>
          <label className="label">교환/환불 안내<input className="field" value={input.refund} onChange={(event) => set("refund", event.target.value)} /></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3"><input type="checkbox" checked={input.delivery} onChange={(event) => set("delivery", event.target.checked)} />택배 가능</label>
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3"><input type="checkbox" checked={input.negotiable} onChange={(event) => set("negotiable", event.target.checked)} />네고 가능</label>
        </div>
      </section>

      <section className="panel">
        <h2 className="text-lg font-semibold">결과</h2>
        <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm font-semibold">{makeMarketTitle(input)}</p>
        <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="판매글 결과 보기">
          {resultTabs.map((item) => (
            <button
              id={`used-market-tab-${item.id}`}
              key={item.id}
              className={tab === item.id ? "btn" : "btn-secondary"}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="used-market-result-panel"
              onClick={() => {
                setTab(item.id);
                setCopied(false);
                setCopyStatus("");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div id="used-market-result-panel" role="tabpanel" aria-labelledby={`used-market-tab-${tab}`}>
          <textarea aria-label="판매글 결과" className="field mt-4 min-h-72" readOnly value={currentText} />
        </div>
        <p className="mt-3 text-sm text-muted">{resultNotice}</p>
        <button className="btn mt-4 w-full" type="button" onClick={handleCopy} disabled={!canCopy}>{copied ? "복사됨" : "판매글 복사"}</button>
        <p className={copyStatusClass} role="status" aria-live="polite">{copyStatus}</p>
      </section>
    </div>
  );
}
