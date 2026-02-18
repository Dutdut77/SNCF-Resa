import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: {
    enabled: false,
  },

  modules: ["@nuxtjs/supabase", "@nuxt/icon"],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  imports: {
    dirs: [
      'composables/**'
    ]
  },

  supabase: {
    redirect: false,
    types: false
  },

  build: {
    transpile: ['@vuepic/vue-datepicker']
  },

  app: {
    head: {
      title: 'Réservation - Infrapôle Paris-Est',
      meta: [
        { name: 'viewport', content: 'width=device-width, user-scalable=no' },
        { hid: 'H00', name: 'Réservation - Infrapôle Paris-Est', content: 'Salles, Véhicules' },
        { name: 'apple-mobile-web-app-capable', content: "yes" },
        { name: 'apple-mobile-web-app-status-bar-style', content: "transparent" },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "apple-touch-startup-image", href: "/images/logo.png" }
      ],
      style: [],
      script: []
    },
  },
})
