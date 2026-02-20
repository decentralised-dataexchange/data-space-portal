"use client";

import Cookies from 'js-cookie';
import { AccessToken, User } from '@/types/auth';

// Cookie expiration in days
const TOKEN_EXPIRATION = 7;
const isSecure = process.env.NODE_ENV === 'production';

export const CookieService = {
  // Set token in both cookie and localStorage for compatibility
  updateToken: (token: AccessToken) => {
    // Store access token as a string
    Cookies.set('access_token', token.access_token, { 
      expires: TOKEN_EXPIRATION,
      path: '/',
      sameSite: 'lax',
      secure: isSecure
    });
    
    // Store refresh token as a string
    Cookies.set('refresh_token', token.refresh_token, { 
      expires: TOKEN_EXPIRATION,
      path: '/',
      sameSite: 'lax',
      secure: isSecure
    });
    
    // Store token expiration info
    Cookies.set('token_expires_in', String(token.expires_in), { 
      expires: TOKEN_EXPIRATION,
      path: '/',
      sameSite: 'lax',
      secure: isSecure
    });
    
    // Also set a lightweight client auth flag used by middleware routing
    Cookies.set('client_auth', '1', {
      expires: TOKEN_EXPIRATION,
      path: '/',
      sameSite: 'lax',
      secure: isSecure
    });
    
    // Also store in localStorage for client-side access (keeping for compatibility)
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    localStorage.setItem('token_expires_in', String(token.expires_in));
    localStorage.setItem('refresh_expires_in', String(token.refresh_expires_in));
    localStorage.setItem('token_type', token.token_type);
  },
  
  // Get token from cookies
  getToken: (): AccessToken | null => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    const expiresIn = Cookies.get('token_expires_in');
    
    if (!accessToken || !refreshToken) return null;
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn ? parseInt(expiresIn) : 3600,
      refresh_expires_in: 86400, // Default refresh expiration time
      token_type: 'Bearer'
    };
  },
  
  // Clear all auth cookies
  clearAuthCookies: () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('token_expires_in', { path: '/' });
    Cookies.remove('client_auth', { path: '/' });
  }
};

export default CookieService;
