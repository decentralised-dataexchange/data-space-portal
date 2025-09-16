export const clearAllBrowserStorage = async () => {
  if (typeof window === 'undefined') return;

  try {
    // Best-effort: clear via our service first (removes known keys and auth cookies)
    try {
      const { LocalStorageService } = await import('@/utils/localStorageService');
      LocalStorageService.clear();
    } catch (e) {
      // no-op
    }

    // Clear localStorage and sessionStorage entirely
    try {
      window.localStorage.clear();
    } catch (e) {
      // ignore
    }
    try {
      window.sessionStorage.clear();
    } catch (e) {
      // ignore
    }

    // Clear all cookies accessible to JS (HttpOnly cookies cannot be cleared from JS)
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // Remove cookie for root path
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        // Attempt removal without path (fallback)
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      }
    } catch (e) {
      // ignore
    }

    // Clear Cache Storage (service worker caches)
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.allSettled(keys.map((key) => caches.delete(key)));
      }
    } catch (e) {
      // ignore
    }
  } catch (e) {
    // Last resort ignore
  }
};
