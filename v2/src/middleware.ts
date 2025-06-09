import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { publicRoutes } from './constants/routes';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom middleware function that combines intl with auth protection
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.has(pathname) || 
    routing.locales.some(locale => 
      pathname.startsWith(`/${locale}`) && 
      publicRoutes.has(pathname.replace(`/${locale}`, '')) || 
      publicRoutes.has(pathname)
    );

  // Get the token from cookies or headers (server-side only)
  const token = request.cookies.get('Token')?.value || 
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
