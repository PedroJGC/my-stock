import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { app } from '@/app'

const prisma = new PrismaClient()

// Schema de validação
const productBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  quantity: z
    .number()
    .int()
    .min(0, 'Quantidade deve ser um número inteiro não negativo'),
})

export async function appRoutes() {
  app.post('/products', async (request, reply) => {
    try {
      // Validar os dados recebidos
      const { name, description, price, quantity } = productBodySchema.parse(
        request.body
      )

      // Criar produto no banco de dados
      await prisma.product.create({
        data: {
          name,
          description,
          price,
          quantity,
        },
      })

      // Retornar o produto criado com status 201
      return reply.status(201).send({
        message: 'Produto criado com sucesso!',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Dados inválidos',
        })
      }
    }
  })
}
