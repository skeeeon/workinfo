<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <Logo />
          <p class="footer-description">
            Digital business cards for modern professionals. 
            Create, customize, and share your professional identity.
          </p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h3 class="link-title">Product</h3>
            <div class="links">
              <NuxtLink to="/" class="footer-link">Home</NuxtLink>
              <NuxtLink to="/register" class="footer-link">Sign Up</NuxtLink>
              <NuxtLink to="/login" class="footer-link">Login</NuxtLink>
            </div>
          </div>
          
          <div class="link-group">
            <h3 class="link-title">Legal</h3>
            <div class="links">
              <NuxtLink to="/privacy" class="footer-link">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms" class="footer-link">Terms of Service</NuxtLink>
              <NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">
          © {{ new Date().getFullYear() }} Hivecard. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
/**
 * Footer component - Fixed to only link to existing routes
 */
</script>

<style scoped>
.footer {
  background-color: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border-primary);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  max-width: 400px;
}

.footer-description {
  color: var(--color-content-secondary);
  margin-top: 1rem;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
}

.link-group {
  min-width: 150px;
}

.link-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--color-content-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-primary);
  text-align: center;
}

.copyright {
  color: var(--color-content-tertiary);
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-links {
    justify-content: flex-start;
  }
  
  .link-group {
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
