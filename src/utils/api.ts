// API configuration and utilities

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8081';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem('capy-vocab-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.accessToken || null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

// Get refresh token from localStorage
const getRefreshToken = (): string | null => {
  try {
    const authData = localStorage.getItem('capy-vocab-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.refreshToken || null;
    }
  } catch (error) {
    console.error('Error getting refresh token:', error);
  }
  return null;
};

// Refresh access token
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh failed, clear auth
        localStorage.removeItem('capy-vocab-auth');
        return null;
      }

      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data.metaData;

      // Update tokens in localStorage
      const authData = localStorage.getItem('capy-vocab-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.state.accessToken = accessToken;
        parsed.state.refreshToken = newRefreshToken;
        localStorage.setItem('capy-vocab-auth', JSON.stringify(parsed));
      }

      return accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('capy-vocab-auth');
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Create headers with authorization
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// API Response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  metaData: T;
}

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<ApiResponse<T>> => {
  // Ensure endpoint starts with /
  const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${apiEndpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && retry && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry request with new token
      return apiRequest<T>(endpoint, options, false);
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
      }
    } catch {
      // If response is not JSON, use status text
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// GET request
export const apiGet = <T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  return apiRequest<T>(url, { method: 'GET' });
};

// POST request
export const apiPost = <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT request
export const apiPut = <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PATCH request
export const apiPatch = <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE request
export const apiDelete = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};

// UPLOAD (FormData)
export const apiUpload = async <T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> => {
  const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8081'}${apiEndpoint}`;
  const token = getAuthToken();
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    let errorMessage = `API upload failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};
