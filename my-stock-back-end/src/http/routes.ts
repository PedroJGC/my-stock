import { app } from '@/app'
import {
  create,
  listProductById,
  listProducts,
} from './controllers/products-controller'

export async function appRoutes() {
  app.post('/products', create)
  app.get('/products', listProducts)
  app.get('/products/:id', listProductById)
}
