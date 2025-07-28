<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Privacy Policy</h1>
        
        <div class="prose">
          <p><strong>Last updated:</strong> {{ lastUpdated }}</p>
          
          <p>
            At WorkInfo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our professional contact card service. Please read this privacy policy carefully.
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>
            We collect information you provide directly to us when you create an account, build your contact card, or communicate with us. This may include:
          </p>
          <p>
            • Name, email address, and username<br>
            • Professional information (job title, company, contact details)<br>
            • Profile photos and other images you upload<br>
            • Any additional information you choose to include on your contact card
          </p>

          <h3>Automatically Collected Information</h3>
          <p>
            When you use our service, we may automatically collect certain information about your device and usage patterns, including:
          </p>
          <p>
            • Device information (browser type, operating system)<br>
            • Usage data (pages visited, time spent on service)<br>
            • IP address and general location information<br>
            • Cookies and similar tracking technologies
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <p>
            • Provide, maintain, and improve our contact card services<br>
            • Create and display your professional contact cards<br>
            • Communicate with you about your account and our services<br>
            • Respond to your comments, questions, and support requests<br>
            • Send you technical notices and security alerts<br>
            • Analyze usage patterns to improve user experience
          </p>

          <h2>Information Sharing and Disclosure</h2>
          
          <h3>Public Information</h3>
          <p>
            Information on your contact card is public by design and can be viewed by anyone who has your card URL or QR code. This includes your name, professional information, and any other details you choose to display.
          </p>

          <h3>Service Providers</h3>
          <p>
            We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service. These providers are bound by confidentiality agreements.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose your information if required by law or if we believe in good faith that such disclosure is necessary to comply with legal obligations, protect our rights, or ensure user safety.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide services. You may delete your account at any time, which will remove your personal information from our active databases.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <p>
            • Access to your personal information<br>
            • Correction of inaccurate information<br>
            • Deletion of your information<br>
            • Portability of your data<br>
            • Opt-out of certain communications
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze site usage. You can control cookie settings through your browser preferences.
          </p>

          <h2>Third-Party Analytics</h2>
          <p>
            If you choose to add analytics tracking to your contact card, you are responsible for complying with applicable privacy laws and obtaining necessary consents. We validate analytics scripts for security but are not responsible for third-party data collection.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information promptly.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:info@workinfo.me">info@workinfo.me</a><br>
            <strong>Support:</strong> <a href="mailto:info@workinfo.me">info@workinfo.me</a>
          </p>

          <p>
            For general inquiries about WorkInfo, visit our <NuxtLink to="/contact">contact page</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Privacy Policy page for WorkInfo
 * Comprehensive privacy policy covering data collection, usage, and user rights
 */

// Get current date for last updated
const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// SEO Meta
useSeoMeta({
  title: 'Privacy Policy - WorkInfo',
  description: 'WorkInfo\'s privacy policy explains how we collect, use, and protect your personal information when using our professional contact card service.',
  keywords: 'privacy policy, data protection, personal information, WorkInfo',
  ogTitle: 'Privacy Policy - WorkInfo',
  ogDescription: 'Learn how WorkInfo protects your privacy and handles your personal information.',
  ogType: 'website',
  robots: 'index, follow'
})
</script>

<style scoped>
/* All styles are handled by the main CSS file */
/* This ensures consistency with the rest of the application */
</style>
