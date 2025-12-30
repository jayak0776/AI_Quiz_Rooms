import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#0D4715',   // custom blue
        secondary: '#41644A', // custom orange
        accent: '#EBE1D1',    // custom green
      },
    },
  },
  plugins: [react(),tailwindcss()],
})
