import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    const isLoginRequest = requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginRequest && typeof window !== "undefined") {
      Cookies.remove("accessToken");
      localStorage.clear();
      window.location.replace("/login");
    }

    // Redirect to access‑denied page on 403 responses
    if (status === 403 && typeof window !== "undefined") {
      window.location.replace("/access-denied");
    }

    return Promise.reject(error);
  },
);

type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  unwrapResponse?: boolean;
};

export const customInstance = async <T>(
  url: string,
  options?: ApiOptions,
): Promise<T> => {
  const { body, unwrapResponse = false, ...requestOptions } = options ?? {};

  const response = await axiosInstance.request({
    ...requestOptions,
    url,
    data: body,
  });

  const data = response.data;

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
};
