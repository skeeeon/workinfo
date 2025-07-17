<template>
  <footer class="py-12 border-t" 
          :style="{ 
            backgroundColor: 'var(--color-surface-secondary)',
            borderColor: 'var(--color-border-primary)'
          }">
    <div class="container mx-auto px-4">
      <div class="text-center">
        <div class="mb-6">
          <Logo />
        </div>
        
        <p class="text-sm mb-6 max-w-md mx-auto" 
           :style="{ color: 'var(--color-content-secondary)' }">
          Digital business cards for modern professionals. 
          Create, customize, and share your professional identity.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
          <NuxtLink to="/" 
                    class="text-sm transition-colors"
                    :style="{ color: 'var(--color-content-secondary)' }">
            Home
          </NuxtLink>
          
          <NuxtLink to="/privacy" 
                    class="text-sm transition-colors"
                    :style="{ color: 'var(--color-content-secondary)' }">
            Privacy Policy
          </NuxtLink>
          
          <NuxtLink to="/terms" 
                    class="text-sm transition-colors"
                    :style="{ color: 'var(--color-content-secondary)' }">
            Terms of Service
          </NuxtLink>
          
          <NuxtLink to="/contact" 
                    class="text-sm transition-colors"
                    :style="{ color: 'var(--color-content-secondary)' }">
            Contact
          </NuxtLink>
        </div>
        
        <div class="pt-6 border-t" 
             :style="{ borderColor: 'var(--color-border-primary)' }">
          <p class="text-xs" 
             :style="{ color: 'var(--color-content-tertiary)' }">
            © {{ new Date().getFullYear() }} Hivecard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
/**
 * Footer component for Hivecard
 * Simple, clean footer with essential links
 */
</script>

<style scoped>
.container {
  max-width: 1280px;
}

/* Hover effects */
a:hover {
  color: var(--color-primary) !important;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
