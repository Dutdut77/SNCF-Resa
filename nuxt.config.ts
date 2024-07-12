// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', "@nuxtjs/supabase"],
  imports: {
    dirs: [
      'composables/**'
    ]
  },
  supabase: {
    redirect : false
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
            { name : 'apple-mobile-web-app-capable', content  : "yes"},
            { name : 'apple-mobile-web-app-status-bar-style', content  : "transparent"},
        ],
        link: [
          { rel : 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'}, 
          { rel : "manifest", href : "/manifest.json"},
          { rel : "apple-touch-startup-image", href : "/images/logo.png"}
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

