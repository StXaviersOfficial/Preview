// Admin access code — read from environment variable
// In production, set ADMIN_CODE env var in Vercel
const ADMIN_CODE = process.env.ADMIN_CODE || "xavier@123";

export function verifyAdminCode(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const a = Buffer.from(input);
  const b = Buffer.from(ADMIN_CODE);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

import * as crypto from "crypto";
