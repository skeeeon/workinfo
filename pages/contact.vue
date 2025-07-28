<template>
  <div class="contact-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Contact Us</h1>
        
        <div class="contact-info">
          <div class="contact-card">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible. Whether you have questions about WorkInfo, need technical support, or want to share feedback, our team is here to help.</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">
                  <EnvelopeIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Email Support</h3>
                  <p>For questions, technical support, or feedback</p>
                  <a href="mailto:info@workinfo.me">info@workinfo.me</a>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">
                  <ChatBubbleLeftIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Response Time</h3>
                  <p>We typically respond within 24 hours</p>
                  <p>Monday - Friday, 9AM - 5PM CST</p>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">
                  <QuestionMarkCircleIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Frequently Asked Questions</h3>
                  <p>Check our help section for common questions</p>
                  <a href="mailto:info@workinfo.me?subject=FAQ Request">Request FAQ Access</a>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">
                  <BugAntIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Report a Bug</h3>
                  <p>Found something not working correctly?</p>
                  <a href="mailto:info@workinfo.me?subject=Bug Report">Report Issue</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="contact-card">
            <h2>Other Ways to Connect</h2>
            <p>Stay updated with WorkInfo news and tips for professional networking.</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">
                  <GlobeAltIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Company Information</h3>
                  <p>WorkInfo - Professional Contact Cards</p>
                  <p>Making professional networking simple and effective</p>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">
                  <ShieldCheckIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3>Privacy & Security</h3>
                  <p>Questions about data privacy or security?</p>
                  <a href="mailto:info@workinfo.me">info@workinfo.me</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Contact page for WorkInfo
 * Provides contact information and support details
 */

import { 
  EnvelopeIcon, 
  ChatBubbleLeftIcon, 
  QuestionMarkCircleIcon,
  BugAntIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

// SEO Meta
useSeoMeta({
  title: 'Contact Us - WorkInfo',
  description: 'Get in touch with the WorkInfo team for support, questions, and feedback. We\'re here to help with your professional contact card needs.',
  keywords: 'contact, support, help, WorkInfo, professional contact cards',
  ogTitle: 'Contact WorkInfo Support',
  ogDescription: 'Get in touch with our team for help with your professional contact cards.',
  ogType: 'website'
})
</script>

<style scoped>
/* All styles are now handled by the main CSS file */
/* This ensures consistency across the application */
</style>
