import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export interface SessionPayload {
  userId: number;
  email: string;
  name: string | null;
  /** Set to true when the user must change their password before accessing the dashboard. */
  mustChangePassword?: boolean;
}

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "fallback-secret-change-me"
  );
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function requireSession(session: SessionPayload | null): SessionPayload {
  if (!session) throw new Error("Unauthorized");
  return session;
}
