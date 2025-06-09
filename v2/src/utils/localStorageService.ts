import { User } from "@/types/auth";
import { AccessToken } from "@/types/auth";
import CookieService from "./cookieService";

export const LocalStorageService = {
  updateToken: (token: AccessToken) => {
    // Use CookieService to set token in both cookie and localStorage
    CookieService.updateToken(token);
  },
  updateUser: (user: User) => {
    localStorage.setItem("User", JSON.stringify(user));
  },
  getUser: (): User => {
    return JSON.parse(localStorage.getItem("User")!);
  },
  getAccessToken: () => {
    try {
      const token = JSON.parse(localStorage.getItem("Token")!);
      return token?.access_token;
    } catch (error) {
      return null;
    }
  },
  getRefreshToken: () => {
    try {
      const token = JSON.parse(localStorage.getItem("Token")!);
      return token?.refresh_token;
    } catch (error) {
      return null;
    }
  },
  clear: () => {
    // Clear cookies
    CookieService.clearAuthCookies();
    
    // Clear localStorage items
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("Avatar");
    localStorage.removeItem("cachedCoverImage");
    localStorage.removeItem("cachedLogoImage");
  },
  updateProfilePic: (avatar: any) => {
    localStorage.setItem("Avatar", avatar);
  },
  getUserProfilePic: (): any => {
    return localStorage.getItem("Avatar")!;
  },
};
