<template>
  <div class="public-business-card">
    <!-- Action buttons for sharing -->
    <div class="card-actions">
      <button 
        @click="$emit('show-qr')"
        class="action-btn"
        aria-label="Show QR Code"
      >
        <QrCodeIcon class="w-5 h-5" />
        <span class="action-label">QR Code</span>
      </button>
      
      <button 
        @click="shareCard"
        v-if="canShare"
        class="action-btn"
        aria-label="Share Card"
      >
        <ShareIcon class="w-5 h-5" />
        <span class="action-label">Share</span>
      </button>
      
      <button 
        @click="copyCardUrl"
        v-else
        class="action-btn"
        aria-label="Copy URL"
      >
        <ClipboardIcon class="w-5 h-5" />
        <span class="action-label">Copy URL</span>
      </button>
    </div>

    <!-- Card content -->
    <div class="card-content">
      <!-- Profile section -->
      <div class="profile-section">
        <!-- Profile image -->
        <div class="profile-image-container">
          <img 
            v-if="profileImageUrl"
            :src="profileImageUrl" 
            :alt="displayName"
            class="profile-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <div v-else class="profile-placeholder">
            <UserIcon class="w-16 h-16" />
          </div>
        </div>
        
        <!-- Name and title -->
        <div class="profile-info">
          <h1 class="profile-name">{{ displayName }}</h1>
          <p v-if="card.title" class="profile-title">{{ card.title }}</p>
          <p v-if="card.company" class="profile-company">{{ card.company }}</p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="card.note" class="description-section">
        <p class="description-text">{{ card.note }}</p>
      </div>

      <!-- Save contact CTA -->
      <div class="cta-section">
        <button @click="downloadVCard" class="cta-button">
          <UserPlusIcon class="w-5 h-5 mr-2" />
          Save Contact
        </button>
      </div>

      <!-- Contact methods -->
      <div v-if="contactMethods.length > 0" class="contact-methods">
        <div class="contact-grid">
          <a 
            v-for="contact in contactMethods" 
            :key="contact.key"
            :href="contact.href"
            class="contact-item"
            @click="trackContactClick(contact.key)"
          >
            <div class="contact-icon">
              <component :is="getContactIcon(contact.key)" class="w-5 h-5" />
            </div>
            <span class="contact-label">{{ contact.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Public Business Card component - Optimized for public viewing
 * Includes sharing functionality and contact saving
 */

import {
  QrCodeIcon,
  ShareIcon,
  ClipboardIcon,
  UserPlusIcon,
  UserIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['show-qr'])

// Composables
const { getPublicImageUrl, getPublicShareUrl } = usePublicCard()
const route = useRoute()

// Computed properties
const displayName = computed(() => {
  return `${props.card.first_name || ''} ${props.card.last_name || ''}`.trim()
})

const profileImageUrl = computed(() => {
  const url = getPublicImageUrl(props.card)
  console.log('PublicBusinessCard: Profile image URL:', url)
  return url
})

const contactMethods = computed(() => {
  const methods = []
  
  if (props.card.mobile) {
    methods.push({
      key: 'mobile',
      label: 'Mobile',
      href: `tel:${props.card.mobile}`
    })
  }
  
  if (props.card.office) {
    methods.push({
      key: 'office',
      label: 'Office', 
      href: `tel:${props.card.office}`
    })
  }
  
  if (props.card.email) {
    methods.push({
      key: 'email',
      label: 'Email',
      href: `mailto:${props.card.email}`
    })
  }
  
  if (props.card.website) {
    methods.push({
      key: 'website',
      label: 'Website',
      href: props.card.website.startsWith('http') ? props.card.website : `https://${props.card.website}`
    })
  }
  
  if (props.card.calendar) {
    methods.push({
      key: 'calendar',
      label: 'Calendar',
      href: props.card.calendar.startsWith('http') ? props.card.calendar : `https://${props.card.calendar}`
    })
  }
  
  return methods
})

const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

const cardShareUrl = computed(() => {
  // Username is directly in the card object now
  if (!props.card.username) return ''
  return getPublicShareUrl(props.card.username)
})

// Contact icon mapping
const contactIcons = {
  mobile: DevicePhoneMobileIcon,
  office: PhoneIcon,
  email: EnvelopeIcon,
  website: GlobeAltIcon,
  calendar: CalendarIcon
}

/**
 * Get contact icon component
 * @param {string} contactType - Contact type
 * @returns {Component} Icon component
 */
const getContactIcon = (contactType) => {
  return contactIcons[contactType] || PhoneIcon
}

/**
 * Generate vCard content
 */
const generateVCard = () => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${props.card.first_name} ${props.card.last_name}`,
    `N:${props.card.last_name};${props.card.first_name};;;`
  ]
  
  // Add optional fields
  if (props.card.company) lines.push(`ORG:${props.card.company}`)
  if (props.card.title) lines.push(`TITLE:${props.card.title}`)
  if (props.card.email) lines.push(`EMAIL:${props.card.email}`)
  if (props.card.mobile) lines.push(`TEL;TYPE=CELL:${props.card.mobile}`)
  if (props.card.office) lines.push(`TEL;TYPE=WORK:${props.card.office}`)
  if (props.card.website) lines.push(`URL:${props.card.website}`)
  if (props.card.note) lines.push(`NOTE:${props.card.note}`)
  
  lines.push('END:VCARD')
  
  return lines.join('\n')
}

/**
 * Download vCard file
 */
const downloadVCard = () => {
  if (!import.meta.client) return
  
  try {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const downloadUrl = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${props.card.first_name}_${props.card.last_name}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Failed to download vCard:', error)
  }
}

/**
 * Share card using Web Share API
 */
const shareCard = async () => {
  if (!canShare.value) return
  
  try {
    await navigator.share({
      title: `${displayName.value} - ${props.card.company}`,
      text: `View ${displayName.value}'s digital business card`,
      url: cardShareUrl.value
    })
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
  }
}

