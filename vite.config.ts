import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for libraries that rely on it (like groq-sdk internals)
    // IMPORTANT: Use import.meta.env.VITE_... for your actual variables in code
    'process.env': {},
  },
});