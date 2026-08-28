import assert from "node:assert/strict";
import test from "node:test";
import { KioskGateway } from "../src/gateway.js";

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

  const result = await gateway.run("features", "1.2.3.4");
  assert.equal(result.status, 200);
  assert.equal(result.body.live, true);
  const submitted = JSON.parse(calls[0].init.body);
  assert.match(submitted.prompt, /^Run the kyber-features skill\./);
  assert.equal(submitted.correlation, "kiosk-v1:features");
  assert.equal(calls[0].init.headers.authorization, "Bearer test-key");
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
