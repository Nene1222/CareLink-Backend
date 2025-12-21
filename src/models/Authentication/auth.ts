// lib/auth.ts
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

// Convert secret string to Uint8Array for jose
const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  // If you need permissions in JWT, keep them as simple strings only
  // NOT as complex objects
  permissions?: string[]; // Only simple string array, NOT complex objects
}

/**
 * Verify JWT token (Edge-safe)
 */
export async function verifyAuth(token: string): Promise<UserPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as UserPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Generate JWT token (Edge-safe)
 */
export async function generateToken(payload: UserPayload): Promise<string> {
  // Create a clean payload with only serializable data
  const cleanPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    // Only include permissions if it's a simple string array
    permissions: Array.isArray(payload.permissions) 
      ? payload.permissions 
      : undefined
  };

  const token = await new SignJWT(cleanPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}