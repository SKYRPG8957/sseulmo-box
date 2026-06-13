import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { availableTools, plannedTools } from "../data/tools";
import { guides } from "../data/guides";
import { GET } from "../pages/sitemap.xml";
import { GET as getRobots } from "../pages/robots.txt";
import { GET as getAdsTxt } from "../pages/ads.txt";

let originalSiteUrl: string | undefined;
let originalAdSenseClient: string | undefined;

describe("sitemap", () => {
  beforeEach(() => {
    originalSiteUrl = process.env.PUBLIC_SITE_URL;
    originalAdSenseClient = process.env.PUBLIC_ADSENSE_CLIENT;
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.PUBLIC_SITE_URL;
    } else {
      process.env.PUBLIC_SITE_URL = originalSiteUrl;
    }
    if (originalAdSenseClient === undefined) {
      delete process.env.PUBLIC_ADSENSE_CLIENT;
    } else {
      process.env.PUBLIC_ADSENSE_CLIENT = originalAdSenseClient;
    }
  });

  it("includes ready and beta tools, guides, and static pages", async () => {
    process.env.PUBLIC_SITE_URL = "https://sseulmo.example";
    const response = GET();
    const body = await response.text();

    for (const path of ["/", "/tools", "/guides", "/about", "/contact", "/privacy", "/terms"]) {
      expect(body).toContain(`https://sseulmo.example${path}`);
    }

    for (const tool of availableTools) {
      expect(body).toContain(`https://sseulmo.example${tool.path}`);
    }

    for (const guide of guides) {
      expect(body).toContain(`https://sseulmo.example${guide.path}`);
    }
  });

  it("does not include planned tool pages", async () => {
    process.env.PUBLIC_SITE_URL = "https://sseulmo.example";
    const response = GET();
    const body = await response.text();

    for (const tool of plannedTools) {
      expect(body).not.toContain(`/tools/${tool.slug}`);
    }
  });

  it("does not fall back to a fake domain without a site url", async () => {
    delete process.env.PUBLIC_SITE_URL;
    const response = GET();
    const body = await response.text();

    expect(body).not.toContain("https://example.com");
    expect(body).not.toContain("<loc>");
  });

  it("does not use invalid site urls in sitemap or robots", async () => {
    process.env.PUBLIC_SITE_URL = "sseulmo.example";
    const sitemap = await GET().text();
    const robots = await getRobots().text();

    expect(sitemap).not.toContain("<loc>");
    expect(robots).not.toContain("Sitemap:");
    expect(robots).not.toContain("sseulmo.example");
  });

  it("adds a sitemap line to robots only when a site url is configured", async () => {
    process.env.PUBLIC_SITE_URL = "https://sseulmo.example";
    const withSite = await getRobots().text();
    expect(withSite).toContain("Sitemap: https://sseulmo.example/sitemap.xml");

    delete process.env.PUBLIC_SITE_URL;
    const withoutSite = await getRobots().text();
    expect(withoutSite).toContain("User-agent: *");
    expect(withoutSite).toContain("Allow: /");
    expect(withoutSite).not.toContain("Sitemap:");
    expect(withoutSite).not.toContain("https://example.com");
  });

  it("generates ads.txt from the AdSense client env only", async () => {
    process.env.PUBLIC_ADSENSE_CLIENT = "ca-pub-1234567890123456";
    const withClient = await getAdsTxt().text();
    expect(withClient).toBe("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");

    delete process.env.PUBLIC_ADSENSE_CLIENT;
    const withoutClient = await getAdsTxt().text();
    expect(withoutClient).not.toContain("pub-0000000000000000");
    expect(withoutClient).not.toContain("google.com, pub-");

    process.env.PUBLIC_ADSENSE_CLIENT = "pub-1234567890123456";
    const invalidClient = await getAdsTxt().text();
    expect(invalidClient).not.toContain("google.com, pub-1234567890123456");
  });
});
