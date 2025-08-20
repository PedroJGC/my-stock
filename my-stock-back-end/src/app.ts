import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

// Registrar o plugin de CORS
app.register(import('@fastify/cors'), {
  origin: ['http://localhost:5173'], // URL do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(appRoutes)
