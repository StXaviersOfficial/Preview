/**
 * INTERNAL — DO NOT IMPORT FROM CLIENT CODE
 *
 * Server-only module that exposes the admin access code.
 *
 * SECURITY:
 *   The admin code is read from the ADMIN_CODE environment variable.
 *   Set this in Vercel: vercel env add ADMIN_CODE production
 *   In production, FAILS CLOSED if ADMIN_CODE is not set (no fallback).
 *   In development, falls back to a dev-only code with a warning.
 */

import "server-only";
import crypto from "crypto";

const DEV_FALLBACK_CODE = "xavier@123";

export async function getAdminCode(): Promise<string> {
  const envCode = process.env.ADMIN_CODE;
  if (envCode && envCode.length >= 6) {
    return envCode;
  }
  // Production: fail closed — never use dev fallback in prod
  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY] ADMIN_CODE env var not set in production! Refusing to authenticate.");
    throw new Error("Admin authentication not configured.");
  }
  // Dev-only fallback with warning
  console.warn("[SECURITY] ADMIN_CODE env var not set — using insecure dev fallback. Set ADMIN_CODE in .env for production.");
  return DEV_FALLBACK_CODE;
}

export async function verifyAdminCode(code: string): Promise<boolean> {
  let expected: string;
  try {
    expected = await getAdminCode();
  } catch {
    // ADMIN_CODE not configured in production — refuse all logins
    return false;
  }
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(code);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
