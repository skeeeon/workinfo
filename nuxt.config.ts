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

  // FIXED: Clean PWA Configuration without problematic fallback
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
      // FIXED: Use the proper Nuxt offline page instead of _fallback
      navigateFallback: '/offline',
      
      // FIXED: Proper denylist that won't cause issues
      navigateFallbackDenylist: [
        /^\/api\//,      // API routes
        /^\/admin\//,    // Admin routes  
        /^\/_nuxt\//,    // Nuxt internal routes
        /^\/manifest\.webmanifest$/, // Manifest file
        /\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$/ // Static assets
      ],
      
      // FIXED: Conservative glob patterns
      globPatterns: [
        '**/*.{js,css,html,png,svg,ico}'
      ],
      
      // FIXED: Simplified runtime caching
      runtimeCaching: [
        {
          // Cache navigation requests (pages)
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            },
            networkTimeoutSeconds: 3
          }
        },
        {
          // Cache API calls to PocketBase
          urlPattern: ({ url }) => url.pathname.startsWith('/api/collections/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60 // 5 minutes
            },
            networkTimeoutSeconds: 3
          }
        },
        {
          // Cache images
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ],
      
      // FIXED: Clean cache management
      cleanupOutdatedCaches: true,
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

  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  // FIXED: Production-ready Nitro configuration
  nitro: {
    preset: 'vercel',
    
    prerender: {
      // FIXED: Disable automatic crawling to prevent errors
      crawlLinks: false,
      
      // FIXED: Only prerender essential static pages
      routes: [
        '/',
        '/login', 
        '/register',
        '/privacy',
        '/terms',
        '/contact',
        '/offline'  // IMPORTANT: Prerender offline page so it's available when offline
      ]
    },
    
    // FIXED: Explicit route rules for clean deployment
    routeRules: {
      // Static pages - prerender for performance
      '/': { prerender: true },
      '/login': { prerender: true },
      '/register': { prerender: true },
      '/privacy': { prerender: true },
      '/terms': { prerender: true },
      '/contact': { prerender: true },
      '/offline': { prerender: true }, // IMPORTANT: Offline page must be prerendered
      
      // Dynamic routes - SSR on demand
      '/users/**': { 
        ssr: true, 
        prerender: false,
        // Add headers for better caching
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300'
        }
      },
      
      // Dashboard - Client-side only (requires auth)
      '/dashboard': { 
        ssr: false, 
        prerender: false 
      }
    }
  }
})
