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
  getUser: (): User | null => {
    const userStr = localStorage.getItem("User");
    return userStr ? JSON.parse(userStr) : null;
  },
  getToken: () => {
    try {
      // First try to get from localStorage
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const expiresIn = localStorage.getItem("token_expires_in");
      const refreshExpiresIn = localStorage.getItem("refresh_expires_in");
      const tokenType = localStorage.getItem("token_type");
      
      if (accessToken && refreshToken) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn ? parseInt(expiresIn) : 3600,
          refresh_expires_in: refreshExpiresIn ? parseInt(refreshExpiresIn) : 86400,
          token_type: tokenType || 'Bearer'
        };
      }
      
      // If not in localStorage, try to get from cookies via CookieService
      return CookieService.getToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  getAccessToken: () => {
    try {
      return localStorage.getItem("access_token");
    } catch (error) {
      return null;
    }
  },
  getRefreshToken: () => {
    try {
      return localStorage.getItem("refresh_token");
    } catch (error) {
      return null;
    }
  },
  clear: () => {
    // Clear cookies
    CookieService.clearAuthCookies();
    
    // Clear localStorage items
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_in");
    localStorage.removeItem("refresh_expires_in");
    localStorage.removeItem("token_type");
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
