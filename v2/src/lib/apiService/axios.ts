import axios from "axios";
import { baseURL } from "../../constants/url";
import { AxiosRequestConfig } from "axios";

// Create a function to get a configured axios instance that works in both client and server
export const createAxiosInstance = (options: { isArrayBuffer?: boolean } = {}) => {
  // Base config that works on both server and client
  const config: AxiosRequestConfig = {
    baseURL,
    withCredentials: true,
    headers: {}
  };

  // Add response type if needed
  if (options.isArrayBuffer) {
    config.responseType = "arraybuffer";
  }

  // Create the instance
  const instance = axios.create(config);

  // Add request interceptor to set auth headers on the client side
  instance.interceptors.request.use((config) => {
    // Only try to get token on client side
    if (typeof window !== 'undefined') {
      try {
        const tokenString = window.localStorage?.getItem("Token");
        if (tokenString) {
          // Parse the token from localStorage which is stored as a JSON string
          const tokenObj = JSON.parse(tokenString);
          const accessToken = tokenObj.access_token;
          
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
      } catch (error) {
        console.error('Error parsing token for request:', error);
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