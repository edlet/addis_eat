import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

function verifySignedSession(token, secret) {
  const [payload, signature, ...extra] = String(token).split(".");
  if (!payload || !signature || extra.length) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const provided = Buffer.from(signature, "base64url");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof session.userId !== "string" || !session.userId) return null;
    if (!Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) return null;
    return { userId: session.userId, name: typeof session.name === "string" ? session.name : null };
  } catch {
    return null;
  }
}

// Production guest sessions and identity-provider sessions both use the signed, HttpOnly session cookie.
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("addis-eats-session")?.value;
  const secret = process.env.SESSION_SECRET;
  if (token && secret) return verifySignedSession(token, secret);
  if (process.env.NODE_ENV !== "production") {
    const userId = cookieStore.get("addis-eats-user")?.value;
    if (!userId) return null;
    return { userId, name: cookieStore.get("addis-eats-name")?.value || "Demo customer" };
  }
  return null;
}
