import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // CRITICAL FIX: Polyfill process.env for libraries (like Groq) that expect Node.js environment
    // This prevents "process is not defined" errors in the browser.
    'process.env': {},
  },
});