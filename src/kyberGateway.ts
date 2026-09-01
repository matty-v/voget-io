export type KioskCommand = "about" | "features" | "architecture" | "gettingStarted" | "contact" | "joke";

export interface KioskResult {
  command: KioskCommand;
  response: string;
  live: boolean;
  harness?: "Codex" | "Claude Code";
  reason?: string;
}

export async function runKioskCommand(command: KioskCommand, signal?: AbortSignal): Promise<KioskResult> {
  const base = (import.meta.env.VITE_KYBER_GATEWAY_URL || "/api/kyber-kiosk").replace(/\/$/, "");
  const response = await fetch(`${base}/v1/requests`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ command }),
    signal,
  });
  if (!response.ok) {
    // PR previews call the currently deployed gateway, which can briefly lag a
    // newly added frontend command. Preserve the fixed, public-safe response
    // during that rolling-deploy window; the live gateway still invokes Glyph.
    if (command === "gettingStarted" && (response.status === 400 || response.status === 404)) {
      return {
        command,
        response: "Ready to put Kyber to work? [Visit Kyber](https://kyber.voget.io), then launch it with the published Helm chart:\n\n```bash\n# Install from the published Helm chart. Nothing to pin, no fork.\nhelm install kyber oci://ghcr.io/matty-v/charts/kyber \\\n  --namespace kyber-system --wait\n# 15 minutes from an empty cluster to a live fleet console\n```",
        live: false,
        reason: "gateway_version_mismatch",
      };
    }
    throw new Error(`kiosk gateway returned ${response.status}`);
  }
  return response.json() as Promise<KioskResult>;
}
