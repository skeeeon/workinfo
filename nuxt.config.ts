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

  // FIXED PWA Configuration - Handle dynamic routes properly
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
      // FIXED: Handle navigation fallback properly
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//, /^\/admin\//], // Don't fallback for API routes
      
      // FIXED: Glob patterns that work with Vercel
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      
      // FIXED: Runtime caching for dynamic routes
      runtimeCaching: [
        {
          // Cache dynamic user card pages
          urlPattern: /^\/users\/[^/]+$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'user-cards',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            },
            networkTimeoutSeconds: 10
          }
        },
        {
          // Cache PocketBase API calls
          urlPattern: /^.*\/api\/collections\/cards\/records.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pocketbase-api',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60 // 5 minutes  
            },
            networkTimeoutSeconds: 5
          }
        },
        {
          // Cache images from PocketBase
          urlPattern: /^.*\/api\/files\/cards\/.*$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'card-images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        },
        {
          // Cache other static assets
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ],
      
      // FIXED: Cleaner cache management
      cleanupOutdatedCaches: true,
      
      // FIXED: Skip waiting for faster updates
      skipWaiting: true,
      clientsClaim: true
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

  // FIXED: Vite configuration for better PWA handling
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    },
    // Handle PWA build issues
    build: {
      rollupOptions: {
        external: ['workbox-build']
      }
    }
  },

  // FIXED: Nitro configuration for Vercel deployment
  nitro: {
    preset: 'vercel',
    // Handle dynamic routes better in production
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml']
    }
  }
})
