import { makeAdsTxt } from "../lib/adsense";

export function GET() {
  const client = import.meta.env.PUBLIC_ADSENSE_CLIENT || process.env.PUBLIC_ADSENSE_CLIENT || "";

  return new Response(makeAdsTxt(client), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
