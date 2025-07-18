export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // SSR Configuration
  ssr: true,
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt'
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

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'WorkInfo - Professional Contact Cards',
      short_name: 'WorkInfo',
      description: 'Create and share professional contact cards',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  },

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
  }
})
