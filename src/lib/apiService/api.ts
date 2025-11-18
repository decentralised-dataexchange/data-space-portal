import { AxiosRequestConfig } from 'axios';
import { axiosInstance } from "@/lib/apiService/axios";

type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;

export const api = {
  get: <T>(url: string, config?: RequestConfig) => 
    axiosInstance.get<T>(url, config),
  
  post: <T>(url: string, body: unknown, config?: RequestConfig) => 
    axiosInstance.post<T>(url, body, config),
  
  patch: <T>(url: string, body: unknown, config?: RequestConfig) => 
    axiosInstance.patch<T>(url, body, config),
  
  put: <T>(url: string, body: unknown, config?: RequestConfig) => 
    axiosInstance.put<T>(url, body, config),
  
  delete: <T>(url: string, config?: RequestConfig) => 
    axiosInstance.delete<T>(url, config),
};