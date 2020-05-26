import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

export class Api {
  axios: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.axios = axios.create(config);
  }

  request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.request(config);
  }

  get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axios.get(url, config);
  }

  post<T, B, R = AxiosResponse<T>>(url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
    return this.axios.post(url, data, config);
  }

  put<T, B, R = AxiosResponse<T>>(url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
    return this.axios.put(url, data, config);
  }

  success<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  error<T>(error: AxiosError<T>): void {
    throw error;
  }
}
