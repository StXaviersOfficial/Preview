/**
 * ⚠️ INTERNAL — DO NOT IMPORT FROM CLIENT CODE
 *
 * Server-only module that exposes the admin access code.
 *
 * SECURITY NOTE (for future migration to Cloudflare):
 *   The admin code is currently hardcoded here as a placeholder.
 *   Replace this with a Cloudflare Worker / KV / Secret call before going to production.
 *   The function signature is intentionally async so the future Cloudflare call
 *   (which will be network-based) can be a drop-in replacement.
 *
 * The code itself: xavier@123
 */

import "server-only";

// The admin code. Change ONLY here. Future: replace with Cloudflare Secret read.
const ADMIN_CODE = "xavier@123";

export async function getAdminCode(): Promise<string> {
  // Future implementation will look something like:
  //   const res = await fetch("https://admin-auth.workers.dev/code", { headers: { "X-Admin-Token": process.env.CF_WORKER_TOKEN! }});
  //   return await res.text();
  return ADMIN_CODE;
}

export async function verifyAdminCode(code: string): Promise<boolean> {
  const expected = await getAdminCode();
  // Constant-time-ish compare to make timing attacks harder
  if (code.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= code.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
