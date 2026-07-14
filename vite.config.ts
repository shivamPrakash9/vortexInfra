import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This tells Vite to convert modern syntax like `?.` into standard JS
    target: 'es2015'
  }
});
