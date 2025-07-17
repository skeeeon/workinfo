<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 md:py-32 relative overflow-hidden">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight" 
            :style="{ color: 'var(--color-content-primary)' }">
          Your Professional Identity,
          <span :style="{ color: 'var(--color-primary)' }">Digitized</span>
        </h1>
        
        <p class="text-xl mb-8 max-w-3xl mx-auto" 
           :style="{ color: 'var(--color-content-secondary)' }">
          Create beautiful, customizable digital business cards that make lasting impressions. 
          Perfect for modern professionals in the Hive coworking community.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <NuxtLink to="/register" class="btn btn-primary">
            Get Started Free
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-outlined">
            Sign In
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20" 
             :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            Everything You Need
          </h2>
          <p class="text-lg max-w-2xl mx-auto" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Powerful features to create, customize, and share your professional identity
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="`feature-${index}`" 
               class="feature-card">
            <div class="feature-icon mb-6" 
                 :style="{ color: feature.color }">
              <component :is="feature.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-4" 
                :style="{ color: 'var(--color-content-primary)' }">
              {{ feature.title }}
            </h3>
            <p :style="{ color: 'var(--color-content-secondary)' }">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20" 
             :style="{ backgroundColor: 'var(--color-surface-primary)' }">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            How It Works
          </h2>
          <p class="text-lg max-w-2xl mx-auto" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Get your digital business card up and running in minutes
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="`step-${index}`" 
               class="step-card text-center">
            <div class="step-number mb-6" 
                 :style="{ 
                   backgroundColor: 'var(--color-primary)',
                   color: 'white'
                 }">
              {{ index + 1 }}
            </div>
            <h3 class="text-xl font-semibold mb-4" 
                :style="{ color: 'var(--color-content-primary)' }">
              {{ step.title }}
            </h3>
            <p :style="{ color: 'var(--color-content-secondary)' }">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20" 
             :style="{ backgroundColor: 'var(--color-primary)' }">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Go Digital?
        </h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join professionals who are already making better connections with digital business cards.
        </p>
        <NuxtLink to="/register" 
                  class="btn btn-secondary bg-white text-blue-600 hover:bg-gray-100">
          Create Your Card Now
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * Home page for Hivecard
 * Landing page with hero, features, and call-to-action sections
 */

// Import Heroicons
import {
  PaintBrushIcon,
  QrCodeIcon,
  ShareIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

// SEO
useSeoMeta({
  title: 'Hivecard - Digital Business Cards for Modern Professionals',
  description: 'Create beautiful, customizable digital business cards. Perfect for professionals in coworking spaces. Easy to create, share, and update.',
  keywords: 'digital business cards, professional networking, coworking, QR codes, vCard, contact sharing',
  ogTitle: 'Hivecard - Digital Business Cards',
  ogDescription: 'Create and share professional digital business cards',
  ogType: 'website'
})

// Features data
const features = [
  {
    icon: PaintBrushIcon,
    color: '#2563eb',
    title: 'Custom Design',
    description: 'Personalize your card with custom colors, themes, and branding that reflects your professional identity.'
  },
  {
    icon: QrCodeIcon,
    color: '#059669',
    title: 'QR Code Sharing',
    description: 'Generate QR codes for instant sharing. Perfect for networking events and professional meetups.'
  },
  {
    icon: ShareIcon,
    color: '#7c3aed',
    title: 'Easy Sharing',
    description: 'Share your card via URL, QR code, or download as vCard. Works with all contact management systems.'
  },
  {
    icon: DevicePhoneMobileIcon,
    color: '#dc2626',
    title: 'Mobile Optimized',
    description: 'Looks perfect on all devices. Your contacts can view and save your information anywhere.'
  },
  {
    icon: CloudIcon,
    color: '#ea580c',
    title: 'Always Updated',
    description: 'Update your information once, and everyone with your card sees the latest details automatically.'
  },
  {
    icon: SparklesIcon,
    color: '#0891b2',
    title: 'Professional Look',
    description: 'Clean, modern design that makes a great first impression and reflects your professionalism.'
  }
]

// Steps data
const steps = [
  {
    title: 'Sign Up',
    description: 'Create your account and choose your unique username. It takes less than a minute to get started.'
  },
  {
    title: 'Customize',
    description: 'Add your information, upload your photo, and customize colors to match your personal brand.'
  },
  {
    title: 'Share',
    description: 'Share your card URL, generate QR codes, or download vCard files. Start networking immediately.'
  }
]
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.feature-card {
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-secondary);
  margin: 0 auto;
}

.step-card {
  padding: 2rem;
  transition: all 0.2s ease;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto;
}

/* Enhanced button styling */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outlined:hover {
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}
</style>
