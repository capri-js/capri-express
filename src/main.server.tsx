import { RenderFunction, renderToString } from "@capri-js/react/server";
import { StrictMode } from "react";
import { StaticRouter } from "react-router-dom/server.js";

import { App } from "./App";

export const render: RenderFunction = async (url, context) => {
  try {
    const root = (
      <StrictMode>
        <StaticRouter location={url} basename={import.meta.env.BASE_URL}>
          <App />
        </StaticRouter>
      </StrictMode>
    );
    return {
      "#app": await renderToString(root, context),
    };
  } catch (err: any) {
    console.log(err.message);
  }
};
