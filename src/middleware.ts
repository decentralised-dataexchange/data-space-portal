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
  // Use a lightweight client-auth cookie to reflect client-side logout instantly
  const clientAuth = request.cookies.get('client_auth')?.value;

  // Helper: light JWT exp validation without external libs
  const isValidJwt = (jwt: string | null | undefined): boolean => {
    if (!jwt) return false;
    const parts = jwt.split('.');
    if (parts.length !== 3) return false;
    try {
      const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')) as any;
      const exp = payload?.exp;
      if (!exp || typeof exp !== 'number') return false;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch {
      return false;
    }
  };
  const isAuthenticated = Boolean(token && clientAuth && isValidJwt(token));
  
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
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL(currentLocale ? `/${currentLocale}/start` : '/start', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If it's not a public route and user is not authenticated, redirect to localized login
  if (!isPublicRoute && !isAuthenticated) {
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
