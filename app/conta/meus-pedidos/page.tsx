"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, ShoppingBag, Calendar, DollarSign, Truck, CheckCircle, XCircle, Clock, Loader2, Home, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { clientOrdersAPI } from '@/lib/api'

interface Order {
  id: string
  numero_pedido: string
  status: string
  total: number
  data_criacao: string
  itens: Array<{
    id: string
    produto_nome: string
    quantidade: number
    preco_unitario: number
  }>
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Você precisa estar logado para ver seus pedidos")
        router.push("/entrar")
      } else {
        loadOrders()
      }
    }
  }, [authLoading, isAuthenticated, router])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const ordersData = await clientOrdersAPI.getMyOrders()
      setOrders(ordersData)
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error)
      setError("Erro ao carregar seus pedidos. Tente novamente mais tarde.")
      toast.error("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'entregue':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelado':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'processando':
      case 'em_processamento':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'enviado':
        return <Truck className="h-5 w-5 text-purple-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'entregue':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'processando':
      case 'em_processamento':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'enviado':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pendente'
      case 'processing':
      case 'processando':
      case 'em_processamento':
        return 'Processando'
      case 'shipped':
      case 'enviado':
        return 'Enviado'
      case 'delivered':
      case 'entregue':
        return 'Entregue'
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado'
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pendente'
    }
  }

  const calculateTotalItems = (order: Order) => {
    if (!order.itens || !Array.isArray(order.itens)) return 0
    return order.itens.reduce((total, item) => total + (item.quantidade || 0), 0)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Carregando seus pedidos...</h2>
            <p className="text-muted-foreground">Aguarde um momento</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                <Home className="h-4 w-4 inline mr-1" />
                Home
              </Link>
              <span>/</span>
              <Link href="/conta" className="hover:text-primary transition-colors">
                <User className="h-4 w-4 inline mr-1" />
                Minha Conta
              </Link>
              <span>/</span>
              <span className="font-medium">Meus Pedidos</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Meus Pedidos</h1>
                <p className="text-muted-foreground">Acompanhe todos os seus pedidos em um só lugar</p>
              </div>
            </div>
          </div>

          {error ? (
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ops! Algo deu errado</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={loadOrders} variant="outline">
                    Tentar Novamente
                  </Button>
                  <Button asChild>
                    <Link href="/produtos">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Você ainda não realizou nenhuma compra. Explore nossa coleção e encontre produtos incríveis!
                </p>
                <Button asChild size="lg">
                  <Link href="/produtos">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Explorar Produtos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entregues</p>
                        <p className="text-2xl font-bold">
                          {orders.filter(o => o.status?.toLowerCase() === 'entregue').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Gasto</p>
                        <p className="text-2xl font-bold">
                          {formatPrice(orders.reduce((total, order) => total + (order.total || 0), 0))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(order.status)}
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Pedido #{order.numero_pedido}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(order.data_criacao)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {translateStatus(order.status)}
                            </span>
                            <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Itens do Pedido</h4>
                            <div className="space-y-3">
                              {order.itens && order.itens.length > 0 ? (
                                <>
                                  {order.itens.slice(0, 3).map((item, idx) => (
                                    <div key={item.id || idx} className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">{item.produto_nome}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {item.quantidade} × {formatPrice(item.preco_unitario)}
                                        </p>
                                      </div>
                                      <p className="font-semibold">
                                        {formatPrice(item.preco_unitario * item.quantidade)}
                                      </p>
                                    </div>
                                  ))}
                                  {order.itens.length > 3 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                      + {order.itens.length - 3} outros itens
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-muted-foreground">Nenhum item detalhado disponível</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Resumo</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Total de itens</span>
                                <span className="font-medium">{calculateTotalItems(order)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Valor total</span>
                                <span className="font-semibold">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            ID do pedido: {order.id}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/conta/meuspedidos/${order.id}`}>
                                Ver Detalhes Completos
                              </Link>
                            </Button>
                            {order.status?.toLowerCase() === 'entregue' && (
                              <Button variant="outline" size="sm">Comprar Novamente</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}