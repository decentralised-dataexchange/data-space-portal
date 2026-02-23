import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { baseURL } from "../../constants/url";
import { LocalStorageService } from "../../utils/localStorageService";

// Create a global authentication state tracker
// This will be used to prevent API calls after logout
let isAuthenticated = true;

// Token refresh state shared across all instances
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// Initialize auth state based on presence of token on the client (helps after Fast Refresh/HMR)
if (typeof window !== 'undefined') {
  try {
    const hasToken = !!window.localStorage?.getItem('access_token');
    isAuthenticated = hasToken;
  } catch {}
}

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
    // Classify endpoints
    const url = config.url || '';
    const isAuthEndpoint = (
      url.includes('/auth/') ||
      url.includes('/login') ||
      // Frontend route alias
      url.includes('/signup') ||
      // Backend auth endpoints
      url.includes('/onboard/login') ||
      url.includes('/onboard/register') ||
      url.includes('/token/refresh')
    );
    const isPublicEndpoint = url.startsWith('/service/');
    const isProtectedEndpoint = !isAuthEndpoint && !isPublicEndpoint && url.startsWith('/');

    // Track if we attached a token header for this request
    let attachedToken = false;

    // Only try to get token on client side
    if (typeof window !== 'undefined') {
      try {
        // Get access token directly (now stored as a string, not JSON)
        const accessToken = window.localStorage?.getItem("access_token");
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          attachedToken = true;
        } else if (isProtectedEndpoint) {
          // If no token and protected endpoint, decide based on auth flag
          if (!isAuthenticated) {
            const cancelToken = axios.CancelToken.source();
            config.cancelToken = cancelToken.token;
            cancelToken.cancel('No authentication token available');
            return Promise.reject('No authentication token available');
          }
        }
      } catch (error) {
        console.error('Error setting authorization header:', error);
      }
    }

    // No further guard: if a token was attached, allow the request.
    // If no token and it's a protected endpoint, the earlier block already canceled the request.
    return config;
  });

  // Response interceptor for automatic token refresh on 401
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      // Skip refresh for auth endpoints
      const url = originalRequest.url || '';
      if (
        url.includes('/token/refresh') ||
        url.includes('/onboard/login') ||
        url.includes('/onboard/register')
      ) {
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        LocalStorageService.clear();
        setAxiosAuthState(false);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${baseURL}/onboard/token/refresh/`, {
          refresh_token: refreshToken,
        });

        LocalStorageService.updateToken(data);
        const newAccessToken: string = data.access_token;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        LocalStorageService.clear();
        setAxiosAuthState(false);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
};

// Create the standard axios instance
export const axiosInstance = createAxiosInstance();

// Create the array buffer axios instance
export const axiosInstanceWithArrayBufferResType = createAxiosInstance({ isArrayBuffer: true });