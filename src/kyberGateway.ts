export type KioskCommand = "about" | "joke" | "features" | "architecture" | "cluster-status";

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
  if (!response.ok) throw new Error(`kiosk gateway returned ${response.status}`);
  return response.json() as Promise<KioskResult>;
}