/**
 * Copy card URL to clipboard
 */
const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    await navigator.clipboard.writeText(cardShareUrl.value)
    // Show success feedback
    showToast('Link copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Track contact method clicks
 * @param {string} contactType - Contact type clicked
 */
const trackContactClick = (contactType) => {
  // Add analytics tracking here if needed
  console.log(`Contact clicked: ${contactType}`)
}

/**
 * Handle image loading errors
 * @param {Event} event - Error event
 */
const handleImageError = (event) => {
  console.error('Failed to load profile image:', event.target.src)
  event.target.style.display = 'none'
}

/**
 * Handle successful image loading
 * @param {Event} event - Load event
 */
const handleImageLoad = (event) => {
  console.log('Image loaded successfully:', event.target.src)
  event.target.style.display = 'block'
}

/**
 * Show toast notification (simple implementation)
 * @param {string} message - Message to show
 */
const showToast = (message) => {
  // Simple toast implementation - you can enhance this
  if (import.meta.client) {
    // Create and show toast element
    const toast = document.createElement('div')
    toast.className = 'toast-notification'
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }
}
</script>

<style scoped>
/* Main card container */
.public-business-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Action buttons */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 2px solid var(--color-border-primary);
  border-radius: 0.5rem;
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 80px;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.action-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Card content */
.card-content {
  text-align: center;
}

/* Profile section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: block;
}

.profile-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-surface-secondary);
  border: 4px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-content-tertiary);
}

.profile-info {
  text-align: center;
  max-width: 400px;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.profile-title {
  font-size: 1.125rem;
  color: var(--color-content-secondary);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.profile-company {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-content-primary);
  line-height: 1.4;
}

/* Description section */
.description-section {
  margin-bottom: 2rem;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-content-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* CTA section */
.cta-section {
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta-button:hover {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}

/* Contact methods */
.contact-methods {
  margin-top: 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-surface-secondary);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--color-content-primary);
  transition: all 0.2s ease;
}

.contact-item:hover {
  background-color: var(--color-surface-hover);
  transform: translateY(-2px);
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  transition: transform 0.2s ease;
}

.contact-item:hover .contact-icon {
  transform: scale(1.1);
}

.contact-label {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .public-business-card {
    padding: 1rem;
  }
  
  .card-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-btn {
    min-width: 70px;
    padding: 0.5rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .profile-image,
  .profile-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Toast animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
