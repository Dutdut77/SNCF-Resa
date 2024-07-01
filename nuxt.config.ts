// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', "@nuxtjs/supabase"],
  supabase: {
    redirect : false
  },
  app: {
    head: {
        title: 'Réservation - Infrapôle Paris-Est',
        meta: [
            { name: 'viewport', content: 'width=device-width, user-scalable=no' },
            { hid: 'H00', name: 'Réservation - Infrapôle Paris-Est', content: 'Salles, Véhicules' },
        ],
        link: [
          { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'}, 
          // { rel : "manifest", href : "/manifest.json"},
          // { rel : "icon", href : "/favicon.png" }
        ],
        style: [],
        script: []
    },
  },
  tailwindcss: {
    exposeConfig: true,
    config: {
      /* Extend the Tailwind config here */
      content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        'content/**/**.md'
      ],
      theme: {
        extend: {
          colors : {

            
          }
        },
        fontFamily: {
          traverse : ['Traverse'],
        }
      }
    }
  },
})