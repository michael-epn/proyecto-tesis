import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/proyecto-tesis/',
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})