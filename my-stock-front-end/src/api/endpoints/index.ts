// src/api/endpoints/index.ts

// Importar cliente e configurações
import { apiClient, createApiClient } from '../client'
import { API_CONFIG } from '../config'
// Importar erros
import {
  ApiError,
  createApiError,
  createNetworkError,
  handleApiError,
  isClientError,
  isServerError,
  NetworkError,
} from '../errors'
// Importar tipos principais
import type {
  ApiConfig,
  ApiResponse,
  CacheItem,
  CreateProductData,
  Product,
  RetryOptions,
  SearchParams,
  UpdateProductData,
} from '../types'
// Importar utilitários
import {
  buildUrl,
  clearCache,
  createCacheKey,
  debounce,
  formatDate,
  formatPrice,
  getFromCache,
  saveToCache,
  validateProductData,
  withRetry,
} from '../utils'
// Importar funções de produtos
import {
  countProducts,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  productExists,
  productsEndpoints,
  searchProducts,
  updateProduct,
} from './products'

// Exportar funções de produtos individualmente
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  productExists,
  countProducts,
}

// Exportar objeto com todas as funções de produtos
export { productsEndpoints }

// Exportar utilitários
export {
  buildUrl,
  createCacheKey,
  getFromCache,
  saveToCache,
  clearCache,
  withRetry,
  formatPrice,
  formatDate,
  validateProductData,
  debounce,
}

// Exportar tipos
export type {
  Product,
  CreateProductData,
  UpdateProductData,
  ApiConfig,
  ApiResponse,
  SearchParams,
  CacheItem,
  RetryOptions,
}

// Exportar classes de erro
export {
  ApiError,
  NetworkError,
  createApiError,
  createNetworkError,
  handleApiError,
  isClientError,
  isServerError,
}

// Exportar cliente e configurações
export { apiClient, createApiClient, API_CONFIG }

// Exportar como padrão um objeto com todas as funcionalidades
export default {
  // Produtos
  products: productsEndpoints,

  // Cliente
  client: apiClient,

  // Utilitários
  utils: {
    buildUrl,
    createCacheKey,
    getFromCache,
    saveToCache,
    clearCache,
    withRetry,
    formatPrice,
    formatDate,
    validateProductData,
    debounce,
  },

  // Configurações
  config: API_CONFIG,

  // Erros
  errors: {
    ApiError,
    NetworkError,
    createApiError,
    createNetworkError,
    handleApiError,
    isClientError,
    isServerError,
  },
}
