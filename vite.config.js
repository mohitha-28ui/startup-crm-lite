import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This configuration wires up our compiler plugins for Vite
export default defineConfig({
  plugins: [
    react(),       // Enables compilation support for React JSX syntax
    tailwindcss()  // Automatically processes Tailwind CSS directives on build
  ]
})