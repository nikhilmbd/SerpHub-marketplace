import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "serphub_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters.");
  return secret;
}

export function passwordMatches(candidate: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) throw new Error("ADMIN_PASSWORD is not configured.");
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(configured).digest();
  return timingSafeEqual(a, b);
}

export function createAdminSession() {
  const payload = Buffer.from(String(Date.now() + SESSION_SECONDS * 1000)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return { value: `${payload}.${signature}`, maxAge: SESSION_SECONDS };
}

export function isAdminSession(value?: string) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  try {
    const expected = createHmac("sha256", sessionSecret()).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;
    const expiresAt = Number(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isFinite(expiresAt) && expiresAt > Date.now();
  } catch { return false; }
}
