import { app } from '@/app'
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
} from './controllers/products-controller'

export async function appRoutes() {
  app.post('/products', createProduct)
  app.get('/products', listProducts)
  app.get('/products/:id', getProductById)
  app.put('/products/:id', updateProduct)
}
