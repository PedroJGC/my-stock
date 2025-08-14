import { app } from '@/app'
import { create } from './controllers/products-controller'

export async function appRoutes() {
  app.post('/products', create)
}
