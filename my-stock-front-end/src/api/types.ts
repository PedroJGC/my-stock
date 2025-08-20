// src/api/types.ts

// Tipos de entidades
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  createdAt: string
  updatedAt: string
}

// Tipos para criação
export interface CreateProductData {
  name: string
  description?: string
  price: number
  quantity: number
}

// Tipos para atualização (campos opcionais)
export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  quantity?: number
}

// Configuração da API
export interface ApiConfig {
  baseUrl: string
  timeout: number
  headers: Record<string, string>
}

// Resposta padrão da API
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  status?: number
}

// Parâmetros de busca
export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Cache item
export interface CacheItem<T> {
  data: T
  timestamp: number
  expires: number
}

// Opções de retry
export interface RetryOptions {
  attempts: number
  delay: number
  backoff: number
}
