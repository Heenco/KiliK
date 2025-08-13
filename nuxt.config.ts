import tailwindcss from "@tailwindcss/vite";
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',
    'mapbox-gl/dist/mapbox-gl.css',
    '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  ],
  
  // Add server options for cookies to work properly
  nitro: {
    // Remove the circular proxy - Nuxt handles /api routes automatically
    // devProxy: {
    //   '/api': {
    //     target: 'http://localhost:3000/api',
    //     changeOrigin: true,
    //     cookieDomainRewrite: {
    //       '*': ''
    //     }
    //   }
    // }
  }
  ,

  vite: {
    plugins: [
      tailwindcss(),
      svgLoader()
    ],
    optimizeDeps: {
      include: ['mapbox-gl']
    },
    ssr: {
      noExternal: ['mapbox-gl']
    }
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@600&display=swap'
        },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
          as: 'style',
          onload: "this.rel='stylesheet'"
        }
      ]
    }
  },

  modules: ["shadcn-nuxt", 'nuxt-lucide-icons', '@i2d/nuxt-pdf-frame','@nuxtjs/supabase'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,
      SUPABASE_URL: process.env.SUPABASE_URL || (process.env.VERCEL_URL ? 'https://mfratgltpabsyduhboap.supabase.co' : 'https://mfratgltpabsyduhboap.supabase.co'),
      SUPABASE_KEY: process.env.SUPABASE_KEY || (process.env.VERCEL_URL ? 'PRODUCTION_SUPABASE_KEY' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmF0Z2x0cGFic3lkdWhib2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNjgzNzQsImV4cCI6MjA2Mjk0NDM3NH0.Br5-xThqEFqbyopiv0lrrCwDJ3MwJpaVoWkcY_286eo'),
      OPENAI_API_KEY: process.env.NUXT_PUBLIC_OPENAI_API_KEY || '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',
      GOOGLE_MAPS_API_KEY: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAYwhWTpIsih_qv7vBoYSU82UmZb35Ccn4'
    }
  },
  supabase: {
  redirectOptions: {
    login: '/signin',
    callback: '/confirm',
    exclude: ['/', '/signin', '/confirm', '/PDF_report/pdf','/PDF_report/simple'],
  },
},
});