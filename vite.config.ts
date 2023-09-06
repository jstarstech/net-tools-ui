import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(env.VITE_DEV_PROXY)
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      vueJsx(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true
      })
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    base: '',
    server: {
      ...(env.VITE_DEV_PROXY === 'true' && {
        proxy: {
          '/init': env.VITE_API_URL,
          '/socket.io': {
            target: env.VITE_WS_URL,
            ws: true
          }
        }
      })
    }
  }
})
