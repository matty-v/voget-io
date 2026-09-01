const commands = Object.freeze({
  about: "Use $glyph-about. Follow every required section in the skill and tell the visitor a little about yourself.",
  joke: "Run the kyber-joke skill. Return one short, public-safe joke about AI agents or infrastructure.",
  features: "Use $kyber-features. Follow the skill exactly: provide selective formatted highlights and finish with its Quickstart link.",
  architecture: "Use $kyber-architecture. Follow the skill exactly: include its Mermaid diagram and brief component walkthrough.",
  gettingStarted: "Use $kyber-getting-started. Follow the skill exactly and return its welcoming Kyber link and formatted Helm quickstart.",
  contact: "Use $contact-matt. Follow the skill exactly and share Matt's three public contact options.",
});

const fallbacks = Object.freeze({
  about: "Glyph's live public profile is temporarily unavailable. Please try again shortly.",
  joke: "Glyph is taking a quick reboot. Even agents need a clean context window sometimes.",
  features: "Kyber provides persistent agent identity, isolated runtimes, durable memory, schedules, secure credentials, and controlled human channels.",
  architecture: "Kyber is a Kubernetes-native control plane that reconciles persistent, isolated agent runtimes from declarative resources.",
  gettingStarted: "Ready to put Kyber to work? [Visit Kyber](https://kyber.voget.io), then launch it with the published Helm chart:\n\n```bash\n# Install from the published Helm chart. Nothing to pin, no fork.\nhelm install kyber oci://ghcr.io/matty-v/charts/kyber \\\n  --namespace kyber-system --wait\n# 15 minutes from an empty cluster to a live fleet console\n```",
  contact: "Matt would love to chat. Email matt.voget@gmail.com, connect on LinkedIn, or visit github.com/matty-v.",
});

export const commandNames = Object.keys(commands);

export function isRequestPath(path) {
  return path === "/v1/requests" || path === "/api/kyber-kiosk/v1/requests";
}

export function clientAddress(headers, remoteAddress) {
  const cloudflare = headers["cf-connecting-ip"];
  if (typeof cloudflare === "string" && cloudflare.trim()) return cloudflare.trim();
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",", 1)[0].trim();
  return String(remoteAddress ?? "unknown");
}

export function originAllowed(origin, config) {
  if (config.allowedOrigins.has(origin)) return true;
  if (!config.allowedPreviewHostPrefix) return false;
  try {
    const url = new URL(origin);
    return url.protocol === "https:"
      && url.port === ""
      && url.hostname.startsWith(config.allowedPreviewHostPrefix)
      && config.allowedPreviewHostSuffixes.some((suffix) => url.hostname.endsWith(`.${suffix}`));
  } catch {
    return false;
  }
}

export class KioskGateway {
  constructor(config, fetchImpl = fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.active = false;
    this.queue = [];
    this.failures = 0;
    this.openUntil = 0;
    this.buckets = new Map();
  }

  async run(command, clientIP, signal) {
    if (!Object.hasOwn(commands, command)) return result(400, "invalid_command");
    if (!this.allow(clientIP)) return result(429, "rate_limited");
    if (this.queue.length + Number(this.active) >= this.config.maxQueueDepth) return result(429, "busy");
    if (Date.now() < this.openUntil) return fallback(command, "circuit_open");

    return new Promise((resolve) => {
      this.queue.push({ command, signal, resolve });
      this.drain();
    });
  }

  async drain() {
    if (this.active) return;
    const next = this.queue.shift();
    if (!next) return;
    this.active = true;
    try {
      next.resolve(await this.process(next.command, next.signal));
    } finally {
      this.active = false;
      this.drain();
    }
  }

  async process(command, signal) {
    if (signal?.aborted) return fallback(command, "cancelled");
    if (Date.now() < this.openUntil) return fallback(command, "circuit_open");

    const deadlineController = new AbortController();
    const deadlineTimer = setTimeout(
      () => deadlineController.abort(new DOMException("deadline", "TimeoutError")),
      this.config.deadlineMs,
    );
    try {
      const requestSignal = signal
        ? AbortSignal.any([signal, deadlineController.signal])
        : deadlineController.signal;
      const value = await this.execute(command, requestSignal);
      this.failures = 0;
      return { status: 200, body: { ...value, command, live: true, version: "v1" } };
    } catch (error) {
      this.failures++;
      if (this.failures >= this.config.circuitFailures) {
        this.openUntil = Date.now() + this.config.circuitResetMs;
      }
      return fallback(command, error?.name === "TimeoutError" ? "deadline" : "unavailable");
    } finally {
      clearTimeout(deadlineTimer);
    }
  }

