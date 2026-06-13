import { normalizeSiteUrl } from "../lib/siteUrl";

export function GET() {
  const base = normalizeSiteUrl(import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL);
  const sitemap = base ? `Sitemap: ${base}/sitemap.xml\n` : "";
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
