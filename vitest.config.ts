/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  test: {
    globals: true,
  },
});
