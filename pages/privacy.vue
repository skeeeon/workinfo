<!-- pages/privacy.vue -->
<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Privacy Policy</h1>
        <div class="prose">
          <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
          
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or contact us.</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services.</p>
          
          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
          
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@workinfo.me</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Privacy Policy - WorkInfo',
  description: 'Our privacy policy explains how we collect, use, and protect your information.'
})
</script>
