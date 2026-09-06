import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      input: { main: "index.html", runframe: "runframe.html" },
    },
  },
  test: {
    environment: "jsdom",
  },
})
