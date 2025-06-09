/**
 * Routes that don't require authentication
 * Used by both middleware.ts and AuthProvider
 */
export const publicRoutes = new Set([
  '/',
  '/en', // Default locale root
  '/en/', // Default locale root with trailing slash
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/data-source/read',
  '/data-source/open-api'
])