  allow(clientIP) {
    const now = Date.now();
    const current = this.buckets.get(clientIP) ?? { tokens: this.config.rateBurst, at: now };
    const replenished = Math.min(
      this.config.rateBurst,
      current.tokens + ((now - current.at) / 1000) * this.config.ratePerSecond,
    );
    if (replenished < 1) {
      this.buckets.set(clientIP, { tokens: replenished, at: now });
      return false;
    }
    this.buckets.set(clientIP, { tokens: replenished - 1, at: now });
    return true;
  }

  async execute(command, signal) {
    const base = this.config.kyberURL.replace(/\/$/, "");
    const agent = encodeURIComponent(this.config.agentName);
    const submitted = await this.call(`${base}/api/v1/agents/${agent}/requests`, {
      method: "POST",
      body: JSON.stringify({ prompt: commands[command], correlation: `kiosk-v1:${command}` }),
      signal,
    });
    if (submitted.status !== 202 || typeof submitted.body?.id !== "string") throw new Error("submit failed");

    while (true) {
      await delay(this.config.pollMs, signal);
      const polled = await this.call(`${base}/api/v1/agents/${agent}/requests/${encodeURIComponent(submitted.body.id)}`, { signal });
      if (polled.status !== 200) throw new Error("poll failed");
      if (polled.body.status === "completed") {
        const response = String(polled.body.response ?? "").slice(0, this.config.maxResponseChars);
        return { response, requestId: submitted.body.id, harness: this.config.harness };
      }
      if (polled.body.status === "failed" || polled.body.status === "expired") throw new Error(polled.body.status);
    }
  }

  async call(url, init) {
    const response = await this.fetch(url, {
      ...init,
      headers: { authorization: `Bearer ${this.config.apiKey}`, "content-type": "application/json" },
    });
    let body;
    try { body = await response.json(); } catch { body = null; }
    return { status: response.status, body };
  }
}

function result(status, error) { return { status, body: { error, version: "v1" } }; }
function fallback(command, reason) {
  return { status: 200, body: { command, response: fallbacks[command], live: false, reason, version: "v1" } };
}
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
  });
}
export function loadConfig(env = process.env) {
  const required = ["KYBER_URL", "KYBER_AGENT_NAME", "KYBER_API_KEY"];
  for (const name of required) if (!env[name]) throw new Error(`${name} is required`);
  return {
    kyberURL: env.KYBER_URL,
    agentName: env.KYBER_AGENT_NAME,
    apiKey: env.KYBER_API_KEY,
    harness: env.KYBER_KIOSK_HARNESS === "claude-code" ? "Claude Code" : "Codex",
    allowedOrigins: new Set((env.ALLOWED_ORIGINS ?? "").split(",").map((v) => v.trim()).filter(Boolean)),
    allowedPreviewHostPrefix: env.ALLOWED_PREVIEW_HOST_PREFIX?.trim() ?? "",
    allowedPreviewHostSuffixes: (env.ALLOWED_PREVIEW_HOST_SUFFIXES ?? "")
      .split("|").map((value) => value.trim()).filter(Boolean),
    deadlineMs: positive(env.REQUEST_DEADLINE_MS, 15000),
    pollMs: positive(env.POLL_INTERVAL_MS, 250),
    maxQueueDepth: positive(env.MAX_QUEUE_DEPTH, 4),
    maxResponseChars: positive(env.MAX_RESPONSE_CHARS, 8000),
    rateBurst: positive(env.RATE_BURST, 5),
    ratePerSecond: positive(env.RATE_PER_SECOND, 0.2),
    circuitFailures: positive(env.CIRCUIT_FAILURES, 3),
    circuitResetMs: positive(env.CIRCUIT_RESET_MS, 30000),
  };
}
function positive(value, fallbackValue) {
  const parsed = Number(value ?? fallbackValue);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error("gateway limits must be positive");
  return parsed;
}
