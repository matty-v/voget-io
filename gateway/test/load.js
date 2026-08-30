import assert from "node:assert/strict";
import { KioskGateway } from "../src/gateway.js";

const base = {
  kyberURL: "https://kyber.invalid", agentName: "kiosk", apiKey: "load-test", harness: "Codex",
  deadlineMs: 50, pollMs: 1, maxConcurrency: 4, maxResponseChars: 8000,
  rateBurst: 5, ratePerSecond: 0.001, circuitFailures: 3, circuitResetMs: 1000,
};

await rateLimitScenario();
await concurrencyScenario();
await storeFailureScenario();
console.log(JSON.stringify({ result: "pass", scenarios: ["rate", "concurrency", "store_failure"] }));

async function rateLimitScenario() {
  const gateway = new KioskGateway(base, completedFetch());
  const results = await Promise.all(Array.from({ length: 50 }, () => gateway.run("features", "same-ip")));
  assert.equal(results.filter((value) => value.status === 429).length, 46);
  assert.equal(results.filter((value) => value.body.live).length, 4);
  assert.equal(results.filter((value) => value.body.error === "busy").length, 1);
}

async function concurrencyScenario() {
  const releases = [];
  const gateway = new KioskGateway(base, (_url, init) => new Promise((resolve, reject) => {
    releases.push(() => resolve(response(503, {})));
    init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
  }));
  const active = Array.from({ length: 4 }, (_, index) => gateway.run("joke", `active-${index}`));
  const shed = await Promise.all(Array.from({ length: 20 }, (_, index) => gateway.run("joke", `shed-${index}`)));
  assert.equal(shed.filter((value) => value.body.error === "busy").length, 20);
  releases.forEach((release) => release());
  await Promise.all(active);
}

async function storeFailureScenario() {
  let calls = 0;
  const gateway = new KioskGateway(base, async () => {
    calls++;
    return response(503, {});
  });
  const results = [];
  for (let index = 0; index < 20; index++) results.push(await gateway.run("architecture", `ip-${index}`));
  assert.equal(results.every((value) => value.status === 200 && value.body.live === false), true);
  assert.equal(calls, base.circuitFailures);
}

function completedFetch() {
  let next = 0;
  return async (_url, init) => init.method === "POST"
    ? response(202, { id: `req_${++next}` })
    : response(200, { status: "completed", response: "ok" });
}
function response(status, body) { return { status, json: async () => body }; }
