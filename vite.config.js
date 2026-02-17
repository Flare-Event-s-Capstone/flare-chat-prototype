import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
		babel: {
			plugins: ['babel-plugin-react-compiler']
		}
	})],
  base: '/flare-chat-prototype/',
  build: {
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: true,
  },
})
