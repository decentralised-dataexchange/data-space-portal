import { publicRoutes } from "@/constants/routes";

export function getPathnameWithoutLocale(pathname: string): string {
    return "/" + pathname.split("/").slice(2).join("/");
};

export function isPublicRoute(pathname: string): boolean {
    return publicRoutes.has(getPathnameWithoutLocale(pathname))
}