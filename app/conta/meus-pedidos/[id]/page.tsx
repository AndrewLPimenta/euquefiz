
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Printer,
  MessageSquare,
  RefreshCw,
  Home,
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Shield,
  Star
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountLayout from "@/components/account-layout"
import { clientOrdersAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface OrderItem {
  id: string
  produto_nome: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  total: number
  imagem?: string
}

interface OrderDetails {
  id: string
  numero_pedido: string
  status: string
  total: number
  subtotal: number
  frete: number
  desconto: number
  data_criacao: string
  data_atualizacao: string
  forma_pagamento: string
  endereco_entrega: any
  itens: OrderItem[]
  historico_status?: Array<{
    status: string
    data: string
    descricao?: string
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  const orderId = params.id as string

  useEffect(() => {
    if (isAuthenticated) {
      loadOrderDetails()
    }
  }, [isAuthenticated, orderId])

  const loadOrderDetails = async () => {
    try {
      setLoading(true)
      const orderData = await clientOrdersAPI.getOrderById(orderId)
      setOrder(orderData)
      
      // Carregar produtos relacionados (exemplo simples)
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error)
      toast.error("Erro ao carregar detalhes do pedido")
      router.push("/conta/pedidos")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
      pendente: {
        label: "Pendente",
        icon: <Clock className="h-4 w-4" />,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100"
      },
      processando: {
        label: "Processando",
        icon: <RefreshCw className="h-4 w-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-100"
      },
      pago: {
        label: "Pago",
        icon: <CheckCircle className="h-4 w-4" />,
        color: "text-green-600",
        bgColor: "bg-green-100"
      },
      enviado: {
        label: "Enviado",
        icon: <Truck className="h-4 w-4" />,
        color: "text-purple-600",
        bgColor: "bg-purple-100"
      },
      entregue: {
        label: "Entregue",
        icon: <Package className="h-4 w-4" />,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100"
      },
      cancelado: {
        label: "Cancelado",
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-red-600",
        bgColor: "bg-red-100"
      }
    }
    
    return configs[status] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      icon: <Package className="h-4 w-4" />,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch(method.toLowerCase()) {
      case 'credit_card':
      case 'cartão de crédito':
        return <CreditCard className="h-4 w-4" />
      case 'pix':
        return <Shield className="h-4 w-4" />
      case 'boleto':
        return <FileText className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const handleTrackOrder = () => {
    // Implementar rastreamento
    toast.info("Rastreamento em desenvolvimento")
  }

  const handleDownloadInvoice = () => {
    // Implementar download da nota fiscal
    toast.success("Nota fiscal gerada com sucesso!")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReorder = () => {
    // Implementar recompra
    toast.info("Adicionando itens ao carrinho...")
  }

  const handleContactSupport = () => {
    router.push("/contato")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="pedidos"
              title="Detalhes do Pedido"
              description="Carregando informações do pedido..."
            >
              <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-64 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                  </div>
                </div>
              </div>
            </AccountLayout>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="pedidos"
              title="Pedido não encontrado"
              description="O pedido solicitado não existe ou você não tem permissão para acessá-lo"
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pedido não encontrado</h3>
                  <p className="text-gray-500 mb-6">
                    Não foi possível encontrar os detalhes deste pedido. 
                    Ele pode ter sido removido ou você não tem acesso.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/conta/pedidos">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Pedidos
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Página Inicial
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AccountLayout>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)
  const estimatedDelivery = new Date(order.data_criacao)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <AccountLayout 
            activeTab="pedidos"
            title={`Pedido #${order.numero_pedido}`}
            description={`Realizado em ${formatDate(order.data_criacao)}`}
          >
            <div className="space-y-6">
              {/* Cabeçalho do Pedido */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${statusConfig.bgColor}`}>
                        <div className={statusConfig.color}>
                          {statusConfig.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Status: {statusConfig.label}</h3>
                        <p className="text-sm text-gray-500">
                          Última atualização: {formatDate(order.data_atualizacao || order.data_criacao)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTrackOrder}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Rastrear Pedido
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadInvoice}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Nota Fiscal
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Itens do Pedido */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Itens do Pedido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {order.itens.map((item, index) => (
                          <div key={item.id || index} className="group">
                            <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                  src={item.imagem || "/placeholder.svg"}
                                  alt={item.produto_nome}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-semibold">
                                      <Link 
                                        href={`/produtos/${item.produto_id}`}
                                        className="hover:text-primary transition-colors"
                                      >
                                        {item.produto_nome}
                                      </Link>
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                      Quantidade: {item.quantidade}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      {formatPrice(item.total)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {formatPrice(item.preco_unitario)} un.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {index < order.itens.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Total do Pedido */}
                      <div className="mt-8 border-t pt-6">
                        <div className="max-w-md ml-auto space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frete</span>
                            <span>{order.frete === 0 ? "Grátis" : formatPrice(order.frete)}</span>
                          </div>
                          {order.desconto > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Desconto</span>
                              <span>-{formatPrice(order.desconto)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Endereço de Entrega */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Endereço de Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {order.endereco_entrega ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <div className="p-2 rounded-full bg-primary/10">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{order.endereco_entrega.nome || "Endereço Principal"}</p>
                              <p className="text-gray-600">
                                {order.endereco_entrega.rua}, {order.endereco_entrega.numero}
                                {order.endereco_entrega.complemento && `, ${order.endereco_entrega.complemento}`}
                              </p>
                              <p className="text-gray-600">
                                {order.endereco_entrega.bairro} - {order.endereco_entrega.cidade}/{order.endereco_entrega.estado}
                              </p>
                              <p className="text-gray-600">CEP: {order.endereco_entrega.cep}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Truck className="h-4 w-4" />
                            <span>
                              Previsão de entrega: {estimatedDelivery.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Endereço não disponível</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Coluna lateral */}
                <div className="space-y-6">
                  {/* Resumo do Pedido */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Data do Pedido:</span>
                          <span className="text-gray-600">
                            {formatDate(order.data_criacao)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Pagamento:</span>
                          <span className="text-gray-600 capitalize">
                            {order.forma_pagamento.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Itens:</span>
                          <span className="text-gray-600">{order.itens.length}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Número do Pedido</h4>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <code className="text-sm font-mono">{order.numero_pedido}</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ações */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Button className="w-full" onClick={handleReorder}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Comprar Novamente
                        </Button>
                        
                        <Button variant="outline" className="w-full" onClick={handleContactSupport}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Falar com Suporte
                        </Button>
                        
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/conta/pedidos">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Pedidos
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ajuda Rápida */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Precisa de ajuda?</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm text-blue-800">
                          Em caso de dúvidas sobre seu pedido, entre em contato:
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800">(11) 99999-9999</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <a href="mailto:suporte@loja.com" className="text-blue-600 hover:underline">
                              suporte@loja.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Produtos Recomendados */}
              {relatedProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Você também pode gostar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {relatedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/produtos/${product.slug}`}
                          className="group block"
                        >
                          <div className="border rounded-lg p-3 hover:border-primary transition-colors">
                            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                              <Image
                                src={product.imagem || "/placeholder.svg"}
                                alt={product.nome}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {product.nome}
                            </h4>
                            <p className="text-sm font-bold mt-1">
                              {formatPrice(product.preco)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </AccountLayout>
        </div>
      </main>

      <Footer />
    </div>
  )
}