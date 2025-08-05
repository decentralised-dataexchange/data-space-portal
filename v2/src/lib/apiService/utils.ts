import { publicRoutes } from "@/constants/routes";

export function getPathnameWithoutLocale(pathname: string): string {
    return "/" + pathname.split("/").slice(2).join("/");
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