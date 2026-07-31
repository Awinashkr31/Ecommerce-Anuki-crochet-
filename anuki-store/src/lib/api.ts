const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiOptions extends RequestInit {
  // Keeping this for backwards compatibility just in case, but no longer used for session cookies
  token?: string;
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const isFormData = rest.body instanceof FormData;
  const mergedHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: mergedHeaders,
    credentials: 'include', // Crucial for sending HttpOnly session cookies
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API Error: ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return null as T;

  return res.json();
}

// Convenience methods
export const apiGet = <T = any>(endpoint: string, options?: ApiOptions) =>
  api<T>(endpoint, { method: 'GET', ...options });

export const apiPost = <T = any>(endpoint: string, body: any, options?: ApiOptions) =>
  api<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });

export const apiPut = <T = any>(endpoint: string, body: any, options?: ApiOptions) =>
  api<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });

export const apiDelete = <T = any>(endpoint: string, options?: ApiOptions) =>
  api<T>(endpoint, { method: 'DELETE', ...options });

export const apiUpload = <T = any>(endpoint: string, body: FormData, options?: ApiOptions) =>
  api<T>(endpoint, { method: 'POST', body, ...options });
