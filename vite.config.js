import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Ensure Bootstrap is pre-bundled and available
  optimizeDeps: {
    include: ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap/dist/js/bootstrap.bundle.min.js'],
  },

  css: {
    preprocessorOptions: {
      // You can add global SCSS imports if you customize Bootstrap later
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.js",
    include: ["tests/**/*.test.{js,jsx,ts,tsx}"],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    coverage: {
      provider: "v8", // or "istanbul"
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
    },
    // reporters for terminal + GitHub integration
    reporters: [
      'default',           // nice terminal output
      ['junit', { outputFile: './test-results/junit-results.xml' }], // for dorny/test-reporter
    ],

    // Increase timeouts if needed
    testTimeout: 10000,
  },
});