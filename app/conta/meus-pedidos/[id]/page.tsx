"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, ShoppingBag, Calendar, DollarSign, Truck, CheckCircle, XCircle, Clock, Printer, Download, ArrowLeft, Home, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { clientOrdersAPI } from '@/lib/api'

interface OrderItem {
  id: string
  produto_id: string
  produto_nome: string
  quantidade: number
  preco_unitario: number
  total: number
}

interface Order {
  id: string
  numero_pedido: string
  status: string
  total: number
  subtotal: number
  frete: number
  desconto: number
  forma_pagamento: string
  data_criacao: string
  endereco_entrega: any
  itens: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.id as string

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Você precisa estar logado para ver este pedido")
        router.push("/entrar")
      } else {
        loadOrder()
      }
    }
  }, [authLoading, isAuthenticated, router, orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const orderData = await clientOrdersAPI.getOrderById(orderId)
      setOrder(orderData)
    } catch (error: any) {
      console.error("Erro ao carregar pedido:", error)
      setError(error.message || "Erro ao carregar pedido")
      toast.error("Erro ao carregar pedido")
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
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'cancelado':
        return <XCircle className="h-8 w-8 text-red-600" />
      case 'processando':
      case 'em_processamento':
        return <Clock className="h-8 w-8 text-blue-600" />
      case 'enviado':
        return <Truck className="h-8 w-8 text-purple-600" />
      default:
        return <Clock className="h-8 w-8 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'processando':
      case 'em_processamento':
        return 'bg-blue-100 text-blue-800'
      case 'enviado':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast.info("Download do pedido disponível em breve")
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Carregando pedido...</h2>
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

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="border-red-200 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pedido não encontrado</h3>
              <p className="text-muted-foreground mb-6">
                {error || "O pedido solicitado não existe ou você não tem permissão para visualizá-lo."}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/conta/meuspedidos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Meus Pedidos
                  </Link>
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
        </main>
        <Footer />
      </div>
    )
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
                Minha Conta
              </Link>
              <span>/</span>
              <Link href="/conta/meuspedidos" className="hover:text-primary transition-colors">
                Meus Pedidos
              </Link>
              <span>/</span>
              <span className="font-medium">Pedido #{order.numero_pedido}</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Pedido #{order.numero_pedido}</h1>
                  <p className="text-muted-foreground">
                    Realizado em {formatDate(order.data_criacao)}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status do Pedido */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold">Status do Pedido</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-3xl font-bold">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  
                  {/* Timeline do pedido */}
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4">Progresso do Pedido</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className={`h-8 w-8 rounded-full ${order.status === 'pendente' ? 'bg-primary' : 'bg-primary/20'} flex items-center justify-center mx-auto mb-2`}>
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs">Pedido Realizado</p>
                      </div>
                      <div className="flex-1 h-1 bg-muted"></div>
                      <div className="text-center">
                        <div className={`h-8 w-8 rounded-full ${order.status === 'processando' ? 'bg-primary' : 'bg-primary/20'} flex items-center justify-center mx-auto mb-2`}>
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs">Processando</p>
                      </div>
                      <div className="flex-1 h-1 bg-muted"></div>
                      <div className="text-center">
                        <div className={`h-8 w-8 rounded-full ${order.status === 'enviado' ? 'bg-primary' : 'bg-primary/20'} flex items-center justify-center mx-auto mb-2`}>
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs">Enviado</p>
                      </div>
                      <div className="flex-1 h-1 bg-muted"></div>
                      <div className="text-center">
                        <div className={`h-8 w-8 rounded-full ${order.status === 'entregue' ? 'bg-primary' : 'bg-primary/20'} flex items-center justify-center mx-auto mb-2`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs">Entregue</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Itens do Pedido */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Itens do Pedido</h3>
                  
                  <div className="space-y-4">
                    {order.itens && order.itens.length > 0 ? (
                      order.itens.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">{item.produto_nome}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantidade: {item.quantidade}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(item.preco_unitario)}</p>
                            <p className="text-lg font-bold">{formatPrice(item.total)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum item encontrado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              {order.endereco_entrega && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium">{order.endereco_entrega.rua}, {order.endereco_entrega.numero}</p>
                      {order.endereco_entrega.complemento && (
                        <p className="text-muted-foreground">{order.endereco_entrega.complemento}</p>
                      )}
                      <p className="text-muted-foreground">
                        {order.endereco_entrega.bairro}, {order.endereco_entrega.cidade} - {order.endereco_entrega.estado}
                      </p>
                      <p className="text-muted-foreground">CEP: {order.endereco_entrega.cep}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumo do Pedido */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    
                    {order.frete > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frete</span>
                        <span>{formatPrice(order.frete)}</span>
                      </div>
                    )}
                    
                    {order.desconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span>
                        <span>-{formatPrice(order.desconto)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.forma_pagamento}</p>
                        <p className="text-sm text-muted-foreground">Pagamento processado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ações</h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link href={`/produtos`}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Comprar Novamente
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contato">
                        Ajuda com este Pedido
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/conta/meuspedidos">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Pedidos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}