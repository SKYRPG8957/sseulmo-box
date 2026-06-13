import { availableTools } from "../data/tools";
import { guides } from "../data/guides";
import { normalizeSiteUrl } from "../lib/siteUrl";
export function GET() {
  const base = normalizeSiteUrl(import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL);
  const paths = ["/", "/tools", "/guides", "/about", "/contact", "/privacy", "/terms", ...availableTools.map((tool) => tool.path), ...guides.map((guide) => guide.path)];
  const urls = base ? paths.map((path) => `<url><loc>${base}${path}</loc></url>`).join("") : "";
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
