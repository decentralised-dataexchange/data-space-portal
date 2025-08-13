import axios from "axios";
import { baseURL } from "../../constants/url";
import { AxiosRequestConfig } from "axios";

// Create a global authentication state tracker
// This will be used to prevent API calls after logout
let isAuthenticated = true;

// Function to set authentication state
export const setAxiosAuthState = (authState: boolean) => {
  isAuthenticated = authState;
};

// Create a function to get a configured axios instance that works in both client and server
export const createAxiosInstance = (options: { isArrayBuffer?: boolean } = {}) => {
  // Base config that works on both server and client
  const config: AxiosRequestConfig = {
    baseURL,
    withCredentials: true,
    headers: {},
    // Fail fast if upstream API is slow/unreachable
    timeout: 15000
  };

  // Add response type if needed
  if (options.isArrayBuffer) {
    config.responseType = "arraybuffer";
  }

  // Create the instance
  const instance = axios.create(config);

  // Add request interceptor to set auth headers on the client side
  instance.interceptors.request.use((config) => {
    // Check if we're in a logged out state and this is an API request
    // Skip this check for login/authentication endpoints
    const isAuthEndpoint = config.url?.includes('/auth/') || config.url?.includes('/login');
    
    if (!isAuthenticated && !isAuthEndpoint && config.url?.startsWith('/')) {
      // Cancel the request if we're not authenticated
      const cancelToken = axios.CancelToken.source();
      config.cancelToken = cancelToken.token;
      cancelToken.cancel('Operation canceled due to logout');
      console.log('Request canceled due to logout:', config.url);
      return Promise.reject('Request canceled due to logout');
    }
    
    // Only try to get token on client side
    if (typeof window !== 'undefined') {
      try {
        // Get access token directly (now stored as a string, not JSON)
        const accessToken = window.localStorage?.getItem("access_token");
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else if (!isAuthEndpoint && config.url?.startsWith('/')) {
          // If no token and not an auth endpoint, cancel the request
          const cancelToken = axios.CancelToken.source();
          config.cancelToken = cancelToken.token;
          cancelToken.cancel('No authentication token available');
          console.log('Request canceled due to missing token:', config.url);
          return Promise.reject('No authentication token available');
        }
      } catch (error) {
        console.error('Error setting authorization header:', error);
      }
    }
    return config;
  });

  return instance;
};

// Create the standard axios instance
export const axiosInstance = createAxiosInstance();

// Create the array buffer axios instance
export const axiosInstanceWithArrayBufferResType = createAxiosInstance({ isArrayBuffer: true });