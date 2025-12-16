import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed 'define: { process.env: {} }' to allow the window.process shim in index.html to work correctly
  // and prevent build-time replacement of process.env in the code.
});