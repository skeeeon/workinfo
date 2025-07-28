<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Terms of Service</h1>
        
        <div class="prose">
          <p><strong>Last updated:</strong> {{ lastUpdated }}</p>
          
          <p>
            Welcome to WorkInfo. These Terms of Service ("Terms") govern your use of our professional contact card service. By accessing or using WorkInfo, you agree to be bound by these Terms.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By creating an account or using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our service.
          </p>

          <h2>Description of Service</h2>
          <p>
            WorkInfo is a digital platform that allows users to create, customize, and share professional contact cards. Our service includes web-based tools for card creation, hosting of digital contact cards, QR code generation, and sharing capabilities.
          </p>

          <h2>User Accounts</h2>
          
          <h3>Account Creation</h3>
          <p>
            To use our service, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h3>Account Requirements</h3>
          <p>
            You must be at least 13 years old to use our service. If you are between 13 and 18 years old, you must have parental consent. You may only create one account and must use your real identity.
          </p>

          <h2>Acceptable Use</h2>
          <p>You agree to use our service only for lawful purposes. You may not:</p>
          <p>
            • Upload false, misleading, or fraudulent information<br>
            • Impersonate another person or entity<br>
            • Use the service for spam or unsolicited communications<br>
            • Upload harmful, offensive, or inappropriate content<br>
            • Attempt to gain unauthorized access to our systems<br>
            • Use the service in any way that violates applicable laws
          </p>

          <h2>User Content</h2>
          
          <h3>Your Content</h3>
          <p>
            You retain ownership of all content you submit to WorkInfo, including text, images, and other information on your contact card. By submitting content, you grant us a license to use, display, and distribute your content as necessary to provide our service.
          </p>

          <h3>Content Standards</h3>
          <p>
            All content must be accurate, lawful, and appropriate for professional use. We reserve the right to remove content that violates these standards or our community guidelines.
          </p>

          <h3>Copyright and Intellectual Property</h3>
          <p>
            You must have the right to use all content you upload. Do not upload copyrighted material without permission. If you believe your copyright has been violated, contact us immediately.
          </p>

          <h2>Public Nature of Contact Cards</h2>
          <p>
            Contact cards created on WorkInfo are public by design and can be accessed by anyone with your card URL or QR code. Do not include sensitive or private information that you do not want to be publicly accessible.
          </p>

          <h2>Analytics and Tracking</h2>
          <p>
            If you choose to add third-party analytics to your contact card, you are responsible for:
          </p>
          <p>
            • Complying with applicable privacy laws<br>
            • Obtaining necessary user consents<br>
            • Ensuring your analytics provider's terms are followed<br>
            • Using only approved analytics services
          </p>

          <h2>Service Availability</h2>
          <p>
            We strive to provide reliable service but cannot guarantee 100% uptime. We may temporarily suspend or restrict access for maintenance, security reasons, or to comply with legal requirements.
          </p>

          <h2>Pricing and Payments</h2>
          <p>
            WorkInfo currently offers free service for basic contact cards. If we introduce paid features in the future, pricing and payment terms will be clearly communicated and require your separate agreement.
          </p>

          <h2>Prohibited Activities</h2>
          <p>You are prohibited from:</p>
          <p>
            • Reverse engineering or attempting to extract our source code<br>
            • Creating automated accounts or using bots<br>
            • Selling, transferring, or sublicensing your account<br>
            • Using our service for illegal activities<br>
            • Interfering with other users' use of the service<br>
            • Collecting user information without consent
          </p>

          <h2>Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>

          <h2>Termination</h2>
          
          <h3>Termination by You</h3>
          <p>
            You may terminate your account at any time by deleting it through your account settings. Upon termination, your contact card will no longer be accessible.
          </p>

          <h3>Termination by Us</h3>
          <p>
            We may suspend or terminate your account if you violate these Terms, engage in harmful behavior, or for other legitimate business reasons. We will provide notice when reasonably possible.
          </p>

          <h2>Disclaimers and Limitations</h2>
          
          <h3>Service Disclaimers</h3>
          <p>
            Our service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, WorkInfo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold WorkInfo harmless from any claims, damages, or expenses arising from your use of our service or violation of these Terms.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may modify these Terms from time to time. We will notify users of material changes by email or through our service. Continued use after changes constitutes acceptance of the new Terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States. Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:inof@workinfo.me">info@workinfo.me</a><br>
            <strong>Support:</strong> <a href="mailto:info@workinfo.me">info@workinfo.me</a>
          </p>

          <p>
            For general inquiries, visit our <NuxtLink to="/contact">contact page</NuxtLink>.
          </p>

          <h2>Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and WorkInfo regarding your use of our service.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Terms of Service page for WorkInfo
 * Comprehensive terms and conditions for using the professional contact card service
 */

// Get current date for last updated
const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// SEO Meta
useSeoMeta({
  title: 'Terms of Service - WorkInfo',
  description: 'Terms of service and conditions for using WorkInfo\'s professional contact card platform. Read our user agreement and service policies.',
  keywords: 'terms of service, user agreement, terms and conditions, WorkInfo',
  ogTitle: 'Terms of Service - WorkInfo',
  ogDescription: 'Read our terms of service and user agreement for using WorkInfo professional contact cards.',
  ogType: 'website',
  robots: 'index, follow'
})
</script>

<style scoped>
/* All styles are handled by the main CSS file */
/* This ensures consistency with the rest of the application */
</style>
