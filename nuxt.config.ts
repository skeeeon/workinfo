export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // SSR Configuration
  ssr: true,
  
  // Modules - REMOVED PWA temporarily
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
    // '@vite-pwa/nuxt' // COMMENTED OUT - Enable later when core app works
  ],

  // Component auto-imports
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Composables auto-import
  imports: {
    dirs: ['composables']
  },

  // Google Fonts
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
    }
  },

  // NO PWA CONFIG - Removed entirely

  // App configuration
  app: {
    head: {
      title: 'WorkInfo - Professional Contact Cards',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create and share professional contact cards for modern professionals.' },
        { name: 'theme-color', content: '#2563eb' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  // SIMPLE: Nitro configuration without PWA complications
  nitro: {
    preset: 'vercel',
    
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/login', 
        '/register',
        '/privacy',
        '/terms',
        '/contact'
      ]
    },
    
    routeRules: {
      // Static pages
      '/': { prerender: true },
      '/login': { prerender: true },
      '/register': { prerender: true },
      '/privacy': { prerender: true },
      '/terms': { prerender: true },
      '/contact': { prerender: true },
      
      // Dynamic routes
      '/users/**': { 
        ssr: true, 
        prerender: false,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300'
        }
      },
      
      // Dashboard
      '/dashboard': { 
        ssr: false, 
        prerender: false 
      }
    }
  }
})
