import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { aiIndex } from './ai-index'

export default defineConfig({
  plugins: [react(), tailwindcss(), aiIndex()],
  server: { port: 5180 },
})
