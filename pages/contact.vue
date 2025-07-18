<!-- pages/contact.vue -->
<template>
  <div class="contact-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Contact Us</h1>
        <div class="contact-info">
          <div class="contact-card">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <EnvelopeIcon class="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <a href="mailto:support@workinfo.me">support@workinfo.me</a>
                </div>
              </div>
              
              <div class="contact-method">
                <ChatBubbleLeftIcon class="contact-icon" />
                <div>
                  <h3>Support</h3>
                  <p>Available Monday - Friday, 9AM - 5PM CST</p>
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
import { EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Contact Us - WorkInfo',
  description: 'Get in touch with the WorkInfo team for support and questions.'
})
</script>
