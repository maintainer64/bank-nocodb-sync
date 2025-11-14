import { defineConfig } from "vite";
import progress from "vite-plugin-progress";
import solidPlugin from "vite-plugin-solid";
import { fileURLToPath } from "node:url";
// @ts-ignore
import pkg from './package.json';

export default defineConfig({
  plugins: [
    solidPlugin(),
    progress(),
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: "build",
  },
});
