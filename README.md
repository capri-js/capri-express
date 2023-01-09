# 🍋 Capri SSR + Express

This is an example of how to use Capri SSR with Express.

You can either run `npm start` to start an express server in production mode or
`npm run dev` in order to start a development server with live reload.

## Generating the SSR bundle

In order to enable SSR, you have to specify a `target` in the Capri options of
your `vite.config.ts` file:

```js
export default {
  plugins: [
    react(),
    capri({
      prerender: false,
      target: "src/ssr.js",
    }),
  ],
};
```

This will create the file `src/ssr.js` upon build, which can then be used to
render pages on demand.

> **Note:**
> We also set `prerender` to `false` to disable the generation of static pages
> during the build.

## Importing the SSR bundle

During runtime, you can now import the generated bundle:

```ts
import { loadSSRModule } from "capri";

// We need to pass an absolute path
const resolve = (p: string) => new URL(p, import.meta.url).pathname;

async function createApp() {
  const ssr = await loadSSRModule(resolve("./ssr.js"));

  // We can now use ssr() to render pages
}
```

## Rendering pages

Finally, we call the `ssr()` function with the requested URL. We can pass an optional `RenderContext`, to support setting HTTP headers and the status code from inside our app.

```ts
app.use("*", async (req, res) => {
  // Implement the RenderContext interface and map the calls to
  // their Express counterparts:
  const context: RenderContext = {
    status: (code) => res.status(code),
    getHeader: (name) => req.get(name),
    setHeader: (name, value) => res.setHeader(name, value),
  };

  const html = await ssr(req.originalUrl, context);

  if (res.statusCode === 200) {
    res.send(html);
  }
  res.end();
});
```

For a complete example, check out [`src/server.ts`](`src/server.ts`).

## Development server

We can also set up a development server to enable live reloading. Rather than generating a SSR bundle, we use Capri's `renderPreview` function and pass in a `ViteDevServer` instance:

```ts
app.use("*", async (req, res) => {
  const context = {
    /* same as above */
  };
  const html = await renderPreview(server, req.originalUrl, context);
  if (res.statusCode === 200) {
    res.send(html);
  }
  res.end();
});
```

For a complete example, check out [`src/devserver.ts`](`src/devserver.ts`).
