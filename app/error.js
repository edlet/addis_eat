"use client";

export default function GlobalError({ reset }) {
  return <main className="state-screen" role="alert"><h1>Something went wrong.</h1><p>We could not load Addis Eats.</p><button type="button" onClick={reset}>Try again</button></main>;
}
