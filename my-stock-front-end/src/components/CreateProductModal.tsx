/** biome-ignore-all lint/correctness/useUniqueElementIds: ignore */
/** biome-ignore-all lint/suspicious/noGlobalIsNan: ignore */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createProduct } from '@/api/endpoints'
import type { CreateProductData } from '@/api/types'
import { Input, Textarea } from './Input'
import { Label } from './Label'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

// Schema validation
const createProductSchema = z.object({
  name: z.string().min(3).max(50, 'O nome deve ter no máximo 50 caracteres'),
  description: z
    .string()
    .max(255, 'A descrição deve ter no máximo 255 caracteres')
    .optional(),
  price: z
    .number()
    .min(0, 'O preço deve ser maior ou igual a zero')
    .positive('Preço deve ser maior que zero')
    .max(999999.99, 'Preço deve ser menor que R$ 999.999,99'),
  quantity: z
    .number()
    .int()
    .min(0, 'A quantidade deve ser maior ou igual a zero')
    .max(9999, 'Quantidade deve ser menor ou igual a 9999.999'),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

interface CreateProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateProductModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const [priceInput, setPriceInput] = useState(currencyFormatter.format(0))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
      clearErrors()
      setPriceInput('')
    }
  }, [open, reset, clearErrors])

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      setIsSubmitting(true)

      const productData: CreateProductData = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: Number(data.price),
        quantity: Number(data.quantity),
      }

      await createProduct(productData)

      onOpenChange(false)
      onSuccess?.()

      alert('Produto criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar produto:', error)

      if (error instanceof Error) {
        alert(`Erro ao criar produto: ${error.message}`)
      } else {
        alert('Erro desconhecido ao criar produto')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isSubmitting) {
      return
    }

    onOpenChange(false)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '')

    if (onlyDigits === '') {
      setPriceInput('')
      setValue('price', 0, { shouldValidate: true })
      return
    }

    const numberValue = Number(onlyDigits) / 100
    setPriceInput(currencyFormatter.format(numberValue))
    setValue('price', numberValue, { shouldValidate: true })
    clearErrors('price')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-400">
        <DialogHeader>
          <DialogTitle>Criar Novo produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do produto que deseja adicionar ao estoque.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product name */}
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Produto
            </Label>
            <Input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Digite o nome do produto"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Product description */}
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição
            </Label>
            <Textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              placeholder="Digite uma descrição opcional"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price and quantity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <Label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preço
              </Label>
              <Input
                type="text"
                id="price"
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="0,00"
                disabled={isSubmitting}
                value={priceInput}
                onChange={handlePriceChange}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <Label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantidade
              </Label>
              <Input
                {...register('quantity', { valueAsNumber: true })}
                type="number"
                id="quantity"
                min="0"
                max="999999"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="0"
                disabled={isSubmitting}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value, 10)
                  if (!isNaN(value)) {
                    setValue('quantity', value)
                  }
                }}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Criando...
                </>
              ) : (
                'Criar Produto'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
