import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const customInstance = <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const { body, ...requestOptions } = options ?? {};

  return axiosInstance
    .request<T>({
      ...requestOptions,
      url,
      data: body,
    } as AxiosRequestConfig)
    .then(({ data }) => {
      // Nest's global ResponseInterceptor wraps successful responses as
      // { statusCode, message, data }; return the DTO Orval generated from Swagger.
      if (
        data &&
        typeof data === "object" &&
        "statusCode" in data &&
        "data" in data
      ) {
        return data.data as T;
      }

      return data as T;
    });
};
