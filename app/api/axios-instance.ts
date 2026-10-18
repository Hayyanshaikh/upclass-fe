import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const customInstance = <T>(
  url: string,
  options?: RequestInit & { unwrapResponse?: boolean },
): Promise<T> => {
  const { body, unwrapResponse = false, ...requestOptions } = options ?? {};

  return axiosInstance
    .request<T>({
      ...requestOptions,
      url,
      data: body,
    } as AxiosRequestConfig)
    .then(({ data }) => {
      // Generated response DTOs include the API envelope by default.
      if (
        unwrapResponse &&
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
