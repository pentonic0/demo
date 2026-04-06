import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SessionPayload } from "./auth-shared";

export const SESSION_COOKIE_NAME = "school_admin_session";
export type { SessionPayload };

// Secret for signing JWTs
const secretKey = process.env.JWT_SECRET;
if (!secretKey && process.env.NODE_ENV === "production") {
  throw new Error("SEC-001: Missing JWT_SECRET in production environment. Refusing to start for security.");
}
const key = new TextEncoder().encode(secretKey || "fallback_super_secret_for_development_only");

// Generate hashed password
export async function hashPassword(password: string) {
  // Stronger salt generation
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Encrypt payload to JWT
export async function encrypt(payload: Omit<SessionPayload, "expires">) {
  // Shorter expiry for better security (24 hours instead of 7 days)
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  return await new SignJWT({ ...payload, expires })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

// Decrypt JWT to payload
export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Check session in middleware or server components
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}
