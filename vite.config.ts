import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  devServer: {
      proxy: {
        '/api': {
          target: 'http://122.51.215.230:8000',
          changeOrigin: true,
		  rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径

        },
      },
    },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
