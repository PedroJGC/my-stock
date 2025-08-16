/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: ignore rule */
import { PrismaClient } from '@prisma/client'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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

// Schema para atualização (campos opcionais)
const productUpdateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero').optional(),
  quantity: z
    .number()
    .int()
    .min(0, 'Quantidade deve ser um número inteiro não negativo')
    .optional(),
})

const productParamsSchema = z.object({
  id: z.uuid('ID deve ser um UUID válido'),
})

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Validar os dados recebidos
  const { name, description, price, quantity } = productBodySchema.parse(
    request.body
  )

  try {
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
}

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const products = await prisma.product.findMany()
    return reply.status(200).send(products)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Dados inválidos',
      })
    }
  }
}

export async function getProductById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = productParamsSchema.parse(request.params)

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return reply.status(404).send({
        message: 'Produto não encontrado',
      })
    }

    return reply.status(200).send(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Dados inválidos',
      })
    }
  }
}

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = productParamsSchema.parse(request.params)
    const updateData = productUpdateSchema.parse(request.body)

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return reply.status(404).send({
        message: 'Produto não encontrado',
      })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return reply.status(200).send({
      updatedProduct,
      message: 'Produto atualizado com sucesso',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Dados inválidos',
      })
    }
  }
}

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = productParamsSchema.parse(request.params)

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return reply.status(404).send({
        message: 'Produto não encontrado',
      })
    }

    await prisma.product.delete({
      where: { id },
    })

    return reply.status(200).send({
      message: 'Produto excluído com sucesso',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Dados inválidos',
      })
    }
  }
}
