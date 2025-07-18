// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // CSS framework
  css: ['~/assets/css/main.css'],
  
  // Modules
  modules: [
    '@vite-pwa/nuxt'
  ],

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://workinfo.me',
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
    }
  },

  // PWA Configuration - COMPLETE SETUP
  pwa: {
    mode: 'production', // Force PWA in development for testing
    
    // Register SW
    registerType: 'autoUpdate',
    
    // Workbox options
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      navigateFallback: '/offline',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        }
      ]
    },

    // Manifest configuration - COMPLETE for iOS compatibility
    manifest: {
      name: 'WorkInfo - Professional Contact Cards',
      short_name: 'WorkInfo',
      description: 'Create and share professional digital business cards with ease',
      theme_color: '#3B82F6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/?pwa=true',
      id: '/?pwa=true',
      
      // Icons - Multiple sizes for iOS compatibility
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: '/icons/icon-180x180.png',
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],

      // iOS specific settings
      apple: {
        statusBarStyle: 'default'
      },

      // App shortcuts
      shortcuts: [
        {
          name: 'Create Card',
          short_name: 'Create',
          description: 'Create a new business card',
          url: '/dashboard',
          icons: [{ src: '/icons/shortcut-create.png', sizes: '192x192' }]
        },
        {
          name: 'View Cards',
          short_name: 'Cards',
          description: 'View your business cards',
          url: '/dashboard',
          icons: [{ src: '/icons/shortcut-view.png', sizes: '192x192' }]
        }
      ],

      // Categories
      categories: ['business', 'productivity', 'utilities']
    },

    // Client configuration
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },

    // Development options
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  // App configuration
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      
      // iOS specific meta tags - CRITICAL for PWA installation
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#3B82F6' },
        { name: 'theme-color', content: '#3B82F6' },
        
        // iOS PWA meta tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'WorkInfo' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WorkInfo - Professional Contact Cards' },
        { property: 'og:description', content: 'Create and share professional digital business cards with ease' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://workinfo.me' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WorkInfo - Professional Contact Cards' },
        { name: 'twitter:description', content: 'Create and share professional digital business cards with ease' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      
      // Apple touch icons - REQUIRED for iOS PWA installation
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/icon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/icon-32x32.png' },
        
        // Apple touch icons - Different sizes for different devices
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/icons/apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/icons/apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/icons/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/icons/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/icons/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/icons/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/icons/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/apple-touch-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon-180x180.png' },
        
        // Preconnect for performance
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },

  // Build configuration
  nitro: {
    prerender: {
      routes: ['/manifest.webmanifest']
    }
  },

  // PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // TypeScript
  typescript: {
    typeCheck: true
  }
})
