import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { publicRoutes } from './constants/routes';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom middleware function that combines intl with auth protection
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a public route (including dynamic routes)
  const isPublicRoute = Array.from(publicRoutes).some(route => {
    // Check exact match
    if (pathname === route) return true;
    
    // Check if path starts with a public route (for dynamic routes)
    return pathname.startsWith(route);
  }) ||
  routing.locales.some(locale => {
    if (!pathname.startsWith(`/${locale}`)) return false;
    
    const pathWithoutLocale = pathname.slice(locale.length + 1) || '/';
    return Array.from(publicRoutes).some(route => {
      // Check exact match for localized routes
      if (pathWithoutLocale === route) return true;
      
      // Check if localized path starts with a public route
      return pathWithoutLocale.startsWith(route);
    });
  });

  // Get the token from cookies or headers (server-side only)
  const token = request.cookies.get('access_token')?.value || 
               request.headers.get('Authorization')?.split(' ')[1];
  
  // If it's not a public route and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Continue with the intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
