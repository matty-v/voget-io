import http from "node:http";
import { clientAddress, isRequestPath, KioskGateway, loadConfig } from "./gateway.js";

const config = loadConfig();
const gateway = new KioskGateway(config);
const port = Number(process.env.PORT ?? 8080);

http.createServer(async (request, response) => {
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  if (request.method === "GET" && request.url === "/healthz") return send(response, 200, { ok: true });
  if (request.method === "OPTIONS" && isRequestPath(request.url)) {
    const origin = request.headers.origin;
    if (!origin || !config.allowedOrigins.has(origin)) return send(response, 403, { error: "origin_denied" });
    response.setHeader("access-control-allow-origin", origin);
    response.setHeader("access-control-allow-methods", "POST, OPTIONS");
    response.setHeader("access-control-allow-headers", "content-type");
    response.setHeader("access-control-max-age", "600");
    response.writeHead(204);
    return response.end();
  }
  if (request.method !== "POST" || !isRequestPath(request.url)) return send(response, 404, { error: "not_found" });

  const origin = request.headers.origin;
  if (!origin || !config.allowedOrigins.has(origin)) return send(response, 403, { error: "origin_denied" });
  response.setHeader("access-control-allow-origin", origin);
  try {
    const body = await readJSON(request, 1024);
    const ip = clientAddress(request.headers, request.socket.remoteAddress);
    const result = await gateway.run(body.command, ip);
    send(response, result.status, result.body);
  } catch (error) {
    send(response, error?.code === "too_large" ? 413 : 400, { error: "invalid_request" });
  }
}).listen(port, "0.0.0.0", () => console.log(JSON.stringify({ event: "gateway_started", port })));

function send(response, status, body) { response.writeHead(status); response.end(JSON.stringify(body)); }
function readJSON(request, limit) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (Buffer.byteLength(data) > limit) reject(Object.assign(new Error("too large"), { code: "too_large" }));
    });
    request.on("end", () => { try { resolve(JSON.parse(data)); } catch (error) { reject(error); } });
    request.on("error", reject);
  });
}
