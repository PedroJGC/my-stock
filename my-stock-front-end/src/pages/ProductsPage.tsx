import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Tipo do produto baseado no seu backend
interface Product {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // TODO: Implementar busca dos produtos da API
  useEffect(() => {
    // Aqui você fará a requisição para sua API
    // fetch('http://localhost:3333/products')
    //   .then(res => res.json())
    //   .then(data => setProducts(data))
    //   .finally(() => setLoading(false))

    // Dados mockados para exemplo
    setProducts([
      {
        id: '1',
        name: 'Notebook Dell',
        description: 'Notebook para trabalho',
        price: 2500.99,
        quantity: 5,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Mouse Logitech',
        description: 'Mouse sem fio',
        price: 89.9,
        quantity: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ])
    setLoading(false)
  }, [])

  const handleEdit = (productId: string) => {
    // TODO: Abrir modal de edição
    console.log('Editar produto:', productId)
  }

  const handleDelete = (productId: string) => {
    // TODO: Abrir modal de confirmação e deletar
    console.log('Deletar produto:', productId)
  }

  const handleAddProduct = () => {
    // TODO: Abrir modal de criação
    console.log('Adicionar novo produto')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    }
    if (quantity < 5) {
      return <Badge variant="secondary">Estoque Baixo</Badge>
    }
    return <Badge variant="default">Em Estoque</Badge>
  }

  if (loading) {
    return <div className="p-6">Carregando produtos...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      <Table>
        <TableCaption>
          {products.length === 0
            ? 'Nenhum produto cadastrado.'
            : `Total de ${products.length} produto(s) cadastrado(s).`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.description || 'Sem descrição'}
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{getStockBadge(product.quantity)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
