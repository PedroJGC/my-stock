// src/pages/ProductsPage.tsx - Usando a nova API funcional

import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
// Importar a nova API
import {
  ApiError,
  deleteProduct,
  formatDate,
  formatPrice,
  getAllProducts,
  NetworkError,
  type Product,
} from '@/api/endpoints'
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

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar produtos da API
  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)

      if (err instanceof ApiError) {
        setError(`Erro da API: ${err.message}`)
      } else if (err instanceof NetworkError) {
        setError(`Erro de rede: ${err.message}`)
      } else {
        setError('Erro desconhecido ao carregar produtos')
      }
    } finally {
      setLoading(false)
    }
  }

  // Carregar produtos no mount do componente
  useEffect(() => {
    fetchProducts()
  }, [])

  // Função para editar produto
  function handleEdit(productId: string) {
    console.log('Editar produto:', productId)
    // TODO: Implementar modal de edição
    // Você pode usar updateProduct da API aqui
  }

  // Função para deletar produto
  async function handleDelete(productId: string) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
      return
    }

    try {
      await deleteProduct(productId)

      // Remover produto da lista local (atualização otimista)
      setProducts((prev) => prev.filter((p) => p.id !== productId))

      console.log('Produto deletado com sucesso')
      // TODO: Mostrar toast de sucesso
    } catch (err) {
      console.error('Erro ao deletar produto:', err)

      if (err instanceof ApiError) {
        alert(`Erro ao deletar: ${err.message}`)
      } else {
        alert('Erro desconhecido ao deletar produto')
      }
    }
  }

  // Função para adicionar produto
  function handleAddProduct() {
    console.log('Adicionar novo produto')
    // TODO: Implementar modal de criação
    // Você pode usar createProduct da API aqui
  }

  // Função para obter badge de status do estoque
  function getStockBadge(quantity: number) {
    if (quantity === 0) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white border-red-500">
          Sem Estoque
        </Badge>
      )
    }
    if (quantity < 5) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500">
          Estoque Baixo
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-500">
        Em Estoque
      </Badge>
    )
  }

  // Renderização de loading
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Carregando produtos...</p>
        </div>
      </div>
    )
  }

  // Renderização de erro
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar produtos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button onClick={fetchProducts} variant="outline" size="sm">
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1M7 7h10M7 10h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">
              Nenhum produto encontrado
            </h3>
            <p>Comece adicionando seu primeiro produto.</p>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em: {formatDate(product.createdAt)}
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
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1M7 7h10M7 10h10"
                      />
                    </svg>
                    <div>
                      <h3 className="text-lg font-medium">
                        Nenhum produto encontrado
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comece adicionando seu primeiro produto.
                      </p>
                    </div>
                  </div>
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
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
                        title="Editar produto"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        title="Deletar produto"
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
