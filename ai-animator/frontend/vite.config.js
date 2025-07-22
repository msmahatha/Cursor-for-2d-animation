import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the build target to a modern version of ECMAScript
  // that supports import.meta
  build: {
    target: 'es2020'
  },
  // Also set the esbuild target for consistency
  esbuild: {
    target: 'es2020'
  },
  // And for the optimizer
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
})

