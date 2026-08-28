# Kyber kiosk gateway

Server-side boundary between untrusted showcase browsers and Kyber's scoped
request/reply API. Browsers submit only `joke`, `features`, `architecture`, or
`cluster-status`; this service maps each enum to a fixed versioned prompt.

Required environment: `KYBER_URL`, `KYBER_AGENT_NAME`, `KYBER_API_KEY`, and a
comma-separated `ALLOWED_ORIGINS`. The API key must have only `requests:read`
and `requests:write`. Deploy the container with the key in a secret manager;
never expose it through a Vite variable or Firebase Hosting config.

The gateway applies per-IP rate limits, global concurrency, request deadlines,
a circuit breaker, bounded output, and curated fallbacks. Run `npm test` and
`npm run load-test` in this directory before deployment.
