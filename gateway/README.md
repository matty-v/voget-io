# Glyph — Kyber kiosk gateway

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

## Production deployment

The main-branch workflow deploys this directory to the
`voget-io-kyber-gateway` Cloud Run service in `us-central1`, then deploys
Firebase Hosting. Hosting forwards `/api/kyber-kiosk/**` to that service before
the SPA fallback rewrite. PR preview channels intentionally use
`firebase.preview.json` and do not connect to the production gateway.

One secret must exist in project `kinetic-object-322814`:
`KYBER_KIOSK_API_KEY`, containing a Falcon API key scoped only to Glyph with
`requests:read` and `requests:write`. The service account stored in the
`FIREBASE_SERVICE_ACCOUNT` GitHub secret needs Cloud Run Admin, Cloud Build
Editor, Service Account User, Artifact Registry Writer, and Secret Manager
Secret Accessor permissions. Cloud Run, Cloud Build, Artifact Registry, and
Secret Manager APIs must be enabled.
