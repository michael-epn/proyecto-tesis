import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Your existing setting
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    
    // OPTION 3: Increase the warning limit to 1MB (1000KB)
    chunkSizeWarningLimit: 2000, 

    // OPTION 2: Split third-party libraries into a 'vendor' chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  } 
})