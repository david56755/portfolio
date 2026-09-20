import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import policy from "./security/policy.json" with { type: "json" };

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "production-security-policy",
      apply: "build",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: {
              "http-equiv": "Content-Security-Policy",
              content: policy.csp,
            },
            injectTo: "head-prepend",
          },
          {
            tag: "meta",
            attrs: { name: "referrer", content: policy.referrer },
            injectTo: "head-prepend",
          },
        ];
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: { "/api": "http://127.0.0.1:8000" },
  },
});
