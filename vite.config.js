// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

import { fileURLToPath, URL } from 'node:url'
import dns from 'dns'
dns.setDefaultResultOrder('verbatim')

export default () => {
  const baseURL =
    process.env.APP_ENV === 'development'
      ? '/'
      : '/2025/flight-plan/t4/'

  return defineConfig({

    resolve: {
    alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    },

    plugins: [
      vue(),
      vuetify({ autoImport: true })
    ],

    server: {
      host: 'localhost',
      port: 8081,
    },

    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },

    base: baseURL,

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/_variables.scss" as *;`
        }
      }
    }
  })
}
