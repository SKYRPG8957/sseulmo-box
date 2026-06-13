import { useMemo, useState } from "react";
import type { HomeToolSummary } from "../data/tools";

export default function HomeToolSearch({ tools }: { tools: HomeToolSummary[] }) {
  const [query, setQuery] = useState("");
  const hasQuery = Boolean(query.trim());
  const shortcutIds = ["pdf-kit", "privacy-masker", "screenshot-redactor", "document-packager"];
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return tools;
    return tools.filter((tool) => {
      const text = [tool.name, tool.shortName, tool.cardDescription, tool.category, ...tool.tags].join(" ").toLowerCase();
      return text.includes(keyword);
    });
  }, [query, tools]);
  const shortcuts = shortcutIds.map((id) => tools.find((tool) => tool.id === id)).filter((tool): tool is HomeToolSummary => Boolean(tool));

  return (
    <section className="mt-6">
      <label className="label" htmlFor="home-tool-search">도구 검색</label>
      <input
        id="home-tool-search"
        type="search"
        className="field mt-2"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="PDF 합치기, 전화번호 가리기, QR 만들기처럼 검색해보세요"
        autoComplete="off"
        enterKeyHint="search"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {shortcuts.map((tool) => (
          <a className="btn-secondary gap-2 no-underline" href={tool.route} key={tool.id}>
            <span>{tool.cta}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" role="status" aria-live="polite">
        {hasQuery ? `검색 결과 ${filtered.length}개` : "자주 쓰는 도구 바로가기"}
      </p>
      {hasQuery && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <a key={tool.id} href={tool.route} className="rounded-lg border border-border bg-white p-4 no-underline transition-colors hover:border-border-strong">
              <span className="flex items-center gap-2 text-xs font-semibold text-brand">
                {tool.category}
              </span>
              <strong className="mt-1 block text-base text-ink">{tool.name}</strong>
              <span className="mt-1 block text-sm leading-6 text-secondary">{tool.useCase}</span>
              <span className="mt-2 block text-xs leading-5 text-muted">{tool.privacyNote}</span>
              <span className="mt-3 inline-flex text-sm font-semibold text-brand">{tool.cta}</span>
            </a>
          ))}
        </div>
      )}
      {hasQuery && filtered.length === 0 && <p className="mt-4 text-sm text-muted">맞는 도구를 찾지 못했습니다.</p>}
    </section>
  );
}
