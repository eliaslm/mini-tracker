import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  // 'process.cwd()' ensures that the .env files are loaded from the root of your project
  const env = loadEnv(mode, process.cwd(), ''); // The third argument '' loads all env vars

  return {
    plugins: [react()],
    // Use the environment variable for the base URL
    // Provide a fallback value (e.g., '/') in case the env var is not set
    base: env.VITE_APP_BASE_URL || '/mini-tracker/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
})
