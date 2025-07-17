<template>
  <div class="min-h-screen flex flex-col theme-transition">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
/**
 * Default layout for Hivecard application
 * Provides the main structure for most pages
 */

// Initialize the theme system
const { isDarkMode } = useTheme()
</script>

<style>
/* Global container style */
.container {
  @apply px-4 sm:px-6 mx-auto;
  max-width: 1280px;
}

/* Add smooth scrolling to the entire page */
html {
  scroll-behavior: smooth;
}

/* Improve focus styles for accessibility */
:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}

/* Theme transition for smooth color changes */
.theme-transition {
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}

/* Ensure proper loading states */
.nuxt-loading-indicator {
  background: var(--color-primary);
}
</style>
