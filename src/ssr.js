import * as jsxRuntime from "react/jsx-runtime";
import "fs";
import "path";
import "cheerio";
import { createContext, createElement, useContext, useState, StrictMode } from "react";
import render$2 from "react-render-to-string";
import { StaticRouter } from "react-router-dom/server.js";
import { Link, Routes, Route } from "react-router-dom";
import { styled } from "classname-variants/react";
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
class StaticRenderContext {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
  }
  status(code) {
    this.statusCode = code;
  }
  getHeader(name) {
    return this.headers[name];
  }
  setHeader(name, value) {
    this.headers[name] = value;
  }
}
class Template {
  constructor(html) {
    this.html = html;
  }
  getIslands() {
    return [
      ...this.html.matchAll(/<script[^>]+data-island="(.+?)"[^>]*>([\s\S]+?)<\/script>/gi)
    ].map(([, island, json]) => ({ island, json }));
  }
  removeScripts(test) {
    this.html = this.html.replace(/<\s*script(.*?)>([\s\S]*?)<\s*\/\s*script\s*>\s*/gi, (match, attrs, text) => {
      if (test.src) {
        const [, src] = /\bsrc\s*=\s*"(.+?)"/.exec(attrs) ?? [];
        if (src && src.match(test.src))
          return "";
      }
      if (test.text && text.match(test.text)) {
        return "";
      }
      return match;
    });
  }
  insertMarkup(markup) {
    for (const [selector, insert] of Object.entries(markup)) {
      if (insert) {
        if (!selector.match(/^#?[\w]+$/)) {
          throw new Error(`Unsupported selector: ${selector}`);
        }
        if (selector.startsWith("#")) {
          this.html = this.html.replace(new RegExp(`\\bid\\s*=\\s*"${selector.slice(1)}"[^>]*>`), `$&${insert}`);
        } else {
          this.html = this.html.replace(new RegExp(`<\\s*/\\s*${selector}[^>]*>`), `${insert}$&`);
        }
      }
    }
  }
  toString() {
    return this.html;
  }
}
async function renderHtml(renderFn2, url, indexHtml, css2, context = new StaticRenderContext()) {
  const result = await renderFn2(url, context);
  if (!result)
    return;
  const template2 = new Template(indexHtml);
  template2.insertMarkup(await resolveMarkup(result));
  const head = css2.map((href) => `<link rel="stylesheet" href="${href}">`).join("");
  template2.insertMarkup({ head });
  const islands = template2.getIslands();
  if (!islands.length) {
    console.log("No islands found, removing hydration code");
    template2.removeScripts({
      src: /index-|-legacy|modulepreload-polyfill/,
      text: /__vite_is_modern_browser|"noModule"|_\$HY/
    });
  }
  return template2.toString();
}
async function resolveMarkup(markup) {
  const resolved = {};
  for (const [key, value] of Object.entries(markup)) {
    resolved[key] = await value;
  }
  return resolved;
}
const renderContext = createContext(new StaticRenderContext());
function renderToString(children, context) {
  const node = context ? createElement(renderContext.Provider, { value: context, children }) : children;
  return render$2(node);
}
const useRenderContext = () => useContext(renderContext);
const useStatus = (code) => {
  const ctx = useRenderContext();
  {
    ctx.status(code);
  }
};
const App$1 = "";
function About() {
  return /* @__PURE__ */ jsxs("main", { className: "flex flex-col gap-3 max-w-prose mx-auto my-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-bold text-lg", children: "This page is completely static." }),
    /* @__PURE__ */ jsx("section", { children: "An since it does not contain any interactive islands, no JavaScript is shipped to the browser." }),
    /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" })
  ] });
}
function Counter({ start = 0 }) {
  const [counter, setCounter] = useState(start);
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
    /* @__PURE__ */ jsx(Button, { className: "bg-green-600", onClick: () => setCounter((c) => c - 1), children: "-" }),
    /* @__PURE__ */ jsx("span", { children: counter }),
    /* @__PURE__ */ jsx(Button, { onClick: () => setCounter((c) => c + 1), children: "+" })
  ] });
}
const Button = styled("button", "rounded bg-green-600 text-white px-2");
const componentModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Counter
}, Symbol.toStringTag, { value: "Module" }));
const { default: Component, options } = componentModule;
function Island({ children, ...props }) {
  const wrappedChildren = children && /* @__PURE__ */ jsx("capri-children", { style: { display: "contents" }, children });
  const scriptContent = JSON.stringify({ props, options });
  return /* @__PURE__ */ jsxs("capri-island", { style: { display: "contents" }, children: [
    /* @__PURE__ */ jsx(Component, { ...props, children: wrappedChildren }),
    /* @__PURE__ */ jsx("script", { type: "application/json", "data-island": "/src/Counter.island.tsx", dangerouslySetInnerHTML: { __html: scriptContent } })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxs("main", { className: "flex flex-col gap-3 max-w-prose mx-auto my-10", children: [
    /* @__PURE__ */ jsxs("h1", { className: "font-bold text-lg", children: [
      "Partial hydration with React and ",
      /* @__PURE__ */ jsx("i", { children: "Capri" })
    ] }),
    /* @__PURE__ */ jsx("section", { children: "This page is static, but contains some dynamic parts." }),
    /* @__PURE__ */ jsxs("section", { className: "flex gap-2", children: [
      "Here is a simple counter: ",
      /* @__PURE__ */ jsx(Island, {})
    ] }),
    /* @__PURE__ */ jsx(A, { to: "/about", children: "Link to another page" })
  ] });
}
const A = styled(Link, "underline hover:text-green-600");
function NotFound() {
  useStatus(404);
  return /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("h1", { children: "404 - Not found." }) });
}
function App() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Home, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
  ] });
}
const render$1 = async (url, context) => {
  try {
    const root = /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, basename: "/", children: /* @__PURE__ */ jsx(App, {}) }) });
    return {
      "#app": await renderToString(root, context)
    };
  } catch (err) {
    console.log(err.message);
  }
};
const renderModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  render: render$1
}, Symbol.toStringTag, { value: "Module" }));
const render = renderModule;
const renderFn = render.render ?? render.default;
const template = '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <link rel="icon" type="image/svg+xml" href="/assets/capri-ce1c56b3.svg" />\n    <script type="module" crossorigin src="/assets/index-11aaa67d.js"><\/script>\n  </head>\n  <body>\n    <div id="app"></div>\n    \n  </body>\n</html>\n';
const css = ["/assets/ssr-57b963b7.css"];
async function ssr(url, context) {
  return renderHtml(renderFn, url, template, css, context);
}
export {
  ssr as default
};
