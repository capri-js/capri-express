import express from "express";
import serveStatic from "serve-static";
import { loadSSRModule, RenderContext } from "capri";

const resolve = (p: string) => new URL(p, import.meta.url).pathname;

async function createApp() {
  const app = express();
  app.use(
    serveStatic(resolve("../dist"), {
      index: false,
    })
  );

  const ssr = await loadSSRModule(resolve("./ssr.js"));
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const context: RenderContext = {
        status: (code) => res.status(code),
        getHeader: (name) => req.get(name),
        setHeader: (name, value) => res.setHeader(name, value),
      };
      const html = await ssr(url, context);
      if (res.statusCode === 200) {
        res.send(html);
      }
      res.end();
    } catch (e: any) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });
  return app;
}

createApp().then((app) =>
  app.listen(8000, () => {
    console.log("http://localhost:8000");
  })
);
