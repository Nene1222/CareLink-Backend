// Base API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T> {
  data: T
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { isFormData?: boolean } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const { isFormData, ...restOptions } = options
  
  const config: RequestInit = {
    headers: isFormData ? {} : {
      'Content-Type': 'application/json',
    },
    ...restOptions,
  }
  
  // Don't set Content-Type for FormData, browser will set it with boundary
  if (!isFormData && !config.headers) {
    config.headers = { 'Content-Type': 'application/json' }
  }
  
  if (options.headers) {
    config.headers = { ...config.headers, ...options.headers }
  }

  try {
    const response = await fetch(url, config)
    
    // Handle 204 No Content (for DELETE requests)
    if (response.status === 204) {
      return {} as T
    }

    const json: ApiResponse<T> = await response.json()

    if (!response.ok) {
      throw new ApiError(
        json.error || `HTTP error! status: ${response.status}`,
        response.status,
        json
      )
    }

    return json.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      error
    )
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: { params?: Record<string, string> }) => {
    let url = endpoint
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString()
      url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`
    }
    return apiRequest<T>(url, { method: 'GET' })
  },
  
  post: <T>(endpoint: string, data: any, options?: { isFormData?: boolean }) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      isFormData: data instanceof FormData || options?.isFormData,
    }),
  
  put: <T>(endpoint: string, data: any, options?: { isFormData?: boolean }) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
      isFormData: data instanceof FormData || options?.isFormData,
    }),
  
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
}
