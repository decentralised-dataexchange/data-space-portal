import { publicRoutes } from "@/constants/routes";
import { locales } from "@/constants/il8n";

export function getLocaleFromPathname(pathname: string): string | null {
    if (!pathname) return null;
    const match = pathname.match(new RegExp(`^/(${locales.join('|')})(?:/|$)`));
    return match ? match[1] : null;
}

export function getPathnameWithoutLocale(pathname: string): string {
    // If pathname starts with a supported locale, strip it; otherwise return as-is
    const locale = getLocaleFromPathname(pathname);
    if (locale) {
        const withoutLocale = pathname.slice(locale.length + 1);
        return withoutLocale ? (withoutLocale.startsWith('/') ? withoutLocale : '/' + withoutLocale) : '/';
    }
    return pathname || '/';
};

export function isPublicRoute(pathname: string): boolean {
    const pathWithoutLocale = getPathnameWithoutLocale(pathname);
    
    // Check for exact match first
    if (publicRoutes.has(pathWithoutLocale)) {
        return true;
    }
    
    // Handle dynamic routes like /data-source/read/123
    if (pathWithoutLocale.startsWith('/data-source/read/')) {
        // Check if there's a dynamic segment after /data-source/read/
        const segments = pathWithoutLocale.split('/');
        if (segments.length === 4 && segments[1] === 'data-source' && segments[2] === 'read') {
            // This is a dynamic route /data-source/read/:id
            return publicRoutes.has('/data-source/read');
        }
    }
    
    return false;
}