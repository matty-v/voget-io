import assert from "node:assert/strict";
import { KioskGateway } from "../src/gateway.js";

const base = {
  kyberURL: "https://kyber.invalid", agentName: "kiosk", apiKey: "load-test", harness: "Codex",
  deadlineMs: 50, pollMs: 1, maxQueueDepth: 4, maxResponseChars: 8000,
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
  assert.equal(results.filter((value) => value.body.error === "rate_limited").length, 45);
  assert.equal(results.filter((value) => value.body.error === "busy").length, 1);
}

async function concurrencyScenario() {
  let submissions = 0;
  const releases = [];
  const gateway = new KioskGateway(base, async (_url, init) => {
    if (init.method !== "POST") return response(200, { status: "completed", response: "ok" });
    submissions++;
    return new Promise((resolve) => releases.push(() => resolve(response(202, { id: `req_${submissions}` }))));
  });
  const active = Array.from({ length: 4 }, (_, index) => gateway.run("joke", `active-${index}`));
  const shed = await Promise.all(Array.from({ length: 20 }, (_, index) => gateway.run("joke", `shed-${index}`)));
  assert.equal(shed.filter((value) => value.body.error === "busy").length, 20);
  assert.equal(submissions, 1);
  for (let index = 0; index < active.length; index++) {
    while (releases.length === 0) await new Promise((resolve) => setTimeout(resolve, 1));
    releases.shift()();
  }
  assert.equal((await Promise.all(active)).every((value) => value.body.live), true);
  assert.equal(submissions, 4);
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
