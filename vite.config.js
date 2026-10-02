import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'
import androidDownload from './api/android-download.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  for (const key of ["ANDROID_APK_URL", "ANDROID_APP_VERSION"]) {
    if (!process.env[key] && environment[key]) process.env[key] = environment[key];
  }
  return {
    plugins: [react(), {
      name: "local-android-download",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split("?")[0] === "/api/android-download") return androidDownload(request, response);
          return next();
        });
      },
    }],
  };
})
