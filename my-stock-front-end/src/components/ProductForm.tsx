/** biome-ignore-all lint/correctness/useUniqueElementIds: ignore */
/** biome-ignore-all lint/suspicious/noGlobalIsNan: ignore */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CreateProductData, Product, UpdateProductData } from '@/api/types'
import { Input, Textarea } from './Input'
import { Label } from './Label'
import { Button } from './ui/button'

// Schema base para produtos
const baseProductSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres'),
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
    .max(9999, 'Quantidade deve ser menor ou igual a 9999'),
})

// Schema para criação (todos os campos obrigatórios)
const createProductSchema = baseProductSchema

// Schema para atualização (campos opcionais)
const updateProductSchema = baseProductSchema.partial()

type CreateFormData = z.infer<typeof createProductSchema>
type UpdateFormData = z.infer<typeof updateProductSchema>

interface ProductFormProps {
  mode: 'create' | 'update'
  initialData?: Product | null
  isSubmitting: boolean
  onSubmit:
    | ((data: CreateProductData) => Promise<void>)
    | ((data: UpdateProductData) => Promise<void>)
  onCancel: () => void
  submitButtonText?: string
}

export function ProductForm({
  mode,
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
  submitButtonText,
}: ProductFormProps) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const [priceInput, setPriceInput] = useState('')

  // Usar diferentes tipos baseado no modo
  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    },
  })

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    },
  })

  const form = mode === 'create' ? createForm : updateForm

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    clearErrors,
  } = form

  // Efeito para popular os dados quando há dados iniciais (modo update)
  useEffect(() => {
    if (mode === 'update' && initialData) {
      setValue('name', initialData.name)
      setValue('description', initialData.description || '')
      setValue('price', initialData.price)
      setValue('quantity', initialData.quantity)
      setPriceInput(currencyFormatter.format(initialData.price))
    } else if (mode === 'create') {
      // Reset para valores padrão no modo create
      reset({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
      })
      setPriceInput('')
    }
  }, [mode, initialData, setValue, reset, currencyFormatter])

  // Reset quando cancelar
  useEffect(() => {
    return () => {
      reset()
      clearErrors()
      setPriceInput('')
    }
  }, [reset, clearErrors])

  const handleFormSubmit = async (data: CreateFormData | UpdateFormData) => {
    if (mode === 'create') {
      const createData: CreateProductData = {
        name: (data as CreateFormData).name.trim(),
        description: (data as CreateFormData).description?.trim() || undefined,
        price: Number((data as CreateFormData).price),
        quantity: Number((data as CreateFormData).quantity),
      }
      await (onSubmit as (data: CreateProductData) => Promise<void>)(createData)
    } else {
      // Para update, só enviar campos que mudaram
      const updateData: UpdateProductData = {}
      const formData = data as UpdateFormData

      if (initialData) {
        if (formData.name && formData.name.trim() !== initialData.name) {
          updateData.name = formData.name.trim()
        }

        if (
          formData.description !== undefined &&
          formData.description.trim() !== (initialData.description || '')
        ) {
          updateData.description = formData.description.trim() || undefined
        }

        if (
          formData.price !== undefined &&
          formData.price !== initialData.price
        ) {
          updateData.price = Number(formData.price)
        }

        if (
          formData.quantity !== undefined &&
          formData.quantity !== initialData.quantity
        ) {
          updateData.quantity = Number(formData.quantity)
        }
      }

      await (onSubmit as (data: UpdateProductData) => Promise<void>)(updateData)
    }
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

  const handleCancel = () => {
    if (isSubmitting) {
      return
    }
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Product name */}
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome do Produto
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
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
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

      {/* Form actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
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
              {mode === 'create' ? 'Criando...' : 'Atualizando...'}
            </>
          ) : (
            submitButtonText ||
            (mode === 'create' ? 'Criar Produto' : 'Atualizar Produto')
          )}
        </Button>
      </div>
    </form>
  )
}
