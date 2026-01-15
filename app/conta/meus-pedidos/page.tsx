// app/minha-conta/meus-pedidos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

interface OrderItem {
  id: string;
  produto_id: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  imagem_url: string;
  variacao?: string;
}

interface Order {
  id: string;
  numero_pedido: string;
  cliente_id: string;
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado";
  total: number;
  subtotal: number;
  frete: number;
  metodo_pagamento: string;
  data_pedido: string;
  data_atualizacao: string;
  endereco_entrega: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  items: OrderItem[];
  observacoes?: string;
}

export default function MeusPedidosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Faça login para ver seus pedidos");
      router.push("/login?redirect=/minha-conta/meus-pedidos");
    }
  }, [isAuthenticated, authLoading, router]);

  // Carregar pedidos
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getMyOrders();
      
      // Ajustar resposta baseado na estrutura da sua API
      const ordersData = response.data || response.orders || response;
      
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        console.error("Formato de dados inválido:", response);
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      toast.error("Erro ao carregar seus pedidos");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos
  useEffect(() => {
    let filtered = [...orders];

    // Filtrar por status/tab
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Filtrar por status específico (se aplicável)
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.numero_pedido.toLowerCase().includes(term) ||
        order.items.some(item => item.nome.toLowerCase().includes(term))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, activeTab]);

  // Estatísticas
  const stats = {
    total: orders.length,
    pendente: orders.filter(o => o.status === "pendente").length,
    processando: orders.filter(o => o.status === "processando").length,
    enviado: orders.filter(o => o.status === "enviado").length,
    entregue: orders.filter(o => o.status === "entregue").length,
    cancelado: orders.filter(o => o.status === "cancelado").length,
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obter informações do status
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, {
      icon: React.ReactNode;
      color: string;
      text: string;
      bgColor: string;
    }> = {
      pendente: {
        icon: <Clock className="h-4 w-4" />,
        color: "text-yellow-600",
        text: "Pendente",
        bgColor: "bg-yellow-100",
      },
      processando: {
        icon: <RefreshCw className="h-4 w-4" />,
        color: "text-blue-600",
        text: "Processando",
        bgColor: "bg-blue-100",
      },
      enviado: {
        icon: <Truck className="h-4 w-4" />,
        color: "text-purple-600",
        text: "Enviado",
        bgColor: "bg-purple-100",
      },
      entregue: {
        icon: <CheckCircle className="h-4 w-4" />,
        color: "text-green-600",
        text: "Entregue",
        bgColor: "bg-green-100",
      },
      cancelado: {
        icon: <XCircle className="h-4 w-4" />,
        color: "text-red-600",
        text: "Cancelado",
        bgColor: "bg-red-100",
      },
    };

    return statusMap[status] || {
      icon: <Package className="h-4 w-4" />,
      color: "text-gray-600",
      text: "Desconhecido",
      bgColor: "bg-gray-100",
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <Link
              href="/minha-conta"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Minha Conta
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
                <p className="text-gray-600 mt-2">
                  Acompanhe seus pedidos e histórico de compras
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={loadOrders}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
                
                <Link href="/produtos">
                  <Button>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendente}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.processando}</div>
                <div className="text-sm text-gray-600">Processando</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.enviado}</div>
                <div className="text-sm text-gray-600">Enviados</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.entregue}</div>
                <div className="text-sm text-gray-600">Entregues</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por número do pedido ou produto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md bg-white"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="processando">Processando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Status */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
              <TabsTrigger value="all">
                Todos ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="pendente">
                Pendente ({stats.pendente})
              </TabsTrigger>
              <TabsTrigger value="processando">
                Processando ({stats.processando})
              </TabsTrigger>
              <TabsTrigger value="enviado">
                Enviado ({stats.enviado})
              </TabsTrigger>
              <TabsTrigger value="entregue">
                Entregue ({stats.entregue})
              </TabsTrigger>
              <TabsTrigger value="cancelado">
                Cancelado ({stats.cancelado})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {loading ? (
              // Skeletons durante carregamento
              [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredOrders.length === 0 ? (
              // Nenhum pedido encontrado
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "Nenhum pedido encontrado" : "Nenhum pedido ainda"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Tente ajustar seus filtros de busca"
                      : "Faça sua primeira compra e acompanhe seu pedido aqui!"}
                  </p>
                  <Link href="/produtos">
                    <Button>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ver Produtos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              // Lista de pedidos
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Cabeçalho do Pedido */}
                      <div className="p-6 border-b bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}
                              >
                                <span className="flex items-center gap-1">
                                  {statusInfo.icon}
                                  {statusInfo.text}
                                </span>
                              </Badge>
                              
                              <span className="text-sm text-gray-600">
                                Pedido #{order.numero_pedido}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              Realizado em {formatDate(order.data_pedido)}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {api.helpers.formatPrice(order.total)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                  src={item.imagem_url || "/placeholder.svg"}
                                  alt={item.nome}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.nome}
                                </h4>
                                {item.variacao && (
                                  <p className="text-sm text-gray-600">
                                    Variação: {item.variacao}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">
                                  Quantidade: {item.quantidade} × {api.helpers.formatPrice(item.preco_unitario)}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-medium text-gray-900">
                                  {api.helpers.formatPrice(item.total)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {order.items.length > 2 && (
                            <div className="text-center pt-2">
                              <span className="text-sm text-gray-600">
                                + {order.items.length - 2} mais item{order.items.length - 2 !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Ações */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t">
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">Endereço de entrega:</div>
                            <div>
                              {order.endereco_entrega.rua}, {order.endereco_entrega.numero}
                              {order.endereco_entrega.complemento && `, ${order.endereco_entrega.complemento}`}
                            </div>
                            <div>
                              {order.endereco_entrega.bairro} - {order.endereco_entrega.cidade}/{order.endereco_entrega.estado}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/minha-conta/meus-pedidos/${order.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </Link>
                            
                            {order.status === "pendente" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  // Função para cancelar pedido
                                  toast.info("Funcionalidade de cancelamento em desenvolvimento");
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Pedido
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Função para contato
                                toast.info("Abrindo canal de atendimento");
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Falar com Atendimento
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Gerar PDF/recibo
                                toast.success("Recibo baixado com sucesso");
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar Recibo
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Paginação */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Mostrando {filteredOrders.length} de {orders.length} pedidos
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}