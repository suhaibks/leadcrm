import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// replace <repo-name> with your GitHub repo name, here it's 'leadcrm'
export default defineConfig({
  plugins: [react()],
  base: '/leadcrm/',   // 👈 important
})
