import capri from "@capri-js/react";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    react(),
    capri({
      prerender: false,
      target: "src/ssr.js",
    }),
  ],
});
