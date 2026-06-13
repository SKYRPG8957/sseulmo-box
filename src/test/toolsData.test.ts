import { describe, expect, it } from "vitest";
import { guides } from "../data/guides";
import { getToolFaqItems } from "../data/toolFaqs";
import { availableTools, directoryToolSummaries, homeToolSummaries, plannedToolSummaries, plannedTools, tools } from "../data/tools";

describe("tools data", () => {
  it("keeps available and planned tools separate", () => {
    expect(availableTools.every((tool) => tool.status === "ready" || tool.status === "beta")).toBe(true);
    expect(plannedTools.every((tool) => tool.status === "planned")).toBe(true);
    expect(plannedTools.every((tool) => !("route" in tool) && !("path" in tool))).toBe(true);
    expect(availableTools).toHaveLength(tools.filter((tool) => tool.status === "ready" || tool.status === "beta").length);
    expect(plannedTools).toHaveLength(tools.filter((tool) => tool.status === "planned").length);
  });

  it("uses existing slugs for related data", () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const guideSlugs = new Set(guides.map((guide) => guide.slug));

    for (const tool of tools) {
      for (const relatedSlug of tool.relatedTools) {
        expect(toolSlugs.has(relatedSlug), `${tool.slug} related tool ${relatedSlug}`).toBe(true);
      }

      for (const relatedSlug of tool.related) {
        expect(toolSlugs.has(relatedSlug), `${tool.slug} legacy related tool ${relatedSlug}`).toBe(true);
      }

      for (const guideSlug of tool.relatedGuides) {
        expect(guideSlugs.has(guideSlug), `${tool.slug} related guide ${guideSlug}`).toBe(true);
      }
    }
  });

  it("links guides to existing ready or beta tools", () => {
    const availableSlugs = new Set(availableTools.map((tool) => tool.slug));

    for (const guide of guides) {
      expect(availableSlugs.has(guide.tool), `${guide.slug} guide tool ${guide.tool}`).toBe(true);
    }
  });

  it("keeps planned tool summaries lightweight for the tools page", () => {
    const allowedKeys = ["cardDescription", "category", "id", "name", "shortName", "status", "tags"];

    expect(plannedToolSummaries).toHaveLength(plannedTools.length);
    for (const tool of plannedToolSummaries) {
      expect(Object.keys(tool).sort()).toEqual(allowedKeys);
      expect(tool.status).toBe("planned");
      expect("path" in tool).toBe(false);
      expect("route" in tool).toBe(false);
      expect("faqs" in tool).toBe(false);
    }
  });

  it("keeps ready and beta directory summaries limited to fields used by the tools page", () => {
    const allowedKeys = ["badges", "cardDescription", "category", "cta", "description", "features", "id", "name", "privacyNote", "route", "shortName", "status", "tags", "useCase"];

    expect(directoryToolSummaries).toHaveLength(availableTools.length);
    for (const tool of directoryToolSummaries) {
      expect(Object.keys(tool).sort()).toEqual(allowedKeys);
      expect(tool.status === "ready" || tool.status === "beta").toBe(true);
      expect("path" in tool).toBe(false);
      expect("relatedGuides" in tool).toBe(false);
      expect("faqs" in tool).toBe(false);
      expect("sections" in tool).toBe(false);
    }
  });

  it("keeps home search summaries limited to fields used by the first screen", () => {
    const allowedKeys = ["badges", "cardDescription", "category", "cta", "id", "name", "privacyNote", "route", "shortName", "status", "tags", "useCase"];

    expect(homeToolSummaries).toHaveLength(availableTools.length);
    for (const tool of homeToolSummaries) {
      expect(Object.keys(tool).sort()).toEqual(allowedKeys);
      expect(tool.status === "ready" || tool.status === "beta").toBe(true);
      expect("path" in tool).toBe(false);
      expect("description" in tool).toBe(false);
      expect("features" in tool).toBe(false);
      expect("relatedGuides" in tool).toBe(false);
      expect("faqs" in tool).toBe(false);
      expect("sections" in tool).toBe(false);
    }
  });

  it("uses short non-repeated FAQ answers on available tool pages", () => {
    for (const tool of availableTools) {
      const items = getToolFaqItems(tool, 5);
      const answers = items.map((item) => item.answer);

      expect(items).toHaveLength(5);
      expect(new Set(answers).size, `${tool.slug} should not repeat FAQ answers`).toBe(answers.length);

      for (const item of items) {
        expect(item.answer.length, `${tool.slug} ${item.question}`).toBeLessThanOrEqual(160);
        expect(item.answer).not.toContain("완벽");
        expect(item.answer).not.toContain("최고");
        expect(item.answer).not.toContain("강력");
      }
    }
  });
});
