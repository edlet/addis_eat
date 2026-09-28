"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInDemo(formData) {
  if (process.env.NODE_ENV === "production") redirect("/sign-in?demo=unavailable");

  const name = String(formData.get("name") || "").trim().slice(0, 60);
  if (!name) redirect("/sign-in?error=missing-name");

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
  cookieStore.set("addis-eats-user", randomUUID(), options);
  cookieStore.set("addis-eats-name", name, options);
  redirect("/");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("addis-eats-session");
  cookieStore.delete("addis-eats-user");
  cookieStore.delete("addis-eats-name");
  redirect("/");
}
