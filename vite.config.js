import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/flare-chat-prototype/' : '/',
  build: {
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
