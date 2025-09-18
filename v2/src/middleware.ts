import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { publicRoutes } from './constants/routes';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom middleware function that combines intl with auth protection
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helpers to support locale-prefixed and dynamic public routes
  const getPathWithoutLocale = (p: string) => {
    for (const locale of routing.locales) {
      if (p === `/${locale}` || p.startsWith(`/${locale}/`)) {
        return p.slice(locale.length + 1) || '/';
      }
    }
    return p;
  };
  const matchesPublicRoute = (path: string) => {
    for (const route of publicRoutes) {
      if (route === '/') {
        if (path === '/') return true;
        continue;
      }
      if (route.includes('[')) {
        const base = route.split('/[')[0];
        if (path === base || path.startsWith(base + '/')) return true;
        continue;
      }
      if (path === route || path.startsWith(route + '/')) return true;
    }
    return false;
  };

  const pathNoLocale = getPathWithoutLocale(pathname);
  const isPublicRoute = matchesPublicRoute(pathname) || matchesPublicRoute(pathNoLocale);

  // Get the token from cookies or headers (server-side only)
  const token = request.cookies.get('access_token')?.value || 
               request.headers.get('Authorization')?.split(' ')[1];
  
  // Determine locale and normalized path (strip locale prefix if present)
  let currentLocale: string | null = null;
  let pathWithoutLocale = pathname;
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      currentLocale = locale;
      pathWithoutLocale = pathname.slice(locale.length + 1) || '/';
      break;
    }
  }

  // If user is already authenticated and visiting auth pages, redirect to /start
  const isAuthRoute = ['/login', '/signup'].some(route => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`));
  if (token && isAuthRoute) {
    const redirectUrl = new URL(currentLocale ? `/${currentLocale}/start` : '/start', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If it's not a public route and there's no token, redirect to localized login
  if (!isPublicRoute && !token) {
    const loginPath = currentLocale ? `/${currentLocale}/login` : '/login';
    const loginUrl = new URL(loginPath, request.url);
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
