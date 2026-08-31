# Glyph — Kyber kiosk gateway

Server-side boundary between untrusted showcase browsers and Kyber's scoped
request/reply API. Browsers submit only `joke`, `features`, `architecture`, or
`cluster-status`; this service maps each enum to a fixed versioned prompt.

Required environment: `KYBER_URL`, `KYBER_AGENT_NAME`, `KYBER_API_KEY`, and a
comma-separated `ALLOWED_ORIGINS`. Firebase preview channels can be enabled
with `ALLOWED_PREVIEW_HOST_PREFIX` and pipe-separated
`ALLOWED_PREVIEW_HOST_SUFFIXES`; only HTTPS origins matching both are accepted.
The API key must have only `requests:read` and `requests:write`. Deploy the
container with the key in a secret manager; never expose it through a Vite
variable or Firebase Hosting config.

The gateway applies per-IP rate limits, global concurrency, request deadlines,
a circuit breaker, bounded output, and curated fallbacks. Run `npm test` and
`npm run load-test` in this directory before deployment.

## Production deployment

The main-branch workflow deploys this directory to the
`voget-io-kyber-gateway` Cloud Run service in `us-central1`, then deploys
Firebase Hosting. Hosting forwards `/api/kyber-kiosk/**` to that service before
the SPA fallback rewrite. PR preview builds use the public production gateway
URL, which accepts only this project's generated Firebase preview origins.
Preview jobs never receive the Kyber API key or Cloud Run deployment access.

One secret must exist in project `kinetic-object-322814`:
`KYBER_KIOSK_API_KEY`, containing a Falcon API key scoped only to Glyph with
`requests:read` and `requests:write`. The service account stored in the
`FIREBASE_SERVICE_ACCOUNT` GitHub secret needs Cloud Run Admin, Cloud Build
Editor, Service Account User, Artifact Registry Writer, and Secret Manager
Viewer permissions. The dedicated
`voget-kiosk-gateway@kinetic-object-322814.iam.gserviceaccount.com` runtime
identity needs Secret Manager Secret Accessor on that one secret. Cloud Run,
Cloud Build, Artifact Registry, and Secret Manager APIs must be enabled.
