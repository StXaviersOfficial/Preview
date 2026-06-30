import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Lightweight cookie-based admin session.
 *
 * On successful login we set a signed HMAC cookie. The cookie value is
 * `<expiresAt>.<hmac>` where hmac = HMAC-SHA256(secret, expiresAt).
 *
 * The "secret" is derived from the admin code itself — good enough for a
 * single-tenant admin tool. Future: replace with Cloudflare Access / a JWT
 * library if multi-admin is needed.
 */

const COOKIE_NAME = "sx_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  // In production, FAIL CLOSED — don't use a hardcoded fallback
  // that an attacker could read from the source code.
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production (min 32 chars)");
  }
  // Dev-only fallback with warning
  console.warn("[SECURITY] ADMIN_SESSION_SECRET not set — using insecure dev fallback");
  return "dev-only-insecure-secret-do-not-use-in-production";
}

function hmac(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${expiresAt}.${hmac(String(expiresAt))}`;
  const store = await cookies();
  store.set(COOKIE_NAME, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function isAdmin(): Promise<boolean> {
  try {
    const store = await cookies();
    const cookie = store.get(COOKIE_NAME)?.value;
    if (!cookie) return false;
    const [expiresAtStr, sig] = cookie.split(".");
    if (!expiresAtStr || !sig) return false;
    const expiresAt = Number(expiresAtStr);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
    const expected = hmac(expiresAtStr);
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
