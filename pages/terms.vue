<!-- pages/terms.vue -->
<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Terms of Service</h1>
        <div class="prose">
          <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
          
          <h2>Agreement to Terms</h2>
          <p>By accessing and using Hivecard, you agree to be bound by these Terms of Service.</p>
          
          <h2>Use of Service</h2>
          <p>You may use our service to create and share digital business cards in accordance with these terms.</p>
          
          <h2>User Content</h2>
          <p>You are responsible for all content you upload or share through our service.</p>
          
          <h2>Prohibited Uses</h2>
          <p>You may not use our service for any illegal or unauthorized purpose.</p>
          
          <h2>Termination</h2>
          <p>We may terminate or suspend your account at our discretion.</p>
          
          <h2>Contact Information</h2>
          <p>For questions about these Terms, contact us at support@hivecard.me</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Terms of Service - Hivecard',
  description: 'Terms of service for using the Hivecard digital business card platform.'
})
</script>

