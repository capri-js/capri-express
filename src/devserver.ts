import express from "express";
import { createServer } from "vite";
import { renderPreview } from "capri";

export async function createApp() {
  const app = express();

  const server = await createServer({
    root: process.cwd(),
    logLevel: "info",
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });

  app.use(server.middlewares);
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const html = await renderPreview(server, url, {
        status: (code) => res.status(code),
        getHeader: (name) => req.get(name),
        setHeader: (name, value) => res.setHeader(name, value),
      });
      if (res.statusCode === 200) {
        res.send(html);
      }
      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  });

  server.watcher.on("change", async (file) => {
    const indexModule = await server.moduleGraph.getModuleByUrl("/index.html");
    if (indexModule) server.reloadModule(indexModule);
  });

  return app;
}

createApp().then((app) =>
  app.listen(8001, () => {
    console.log("http://localhost:8001");
  })
);
