import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const normalizeSiteUrl = (value) => {
  const raw = value?.trim();
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path === "/" ? "" : path}`;
  } catch {
    return undefined;
  }
};

export default defineConfig({
  integrations: [react()],
  site: normalizeSiteUrl(process.env.PUBLIC_SITE_URL),
  output: "static",
  vite: {
    optimizeDeps: {
      include: ["qrcode", "jszip", "pdf-lib"]
    }
  }
});
