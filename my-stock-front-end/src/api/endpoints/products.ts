/** biome-ignore-all lint/style/useBlockStatements: ignore */
import { apiClient } from '../client'
import { API_CONFIG } from '../config'
import type {
  CreateProductData,
  Product,
  SearchParams,
  UpdateProductData,
} from '../types'
import {
  clearCache,
  createCacheKey,
  getFromCache,
  saveToCache,
  validateProductData,
  withRetry,
} from '../utils'

// Search all products
export async function getAllProducts(): Promise<Product[]> {
  const cacheKey = createCacheKey(API_CONFIG.endpoints.products)

  const cached = getFromCache<Product[]>(cacheKey)
  if (cached) return cached

  try {
    const products = await withRetry<Product[]>(() =>
      apiClient.get(API_CONFIG.endpoints.products)
    )

    saveToCache(cacheKey, products)
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

// Search products by ID
export async function getProductById(id: string): Promise<Product> {
  const cacheKey = createCacheKey(`${API_CONFIG.endpoints.products}/${id}`)

  const cached = getFromCache<Product>(cacheKey)
  if (cached) return cached

  try {
    const product = await withRetry<Product>(() =>
      apiClient.get(`${API_CONFIG.endpoints.products}/${id}`)
    )

    saveToCache(cacheKey, product)
    return product
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    throw error
  }
}

// Create new product
export async function createProduct(
  data: CreateProductData
): Promise<{ message: string }> {
  if (!validateProductData(data)) {
    throw new Error('Dados do produto são inválidos')
  }

  try {
    const result = await withRetry(() =>
      apiClient.post<{ message: string }>(API_CONFIG.endpoints.products, data)
    )

    clearCache()

    return result
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    throw error
  }
}

// Update product
export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<{ updatedProduct: Product; message: string }> {
  if (!validateProductData(data)) {
    throw new Error('Dados do produto são inválidos')
  }

  try {
    const result = await withRetry(() =>
      apiClient.put<{ updatedProduct: Product; message: string }>(
        `${API_CONFIG.endpoints.products}/${id}`,
        data
      )
    )

    clearCache()

    return result
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    throw error
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<{ message: string }> {
  try {
    const result = await withRetry(() =>
      apiClient.delete<{ message: string }>(
        `${API_CONFIG.endpoints.products}/${id}`
      )
    )

    clearCache()

    return result
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    throw error
  }
}

// Search products with filters
export async function searchProducts(params: SearchParams): Promise<Product[]> {
  const cacheParams: Record<string, unknown> = {}
  if (params.page) cacheParams.page = params.page
  if (params.limit) cacheParams.limit = params.limit
  if (params.search) cacheParams.search = params.search
  if (params.sortBy) cacheParams.sortBy = params.sortBy
  if (params.sortOrder) cacheParams.sortOrder = params.sortOrder
  const cacheKey = createCacheKey(API_CONFIG.endpoints.products, cacheParams)

  const cached = getFromCache<Product[]>(cacheKey)
  if (cached) return cached

  try {
    // Convert SearchParams to Record<string, string>
    const queryParams: Record<string, string> = {}
    if (params.page) queryParams.page = params.page.toString()
    if (params.limit) queryParams.limit = params.limit.toString()
    if (params.search) queryParams.search = params.search
    if (params.sortBy) queryParams.sortBy = params.sortBy
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder

    const products = await withRetry<Product[]>(() =>
      apiClient.get(API_CONFIG.endpoints.products, queryParams)
    )

    saveToCache(cacheKey, products)
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos com filtros:', error)
    throw error
  }
}

// Check if product exists
export async function productExists(id: string): Promise<boolean> {
  try {
    await getProductById(id)
    return true
  } catch {
    return false
  }
}

// Count products
export async function countProducts(): Promise<number> {
  try {
    const products = await getAllProducts()
    return products.length
  } catch {
    console.error('Erro ao contar produtos')
    return 0
  }
}

// Object with all product endpoints
export const productsEndpoints = {
  getAll: getAllProducts,
  getById: getProductById,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  search: searchProducts,
  exists: productExists,
  count: countProducts,
}
