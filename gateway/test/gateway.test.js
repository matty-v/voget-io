import assert from "node:assert/strict";
import test from "node:test";
import { clientAddress, isRequestPath, KioskGateway, originAllowed } from "../src/gateway.js";

test("accepts direct and Firebase Hosting request paths only", () => {
  assert.equal(isRequestPath("/v1/requests"), true);
  assert.equal(isRequestPath("/api/kyber-kiosk/v1/requests"), true);
  assert.equal(isRequestPath("/api/kyber-kiosk/v1/requests/extra"), false);
});

test("uses the original visitor address behind Firebase Hosting", () => {
  assert.equal(clientAddress({ "x-forwarded-for": "203.0.113.8, 10.0.0.1" }, "127.0.0.1"), "203.0.113.8");
  assert.equal(clientAddress({ "cf-connecting-ip": "198.51.100.4", "x-forwarded-for": "203.0.113.8" }, "127.0.0.1"), "198.51.100.4");
  assert.equal(clientAddress({}, "127.0.0.1"), "127.0.0.1");
});

test("allows only production and project-scoped Firebase preview origins", () => {
  const origins = {
    allowedOrigins: new Set(["https://voget.io"]),
    allowedPreviewHostPrefix: "voget-io--",
    allowedPreviewHostSuffixes: ["web.app", "firebaseapp.com"],
  };
  assert.equal(originAllowed("https://voget.io", origins), true);
  assert.equal(originAllowed("https://voget-io--pr10-example.web.app", origins), true);
  assert.equal(originAllowed("https://voget-io--pr10-example.firebaseapp.com", origins), true);
  assert.equal(originAllowed("http://voget-io--pr10-example.web.app", origins), false);
  assert.equal(originAllowed("https://other--pr10-example.web.app", origins), false);
  assert.equal(originAllowed("https://voget-io--pr10-example.web.app.attacker.test", origins), false);
  assert.equal(originAllowed("not a URL", origins), false);
});

const config = {
  kyberURL: "https://kyber.invalid", agentName: "kiosk", apiKey: "test-key", harness: "Codex",
  deadlineMs: 100, pollMs: 1, maxConcurrency: 2, maxResponseChars: 20,
  rateBurst: 10, ratePerSecond: 1, circuitFailures: 2, circuitResetMs: 1000,
};

test("maps only allowlisted commands to fixed Kyber requests", async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    if (init.method === "POST") return json(202, { id: "req_1" });
    return json(200, { status: "completed", response: "live answer" });
  };
  const gateway = new KioskGateway(config, fetch);
  const denied = await gateway.run("free form", "1.2.3.4");
  assert.equal(denied.status, 400);
  assert.equal(calls.length, 0);

  const result = await gateway.run("about", "1.2.3.4");
  assert.equal(result.status, 200);
  assert.equal(result.body.live, true);
  const submitted = JSON.parse(calls[0].init.body);
  assert.match(submitted.prompt, /^Use \$glyph-about\./);
  assert.equal(submitted.correlation, "kiosk-v1:about");
  assert.equal(calls[0].init.headers.authorization, "Bearer test-key");

  const architecture = await gateway.run("architecture", "1.2.3.4");
  assert.equal(architecture.body.live, true);
  const architectureRequest = JSON.parse(calls[2].init.body);
  assert.match(architectureRequest.prompt, /^Use \$kyber-architecture\./);
  assert.equal(architectureRequest.correlation, "kiosk-v1:architecture");

  const features = await gateway.run("features", "1.2.3.4");
  assert.equal(features.body.live, true);
  const featuresRequest = JSON.parse(calls[4].init.body);
  assert.match(featuresRequest.prompt, /^Use \$kyber-features\./);
  assert.equal(featuresRequest.correlation, "kiosk-v1:features");
});

test("bounds rate and concurrency", async () => {
  let release;
  const fetch = () => new Promise((resolve) => { release = () => resolve(json(503, {})); });
  const gateway = new KioskGateway({ ...config, maxConcurrency: 1, rateBurst: 1 }, fetch);
  const first = gateway.run("joke", "one");
  assert.equal((await gateway.run("joke", "two")).body.error, "busy");
  assert.equal((await gateway.run("joke", "one")).body.error, "rate_limited");
  release();
  await first;
});

test("opens the circuit and serves bounded fallbacks", async () => {
  let calls = 0;
  const gateway = new KioskGateway({ ...config, circuitFailures: 2 }, async () => {
    calls++;
    return json(503, {});
  });
  assert.equal((await gateway.run("architecture", "one")).body.live, false);
  assert.equal((await gateway.run("architecture", "two")).body.live, false);
  const open = await gateway.run("architecture", "three");
  assert.equal(open.body.reason, "circuit_open");
  assert.equal(calls, 2);
});

test("enforces deadline and response cap", async () => {
  const timeoutGateway = new KioskGateway({ ...config, deadlineMs: 5 }, (_url, init) =>
    new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason))),
  );
  assert.equal((await timeoutGateway.run("joke", "one")).body.reason, "deadline");

  const responses = [json(202, { id: "req_2" }), json(200, { status: "completed", response: "x".repeat(30) })];
  const capGateway = new KioskGateway(config, async () => responses.shift());
  assert.equal((await capGateway.run("joke", "two")).body.response.length, 20);
});

function json(status, body) {
  return { status, json: async () => body };
}
