<template>
  <div class="compact-business-card">
    <!-- Action buttons for sharing -->
    <div class="card-actions">
      <button 
        @click="$emit('show-qr')"
        class="action-btn"
        aria-label="Show QR Code"
      >
        <QrCodeIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click="shareCard"
        v-if="canShare"
        class="action-btn"
        aria-label="Share Card"
      >
        <ShareIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click="copyCardUrl"
        v-else
        class="action-btn"
        aria-label="Copy URL"
      >
        <ClipboardIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Compact card content -->
    <div class="card-content">
      <!-- Profile section - more compact -->
      <div class="profile-section">
        <div class="profile-image-container">
          <img 
            v-if="profileImageUrl"
            :src="profileImageUrl" 
            :alt="displayName"
            class="profile-image"
            @error="handleImageError"
          />
          <div v-else class="profile-placeholder">
            <UserIcon class="w-8 h-8" />
          </div>
        </div>
        
        <div class="profile-info">
          <h1 class="profile-name">{{ displayName }}</h1>
          <p v-if="card.title" class="profile-title">{{ card.title }}</p>
          <p v-if="card.company" class="profile-company">{{ card.company }}</p>
          <p v-if="card.address" class="profile-address">{{ card.address }}</p>
        </div>
      </div>

      <!-- Description - truncated -->
      <div v-if="card.note" class="description-section">
        <p class="description-text">{{ truncatedNote }}</p>
      </div>

      <!-- Compact contact methods -->
      <div v-if="contactMethods.length > 0" class="contact-methods">
        <div class="contact-grid">
          <a 
            v-for="contact in contactMethods" 
            :key="contact.key"
            :href="contact.href"
            class="contact-item"
            @click="trackContactClick(contact.key)"
          >
            <component :is="getContactIcon(contact.key)" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Compact Business Card component - Optimized for dashboard preview
 * More condensed version of the public business card
 */

import {
  QrCodeIcon,
  ShareIcon,
  ClipboardIcon,
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

// Computed properties
const displayName = computed(() => {
  return `${props.card.first_name || ''} ${props.card.last_name || ''}`.trim()
})

const profileImageUrl = computed(() => {
  return getPublicImageUrl(props.card)
})

const truncatedNote = computed(() => {
  if (!props.card.note) return ''
  return props.card.note.length > 80 ? 
    props.card.note.substring(0, 80) + '...' : 
    props.card.note
})

const contactMethods = computed(() => {
  const methods = []
  
  if (props.card.mobile) {
    methods.push({
      key: 'mobile',
      href: `tel:${props.card.mobile}`
    })
  }
  
  if (props.card.office) {
    methods.push({
      key: 'office',
      href: `tel:${props.card.office}`
    })
  }
  
  if (props.card.email) {
    methods.push({
      key: 'email',
      href: `mailto:${props.card.email}`
    })
  }
  
  if (props.card.website) {
    methods.push({
      key: 'website',
      href: props.card.website.startsWith('http') ? props.card.website : `https://${props.card.website}`
    })
  }
  
  if (props.card.calendar) {
    methods.push({
      key: 'calendar',
      href: props.card.calendar.startsWith('http') ? props.card.calendar : `https://${props.card.calendar}`
    })
  }
  
  return methods
})

const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

const cardShareUrl = computed(() => {
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

const getContactIcon = (contactType) => {
  return contactIcons[contactType] || PhoneIcon
}

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

const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    await navigator.clipboard.writeText(cardShareUrl.value)
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

const trackContactClick = (contactType) => {
  console.log(`Contact clicked: ${contactType}`)
}

const handleImageError = (event) => {
  console.error('Failed to load profile image:', event.target.src)
  event.target.style.display = 'none'
}
</script>

<style scoped>
/* Compact card container */
.compact-business-card {
  max-width: 100%;
  padding: 0.75rem;
}

/* Compact action buttons */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-primary);
  border-radius: 50%;
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Compact card content */
.card-content {
  text-align: center;
}

/* Compact profile section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-image-container {
  margin-bottom: 0.75rem;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
}

.profile-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-surface-secondary);
  border: 2px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-content-tertiary);
}

.profile-info {
  text-align: center;
}

.profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.25rem;
}

.profile-title {
  font-size: 0.875rem;
  color: var(--color-content-secondary);
  margin-bottom: 0.125rem;
}

.profile-company {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-content-primary);
}

.profile-address {
  font-size: 0.8125rem;
  color: var(--color-content-secondary);
  font-style: italic;
}

/* Compact description */
.description-section {
  margin-bottom: 1rem;
}

.description-text {
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-content-secondary);
}

/* Compact contact methods */
.contact-methods {
  margin-top: 1rem;
}

.contact-grid {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.contact-item:hover {
  transform: scale(1.1);
}
</style>
