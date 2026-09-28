import Link from "next/link";
import { signInDemo } from "../actions/auth";
import { getSession } from "../lib/session";

export const metadata = { title: "Sign in | Addis Eats" };

export default async function SignInPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const demoUnavailable = params?.demo === "unavailable";
  const missingName = params?.error === "missing-name";

  return (
    <main className="account-page">
      <section className="account-card" aria-labelledby="sign-in-title">
        <p className="section-kicker">Welcome to Addis Eats</p>
        <h1 id="sign-in-title">{session ? `You’re signed in, ${session.name || "there"}.` : "Sign in"}</h1>
        {session ? (
          <>
            <p>Your demo session is active. You can place orders and view this session’s order history.</p>
            <Link href="/menu" className="primary-button">Browse the menu</Link>
          </>
        ) : process.env.NODE_ENV === "production" ? (
          <p className="account-notice">Sign in is not configured for this deployment yet. Connect an identity provider to enable customer accounts.</p>
        ) : (
          <>
            <p>Start a local demo session to try checkout and order history. This demo does not create or verify a real account.</p>
            {demoUnavailable && <p className="account-error" role="alert">Demo sign-in is only available in local development.</p>}
            {missingName && <p className="account-error" role="alert">Enter your name to continue.</p>}
            <form className="account-form" action={signInDemo}>
              <label htmlFor="sign-in-name">Your name</label>
              <input id="sign-in-name" name="name" autoComplete="name" maxLength={60} required />
              <button type="submit" className="primary-button">Continue as guest</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
