// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Importamos los paquetes directamente
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [vue()],
  // FORZAR LA CONFIGURACIÓN DE POSTCSS EN VITE
  css: {
    postcss: {
      plugins: [
        // Listamos los módulos importados como funciones directas
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  // ...
})
