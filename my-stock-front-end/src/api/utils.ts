/** biome-ignore-all lint/style/useBlockStatements: ignore */

import { API_CONFIG } from './config'
import { isClientError } from './errors'
import type {
  CacheItem,
  CreateProductData,
  RetryOptions,
  UpdateProductData,
} from './types'

const cache = new Map<string, CacheItem<unknown>>()

export function buildUrl(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  if (!params || Object.keys(params).length === 0) {
    return `${baseUrl}${endpoint}`
  }

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value))
  })

  return `${baseUrl}${endpoint}?${searchParams.toString()}`
}

export function createCacheKey(
  endpoint: string,
  params?: Record<string, unknown>
): string {
  if (!params) return endpoint
  return `${endpoint}-${JSON.stringify(params)}`
}

export function getFromCache<T>(key: string): T | null {
  const item = cache.get(key) as CacheItem<T> | undefined
  if (!item) return null

  const now = Date.now()
  if (now > item.expires) {
    cache.delete(key)
    return null
  }

  return item.data
}

export function saveToCache<T>(
  key: string,
  data: T,
  ttl = API_CONFIG.cache.defaultTtl
): void {
  if (cache.size >= API_CONFIG.cache.maxSize) {
    const firstKey = cache.keys().next().value
    if (firstKey) cache.delete(firstKey)
  }

  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
    expires: Date.now() + ttl,
  }

  cache.set(key, item)
}

export function clearCache(): void {
  cache.clear()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = API_CONFIG.retry
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (
        error instanceof Error &&
        'status' in error &&
        isClientError(error.status as number)
      ) {
        throw error
      }

      if (attempt === options.attempts) {
        break
      }

      const delayMs = options.delay * options.backoff ** (attempt - 1)
      await delay(delayMs)
    }
  }

  throw lastError
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function validateProductData(
  data: CreateProductData | UpdateProductData
): boolean {
  if ('name' in data && data.name) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      return false
    }
  }

  if ('price' in data && data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price <= 0) {
      return false
    }
  }

  if ('quantity' in data && data.quantity !== undefined) {
    if (
      typeof data.quantity !== 'number' ||
      data.quantity < 0 ||
      !Number.isInteger(data.quantity)
    ) {
      return false
    }
  }

  return true
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
