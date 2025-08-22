/** biome-ignore-all lint/style/useBlockStatements: ignore */

import { API_CONFIG } from './config'
import { ApiError, createApiError, NetworkError } from './errors'
import type { ApiConfig } from './types'

const DEFAULT_CONFIG: ApiConfig = {
  ...API_CONFIG,
}

export function createApiClient(config: Partial<ApiConfig> = {}) {
  let currentConfig: ApiConfig = { ...DEFAULT_CONFIG, ...config }

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${currentConfig.baseUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      currentConfig.timeout
    )

    const merged: RequestInit = {
      headers: {
        ...currentConfig.headers,
        ...(options.body && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    }

    try {
      const response = await fetch(url, merged)
      clearTimeout(timeoutId)

      if (!response.ok) {
        await handleErrorResponse(response)
      }

      if (response.status === 204) return {} as T

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T
      }

      return (await response.text()) as unknown as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) throw error

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Tempo limite da requisição excedido')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new NetworkError('Erro de conexão com o servidor')
        }
      }

      throw new NetworkError(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido na requisição'
      )
    }
  }

  async function handleErrorResponse(response: Response): Promise<never> {
    let message = `HTTP ${response.status}: ${response.statusText}`
    let data: unknown = null

    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await response.json()
        if (data && typeof data === 'object' && 'message' in data) {
          message = (data as { message: string }).message
        }
      } else {
        const text = await response.text()
        if (text) message = text
      }
    } catch {
      // Ignorar erros de parsing
    }

    throw createApiError(response.status, message, response, data)
  }

  return {
    get: <T>(endpoint: string, params?: Record<string, string>) =>
      request<T>(
        params
          ? `${endpoint}?${new URLSearchParams(params).toString()}`
          : endpoint,
        { method: 'GET' }
      ),

    post: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),

    updateConfig: (newConfig: Partial<ApiConfig>) => {
      currentConfig = { ...currentConfig, ...newConfig }
    },

    getConfig: () => ({ ...currentConfig }),
  }
}

export const apiClient = createApiClient()
