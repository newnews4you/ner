import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages
  // Jei repository vardas NĖRA "username.github.io", nustatykite base path:
  // Pavyzdys: jei repository vardas "korepetitorius-v1", naudokite: base: '/korepetitorius-v1/'
  // Jei repository yra "username.github.io", palikite komentuotą arba naudokite: base: '/'
  // base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
