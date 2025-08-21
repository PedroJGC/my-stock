import { z } from 'zod'
import { Dialog, DialogContent } from './ui/dialog'

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
    // biome-ignore lint/suspicious/noGlobalIsNan: ignore
    .refine((val) => val !== undefined && !isNaN(val), {
      message: 'Preço é obrigatório',
    })
    .positive('Preço deve ser maior que zero')
    .max(999999.99, 'Preço deve ser menor que R$ 999.999,99'),
  quantity: z
    .number()
    .int()
    .min(0, 'A quantidade deve ser maior ou igual a zero')
    .max(9999, 'Quantidade deve ser menor ou igual a 9999.999'),
})

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <h1>Create Product</h1>
      </DialogContent>
    </Dialog>
  )
}
