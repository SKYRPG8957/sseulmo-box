import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { availableTools, plannedTools } from "../data/tools";

describe("tool renderer policy", () => {
  it("only hydrates ready or beta tool components", async () => {
    const source = await readFile("src/components/ToolRenderer.astro", "utf8");

    for (const tool of availableTools) {
      expect(source).toContain(`slug === "${tool.slug}"`);
    }

    for (const tool of plannedTools) {
      expect(source).not.toContain(`slug === "${tool.slug}"`);
    }
  });

  it("keeps tool pages limited to ready or beta tools", async () => {
    const source = await readFile("src/pages/tools/_ToolPage.astro", "utf8");

    expect(source).toContain("getAvailableTool");
    expect(source).not.toContain('import { getTool }');
    expect(source).not.toContain("getTool(Astro.props.slug)");
    expect(source).not.toContain("isPlanned");
    expect(source).not.toContain("아직 준비 중인 도구입니다.");
    expect(source).not.toContain("준비 중입니다");
  });

  it("keeps tool cards limited to available tools", async () => {
    const source = await readFile("src/components/ToolCard.astro", "utf8");

    expect(source).toContain("AvailableToolMeta");
    expect(source).not.toContain('tool.status === "planned"');
    expect(source).not.toContain("준비 중");
    expect(source).toContain("useCase?: string");
    expect(source).toContain("privacyNote?: string");
    expect(source).toContain("badges?: string[]");
    expect(source).toContain('<a href={href} class="text-ink no-underline hover:text-brand">{title}</a>');
    expect(source).toContain("{ctaLabel}");
  });

  it("does not create direct route files for planned tools", async () => {
    const routeFiles = await readdir("src/pages/tools");

    for (const tool of plannedTools) {
      expect(routeFiles).not.toContain(`${tool.slug}.astro`);
    }
  });
});
