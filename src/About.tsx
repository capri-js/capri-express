import { Link } from "react-router-dom";

export function About() {
  return (
    <main className="flex flex-col gap-3 max-w-prose mx-auto my-10">
      <h1 className="font-bold text-lg">This page is completely static.</h1>
      <section>
        An since it does not contain any interactive islands, no JavaScript is
        shipped to the browser.
      </section>
      <Link to="/">Home</Link>
    </main>
  );
}
