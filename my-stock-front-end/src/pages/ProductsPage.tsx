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
    console.log('Verificando estoque:', quantity, typeof quantity)

    if (quantity === 0) {
      console.log('Deveria mostrar: Sem Estoque')
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white border-red-500">
          Sem Estoque
        </Badge>
      )
    }
    if (quantity < 5) {
      console.log('Deveria mostrar: Estoque Baixo')
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500">
          Estoque Baixo
        </Badge>
      )
    }
    console.log('Deveria mostrar: Em Estoque')
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-500">
        Em Estoque
      </Badge>
    )
  }
  if (loading) {
    return <div className="p-6">Carregando produtos...</div>
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          Gerenciar Produtos
        </h1>
        <Button onClick={handleAddProduct} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {/* Cards - Visível apenas em mobile */}
      <div className="block md:hidden space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum produto encontrado
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.description || 'Sem descrição'}
                  </p>
                </div>
                {getStockBadge(product.quantity)}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qtd: {product.quantity}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tabela - Visível apenas em desktop */}
      <div className="hidden md:block">
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
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
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
    </div>
  )
}
