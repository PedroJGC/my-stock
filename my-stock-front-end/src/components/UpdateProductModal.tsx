import { useEffect, useState } from 'react'
import { updateProduct } from '@/api/endpoints'
import type { Product, UpdateProductData } from '@/api/types'
import { ProductForm } from './ProductForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface UpdateProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  product?: Product | null
}

export function UpdateProductModal({
  open,
  onOpenChange,
  onSuccess,
  product,
}: UpdateProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = async (data: UpdateProductData) => {
    if (!product) {
      alert('Nenhum produto selecionado para edição')
      return
    }

    if (Object.keys(data).length === 0) {
      alert('Nenhuma alteração foi feita')
      return
    }

    try {
      setIsSubmitting(true)

      await updateProduct(product.id, data)

      onOpenChange(false)
      onSuccess?.()

      alert('Produto atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)

      if (error instanceof Error) {
        alert(`Erro ao atualizar produto: ${error.message}`)
      } else {
        alert('Erro desconhecido ao atualizar produto')
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

  if (!product) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-400 max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize as informações do produto "{product.name}".
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          mode="update"
          initialData={product}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
