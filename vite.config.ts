import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basadas en el modo (development, production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),      
      tailwindcss()
    ],
    server: {
      proxy: {
        '/routes': {
          target: env.VITE_API_URL || 'https://backend-transporte-inteligente.onrender.com',
          changeOrigin: true
        }
      }
    }
  }
})
