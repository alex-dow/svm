import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/srcold/**", "**/e2e/**"],
    coverage: {
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      reporter: ['json', 'json-summary', 'html'],
      reportsDirectory: 'coverage'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
