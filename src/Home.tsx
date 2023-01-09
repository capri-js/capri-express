import { Link } from "react-router-dom";
import { styled } from "classname-variants/react";

import CounterIsland from "./Counter.island.jsx";

export function Home() {
  return (
    <main className="flex flex-col gap-3 max-w-prose mx-auto my-10">
      <h1 className="font-bold text-lg">
        Partial hydration with React and <i>Capri</i>
      </h1>
      <section>This page is static, but contains some dynamic parts.</section>
      <section className="flex gap-2">
        Here is a simple counter: <CounterIsland />
      </section>
      <A to="/about">Link to another page</A>
    </main>
  );
}

const A = styled(Link, "underline hover:text-green-600");
