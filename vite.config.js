import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      "https://karachi-clothes.vercel.app"
    ),
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "https://axokmxgyxzqvqgyvcvth.supabase.co"
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      "sb_publishable_7PCFwrI5yPryWrlLPSuwbQ_3TQhenlA"
    ),
  },
});
