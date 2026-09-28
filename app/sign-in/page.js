import Link from "next/link";
import { signInDemo } from "../actions/auth";
import { getSession } from "../lib/session";

export const metadata = { title: "Sign in | Addis Eats" };

export default async function SignInPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const authNotConfigured = params?.auth === "not-configured";
  const missingName = params?.error === "missing-name";

  return (
    <main className="account-page">
      <section className="account-card" aria-labelledby="sign-in-title">
        <p className="section-kicker">Welcome to Addis Eats</p>
        <h1 id="sign-in-title">{session ? `You’re signed in, ${session.name || "there"}.` : "Sign in"}</h1>
        {session ? (
          <>
            <p>Your {process.env.NODE_ENV === "production" ? "guest" : "demo"} session is active. You can place orders and view this session’s order history.</p>
            <Link href="/menu" className="primary-button">Browse the menu</Link>
          </>
        ) : (
          <>
            <p>{process.env.NODE_ENV === "production" ? "Continue as a guest to place orders on this device. This does not create a recoverable customer account." : "Start a local demo session to try checkout and order history. This demo does not create or verify a real account."}</p>
            {authNotConfigured && <p className="account-error" role="alert">Guest sign-in needs SESSION_SECRET configured on the deployment.</p>}
            {missingName && <p className="account-error" role="alert">Enter your name to continue.</p>}
            <form className="account-form" action={signInDemo}>
              <label htmlFor="sign-in-name">{process.env.NODE_ENV === "production" ? "Name for this order" : "Your name"}</label>
              <input id="sign-in-name" name="name" autoComplete="name" maxLength={60} required />
              <button type="submit" className="primary-button">Continue as guest</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
