// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  fatal: true,
  modules: ['nuxt-graphql-request', '@nuxt/image'],
  

  build: {
    transpile: ['nuxt-graphql-request'],
  },
  graphql: {
    clients: {
      default: {
        endpoint: process.env.API_URL || 'http://localhost:1338/graphql',
      }
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})