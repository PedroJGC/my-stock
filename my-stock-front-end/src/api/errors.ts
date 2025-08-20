// src/api/errors.ts

// Classe base para erros da API
export class ApiError extends Error {
  public status: number
  public response?: Response
  public data?: unknown

  constructor(
    status: number,
    message: string,
    response?: Response,
    data?: unknown
  ) {
    super(message)
    this.status = status
    this.response = response
    this.data = data
    this.name = 'ApiError'

    // Manter o stack trace no V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

// Erros específicos para diferentes cenários
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Função para criar erro de API baseado no status
export function createApiError(
  status: number,
  message: string,
  response?: Response,
  data?: unknown
): ApiError {
  return new ApiError(status, message, response, data)
}

// Função para criar erro de rede
export function createNetworkError(message: string): NetworkError {
  return new NetworkError(message)
}

// Função para tratar erros da API
export function handleApiError(error: unknown): never {
  if (error instanceof ApiError || error instanceof NetworkError) {
    throw error
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      throw createNetworkError('Tempo limite da requisição excedido')
    }
    if (error.message.includes('Failed to fetch')) {
      throw createNetworkError('Erro de conexão com o servidor')
    }
    throw createNetworkError(error.message)
  }

  throw createNetworkError('Erro desconhecido na requisição')
}

// Função para verificar se é erro de cliente (4xx)
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500
}

// Função para verificar se é erro de servidor (5xx)
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}
