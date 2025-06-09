"use client";

import Cookies from 'js-cookie';
import { AccessToken, User } from '@/types/auth';

// Cookie expiration in days
const TOKEN_EXPIRATION = 7;

export const CookieService = {
  // Set token in both cookie and localStorage for compatibility
  updateToken: (token: AccessToken) => {
    // Store in cookie for server-side middleware access
    Cookies.set('Token', JSON.stringify(token), { 
      expires: TOKEN_EXPIRATION,
      path: '/',
      sameSite: 'strict'
    });
    
    // Also store in localStorage for client-side access
    localStorage.setItem('Token', JSON.stringify(token));
  },
  
  // Get token from cookie
  getToken: (): AccessToken | null => {
    const tokenStr = Cookies.get('Token');
    return tokenStr ? JSON.parse(tokenStr) : null;
  },
  
  // Clear all auth cookies
  clearAuthCookies: () => {
    Cookies.remove('Token', { path: '/' });
  }
};

export default CookieService;
