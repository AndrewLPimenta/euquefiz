"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { 
  User, Settings, Package, Heart, LogOut, 
  MapPin, Shield, CreditCard, Bell, Truck,
  Calendar, CheckCircle, Clock, AlertCircle,
  ArrowRight, ShoppingBag, Home, Loader2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AccountLayout from "@/components/account-layout"
import { useAuth } from "@/contexts/auth-context"
import { clientOrdersAPI } from "@/lib/api"

// Componente de Loading
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

// Componente de Stats
function AccountStats({ user, orders }: { user: any; orders: any[] }) {
  const stats = [
    {
      title: "Pedidos Totais",
      value: orders.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/conta/pedidos"
    },
    {
      title: "Pedidos Pendentes",
      value: orders.filter(o => o.status === 'pendente').length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/conta/pedidos?status=pendente"
    },
    {
      title: "Pedidos Entregues",
      value: orders.filter(o => o.status === 'entregue').length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/conta/pedidos?status=entregue"
    },
    {
      title: "Membro desde",
      value: user?.data_criacao 
        ? new Date(user.data_criacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
        : "N/A",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/conta"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <Link href={stat.link} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente de Atalhos
function QuickLinks() {
  const links = [
    {
      title: "Meus Pedidos",
      description: "Acompanhe seus pedidos",
      icon: Package,
      href: "/conta/pedidos",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Favoritos",
      description: "Produtos salvos",
      icon: Heart,
      href: "/conta/favoritos",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Endereços",
      description: "Gerencie endereços",
      icon: MapPin,
      href: "/conta/enderecos",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Segurança",
      description: "Altere sua senha",
      icon: Shield,
      href: "/conta/alterar-senha",
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${link.bgColor}`}>
                  <link.icon className={`h-6 w-6 ${link.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// Componente de Pedidos Recentes
function RecentOrders({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h3>
            <p className="text-gray-500 mb-6">Comece a comprar para ver seus pedidos aqui</p>
            <Button asChild>
              <Link href="/produtos">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Produtos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const recentOrders = orders.slice(0, 3)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
            <p className="text-sm text-gray-500">Seus últimos pedidos</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/conta/pedidos">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div 
              key={order.id} 
              className="group p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Link href={`/conta/pedidos/${order.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">#{order.numero_pedido}</span>
                      <Badge 
                        variant={
                          order.status === 'entregue' ? 'default' :
                          order.status === 'cancelado' ? 'destructive' : 'outline'
                        }
                        className={`
                          ${order.status === 'entregue' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          ${order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                          ${order.status === 'cancelado' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                        `}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pendente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.data_criacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                      <span className="mx-2">•</span>
                      <Truck className="h-4 w-4" />
                      <span>Entrega estimada</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(order.total)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.itens?.length || 0} ite{order.itens?.length === 1 ? 'm' : 'ns'}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { useState, useEffect } from "react"

export default function AccountPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && isAuthenticated) {
      loadOrders()
    }
  }, [user, isAuthenticated])

  const loadOrders = async () => {
    try {
      const ordersData = await clientOrdersAPI.getMyOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout activeTab="dashboard">
              <DashboardSkeleton />
            </AccountLayout>
          </div>
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
          <AccountLayout activeTab="dashboard">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Olá, {user?.nome?.split(' ')[0] || 'Usuário'}! 👋
              </h1>
              <p className="text-gray-600">
                Gerencie sua conta e acompanhe suas compras
              </p>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
              {/* Stats */}
              <AccountStats user={user} orders={orders} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna principal */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Quick Links */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Atalhos Rápidos</h2>
                    <QuickLinks />
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <RecentOrders orders={orders} />
                  </div>
                </div>

                {/* Coluna lateral */}
                <div className="space-y-6">
                  {/* Profile Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user?.nome || 'Usuário'}</h3>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <div className="p-2 rounded-full bg-white">
                            <Bell className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Notificações</p>
                            <p className="text-xs text-gray-500">Ative para receber novidades</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <div className="p-2 rounded-full bg-white">
                            <CreditCard className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Pagamentos</p>
                            <p className="text-xs text-gray-500">Gerencie formas de pagamento</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/conta?tab=perfil">
                          <Settings className="mr-2 h-4 w-4" />
                          Editar Perfil
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Need Help? */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Precisa de ajuda?</h3>
                      </div>
                      <p className="text-sm text-blue-800 mb-4">
                        Estamos aqui para te ajudar com qualquer dúvida sobre sua conta ou pedidos.
                      </p>
                      <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Link href="/contato" className="flex items-center justify-center w-full">
                          Falar com Suporte
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Suspense>
          </AccountLayout>
        </div>
      </main>

      <Footer />
    </div>
  )
}