export const SHARE_WORKER_URL =
  process.env.NEXT_PUBLIC_RESUME_SHARE_WORKER_URL ||
  "https://resume-share.lovekashyapkatoch.workers.dev";

export interface SharePayload {
  resume: unknown;
  settings: unknown;
}

export async function saveShare(
  payload: SharePayload
): Promise<{ id: string }> {
  const res = await fetch(`${SHARE_WORKER_URL}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
