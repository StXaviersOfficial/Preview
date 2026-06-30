/**
 * ⚠️ INTERNAL — DO NOT IMPORT FROM CLIENT CODE
 *
 * Server-only module that exposes the admin access code.
 *
 * SECURITY:
 *   The admin code is read from the ADMIN_CODE environment variable.
 *   Set this in Vercel: vercel env add ADMIN_CODE production
 *   If not set, falls back to a dev-only code that logs a warning.
 */

import "server-only";

const DEV_FALLBACK_CODE = "xavier@123";

export async function getAdminCode(): Promise<string> {
  const envCode = process.env.ADMIN_CODE;
  if (envCode && envCode.length >= 6) {
    return envCode;
  }
  // Dev fallback — log warning so it's never silently used in production
  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY] ADMIN_CODE env var not set! Using insecure dev fallback.");
  }
  return DEV_FALLBACK_CODE;
}

export async function verifyAdminCode(code: string): Promise<boolean> {
  const expected = await getAdminCode();
  // Constant-time comparison to prevent timing attacks
  // Always compare full length even if input differs
  const a = Buffer.from(code);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

import crypto from "crypto";
