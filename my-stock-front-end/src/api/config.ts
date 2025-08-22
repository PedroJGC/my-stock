// src/api/config.ts
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: {},
  cache: {
    defaultTtl: 5 * 60 * 1000,
    maxSize: 100,
  },
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2,
  },
  endpoints: {
    products: '/products',
  },
} as const
