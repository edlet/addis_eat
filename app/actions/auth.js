"use server";

import { createHmac, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInDemo(formData) {
  const name = String(formData.get("name") || "").trim().slice(0, 60);
  if (!name) redirect("/sign-in?error=missing-name");

  const isProduction = process.env.NODE_ENV === "production";
  const secret = process.env.SESSION_SECRET;
  if (isProduction && !secret) redirect("/sign-in?auth=not-configured");

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
  const userId = randomUUID();

  if (isProduction) {
    const payload = Buffer.from(JSON.stringify({ userId, name, expiresAt: Date.now() + options.maxAge * 1000 })).toString("base64url");
    const signature = createHmac("sha256", secret).update(payload).digest("base64url");
    cookieStore.set("addis-eats-session", `${payload}.${signature}`, options);
  } else {
    cookieStore.set("addis-eats-user", userId, options);
    cookieStore.set("addis-eats-name", name, options);
  }
  redirect("/");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("addis-eats-session");
  cookieStore.delete("addis-eats-user");
  cookieStore.delete("addis-eats-name");
  redirect("/");
}
