"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Package, Search, Filter, Calendar,
  Truck, CheckCircle, Clock, AlertCircle,
  Download, Eye, RefreshCw, ChevronRight
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountLayout from "@/components/account-layout"
import { clientOrdersAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await clientOrdersAPI.getMyOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      toast.error("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  // Filtros
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "pendente", label: "Pendente" },
    { value: "processando", label: "Processando" },
    { value: "enviado", label: "Enviado" },
    { value: "entregue", label: "Entregue" },
    { value: "cancelado", label: "Cancelado" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregue': return CheckCircle
      case 'pendente': return Clock
      case 'cancelado': return AlertCircle
      default: return Package
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'pendente': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'processando': return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'enviado': return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      case 'cancelado': return 'bg-red-100 text-red-800 hover:bg-red-100'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="pedidos"
              title="Meus Pedidos"
              description="Acompanhe o histórico e status dos seus pedidos"
            >
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
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
          <AccountLayout 
            activeTab="pedidos"
            title="Meus Pedidos"
            description="Acompanhe o histórico e status dos seus pedidos"
          >
            {/* Barra de filtros */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por número do pedido ou status..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={loadOrders}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Pedidos */}
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || statusFilter !== "all" 
                      ? "Nenhum pedido encontrado" 
                      : "Nenhum pedido ainda"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Tente ajustar seus filtros de busca." 
                      : "Comece a comprar para ver seus pedidos aqui."}
                  </p>
                  <Button asChild>
                    <Link href="/produtos">
                      <Package className="mr-2 h-5 w-5" />
                      Explorar Produtos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  
                  return (
                    <Card key={order.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <StatusIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <h3 className="font-semibold">
                                  Pedido #{order.numero_pedido}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={getStatusColor(order.status)}>
                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pendente'}
                                  </Badge>
                                  <span className="text-sm text-gray-500">•</span>
                                  <span className="text-sm text-gray-500">
                                    {order.itens?.length || 0} ite{order.itens?.length === 1 ? 'm' : 'ns'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(order.data_criacao).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                <span>Entrega estimada: 3-7 dias úteis</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <p className="text-2xl font-bold">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(order.total)}
                            </p>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/conta/pedidos/${order.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detalhes
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Nota Fiscal
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </AccountLayout>
        </div>
      </main>

      <Footer />
    </div>
  )
}