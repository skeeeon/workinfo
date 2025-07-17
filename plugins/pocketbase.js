/**
 * PocketBase Universal Plugin
 * Initializes a PocketBase client that works on both server and client.
 */
import PocketBase from 'pocketbase';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl);

  // Disable auto-cancellation to prevent issues
  pb.autoCancellation(false);

  // Client-side specific logic
  if (import.meta.client) {
    // Load initial auth state from cookie
    pb.authStore.loadFromCookie(document.cookie);

    // Listen for auth changes to persist them in the cookie
    pb.authStore.onChange((token, model) => {
      const authCookie = pb.authStore.exportToCookie({
        secure: location.protocol === 'https:',
        sameSite: 'Lax',
        httpOnly: false, // Must be false for client-side access
      });
      document.cookie = authCookie;
    });

    // Try to refresh auth token if it's valid
    if (pb.authStore.isValid) {
      pb.collection('users').authRefresh().catch(() => {
        pb.authStore.clear(); // Clear if refresh fails
      });
    }
  }

  // Add a server-side hook to share the cookie from the request
  nuxtApp.hook('app:rendered', () => {
    if (!import.meta.server) return;
    const cookie = pb.authStore.exportToCookie({ httpOnly: false });
    const headers = useRequestHeaders(['cookie']);
    headers.cookie = headers.cookie ? `${headers.cookie}; ${cookie}` : cookie;
  });

  return {
    provide: {
      pb
    }
  };
});
