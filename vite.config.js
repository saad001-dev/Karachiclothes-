// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // ✅ SPA fallback plugin - YEH SAB SE IMPORTANT HAI!
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // Agar file request hai (css, js, images) toh skip karein
            if (req.url.includes('.') && !req.url.includes('html')) {
              return next();
            }
            // Warna index.html serve karein
            req.url = '/index.html';
            next();
          });
        };
      },
    },
  ],
  server: {
    port: 3000,
    open: false,
  },
});