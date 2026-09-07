const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";

interface ApiRequestOptions extends RequestInit {
  token?: string;
  isFormData?: boolean;
}

interface ApiErrorResponse {
  message?: string;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    token,
    headers,
    isFormData,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
    }
  );

  let data: T & ApiErrorResponse;

  try {
    data = (await response.json()) as T &
      ApiErrorResponse;
  } catch {
    throw new Error(
      "Invalid response received from KARYO API"
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ?? "KARYO API request failed"
    );
  }

  return data;
};