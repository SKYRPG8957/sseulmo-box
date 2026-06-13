import { useMemo, useState } from "react";
import type { AvailableToolSummary, PlannedToolSummary } from "../data/tools";

type Props = {
  availableTools: AvailableToolSummary[];
  plannedTools: PlannedToolSummary[];
  categories: readonly string[];
};

const recommendedIds = ["privacy-masker", "pdf-kit", "screenshot-redactor", "document-packager", "qr-studio", "used-market-writer"];
const categoryTone: Record<string, { chip: string; bar: string; surface: string }> = {
  "PDF/서류": { chip: "bg-amber-50 text-amber-800", bar: "bg-amber-400", surface: "bg-amber-50/60" },
  "개인정보": { chip: "bg-teal-50 text-teal-800", bar: "bg-teal-500", surface: "bg-teal-50/60" },
  "이미지": { chip: "bg-sky-50 text-sky-800", bar: "bg-sky-500", surface: "bg-sky-50/60" },
  "문서": { chip: "bg-indigo-50 text-indigo-800", bar: "bg-indigo-500", surface: "bg-indigo-50/60" },
  "중고거래": { chip: "bg-rose-50 text-rose-800", bar: "bg-rose-500", surface: "bg-rose-50/60" },
  "QR": { chip: "bg-violet-50 text-violet-800", bar: "bg-violet-500", surface: "bg-violet-50/60" },
  "기타": { chip: "bg-slate-100 text-slate-700", bar: "bg-slate-500", surface: "bg-slate-50" }
};

function ToolListCard({ tool, featured = false }: { tool: AvailableToolSummary; featured?: boolean }) {
  const tone = categoryTone[tool.category] ?? categoryTone["기타"];
  return (
    <article className={featured ? "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300" : "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition-colors hover:border-slate-300"}>
      <div className={`absolute inset-x-0 top-0 h-[3px] ${tone.bar}`} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone.chip}`}>{tool.category}</span>
        {tool.badges.slice(0, 2).map((badge) => (
          <span key={badge} className="rounded-full border border-border bg-slate-50 px-2.5 py-1 text-xs text-muted">{badge}</span>
        ))}
        </div>
        <span className={`shrink-0 rounded-xl px-2.5 py-2 text-xs font-bold ${tone.chip}`}>{tool.badges[0]}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <a className="text-ink no-underline hover:text-brand" href={tool.route}>{tool.name}</a>
      </h3>
      <p className={featured ? "mt-2 line-clamp-2 text-sm leading-6 text-secondary" : "mt-2 text-sm leading-6 text-secondary"}>{tool.useCase}</p>
      <p className={`mt-3 rounded-xl px-3 py-2 text-xs leading-5 text-muted ${tone.surface}`}>{tool.privacyNote}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.features.slice(0, 4).map((feature) => (
          <span key={feature} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">{feature}</span>
        ))}
      </div>
      <a className={featured ? "btn mt-4 w-full no-underline" : "btn-secondary mt-5 w-full no-underline"} href={tool.route}>{tool.cta}</a>
    </article>
  );
}

export default function ToolDirectory({ availableTools, plannedTools, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");

  const filteredAvailable = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return availableTools.filter((tool) => {
      const matchesCategory = category === "전체" || tool.category === category;
      const text = [tool.name, tool.shortName, tool.description, tool.cardDescription, tool.useCase, tool.privacyNote, tool.category, ...tool.tags, ...tool.badges].join(" ").toLowerCase();
      return matchesCategory && (!keyword || text.includes(keyword));
    });
  }, [availableTools, category, query]);

  const filteredPlanned = useMemo(() => {
    return plannedTools.filter((tool) => category === "전체" || tool.category === category);
  }, [plannedTools, category]);

  const recommendedTools = recommendedIds
    .map((id) => availableTools.find((tool) => tool.id === id))
    .filter((tool): tool is AvailableToolSummary => Boolean(tool));
  const visibleCategories = categories
    .map((item) => ({ category: item, tools: filteredAvailable.filter((tool) => tool.category === item) }))
    .filter((item) => item.tools.length > 0);
  const hasQuery = Boolean(query.trim()) || category !== "전체";
  const resultCount = filteredAvailable.length;

  return (
    <section className="mt-0">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 md:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">검색</p>
            <label className="mt-1 block text-xl font-semibold text-ink" htmlFor="tool-search">무엇을 처리할까요?</label>
          </div>
        </div>
        <input
          id="tool-search"
          type="search"
          className="field mt-2 min-h-11 py-2"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="PDF 합치기, 전화번호 가리기, QR 만들기처럼 검색해보세요"
          autoComplete="off"
          enterKeyHint="search"
        />
        <div className="mt-3 flex flex-wrap gap-2" aria-label="카테고리 필터">
          {["전체", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? "min-h-10 rounded-xl bg-ink px-3.5 py-2 text-sm font-semibold text-white" : "min-h-10 rounded-xl border border-border-strong bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-slate-50"}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {hasQuery && (
          <p className="mt-3 text-xs text-muted" role="status" aria-live="polite">
            검색 결과 {resultCount}개
          </p>
        )}
      </div>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">추천 도구</p>
            <h2 className="mt-1 text-2xl font-semibold">자주 쓰는 도구</h2>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 min-[920px]:grid-cols-3">
          {recommendedTools.map((tool) => <ToolListCard key={tool.id} tool={tool} featured />)}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold">카테고리별 도구</h2>
        {filteredAvailable.length === 0 && <p className="mt-6 text-sm text-muted">조건에 맞는 사용 가능한 도구를 찾지 못했습니다.</p>}
        <div className="mt-5 space-y-10">
          {visibleCategories.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3">
                <span className={`h-8 w-1.5 rounded-full ${categoryTone[group.category]?.bar ?? "bg-slate-500"}`} />
                <h3 className="text-2xl font-semibold">{group.category}</h3>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => <ToolListCard key={tool.id} tool={tool} />)}
              </div>
            </section>
          ))}
        </div>
      </section>

      {filteredPlanned.length > 0 && (
        <details className="mt-12 rounded-xl border border-border bg-white p-4">
          <summary className="cursor-pointer text-base font-semibold">
            준비 중인 도구 {filteredPlanned.length}개
            <span className="ml-2 text-sm font-normal text-muted">사용 가능해지면 도구 목록에 추가됩니다.</span>
          </summary>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlanned.map((tool) => (
              <article key={tool.id} className="rounded-lg border border-border bg-slate-50 p-3">
                <h3 className="text-sm font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{tool.cardDescription}</p>
              </article>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
