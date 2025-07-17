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

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },

  // Component auto-imports
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Enhanced imports configuration
  imports: {
    dirs: [
      'composables'
    ]
  },

  // Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true
  },

  // CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
    }
  },

  // SEO Configuration
  app: {
    head: {
      title: 'Hivecard - Digital Business Cards for Modern Professionals',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create and share digital business cards for Hive coworking space members.' },
        { name: 'author', content: 'Hive Coworking' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#2563eb', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' },
        // PWA meta tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Hivecard' },
        { name: 'msapplication-TileColor', content: '#2563eb' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        // Apple touch icons
        { rel: 'apple-touch-icon', href: '/icon-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon-192x192.png' }
      ]
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  // Disable TypeScript checking for development speed
  typescript: {
    typeCheck: false
  }
})
