// app/minha-conta/meus-pedidos/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Printer,
  Download,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

// Tipos (mantendo consistência)
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
  rastreamento?: {
    codigo: string;
    transportadora: string;
    url: string;
    ultima_atualizacao: string;
    historico: Array<{
      data: string;
      status: string;
      local: string;
      descricao: string;
    }>;
  };
}

export default function DetalhesPedidoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Faça login para ver detalhes do pedido");
      router.push("/login");
      return;
    }

    if (isAuthenticated && id) {
      loadOrder();
    }
  }, [isAuthenticated, authLoading, id, router]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getOrderById(id as string);
      
      // Ajustar baseado na estrutura da sua API
      const orderData = response.data || response.order || response;
      
      if (orderData) {
        setOrder(orderData);
      } else {
        toast.error("Pedido não encontrado");
        router.push("/minha-conta/meus-pedidos");
      }
    } catch (error: any) {
      console.error("Erro ao carregar pedido:", error);
      toast.error("Erro ao carregar detalhes do pedido");
      router.push("/minha-conta/meus-pedidos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, {
      icon: React.ReactNode;
      color: string;
      text: string;
      bgColor: string;
      description: string;
    }> = {
      pendente: {
        icon: <Clock className="h-5 w-5" />,
        color: "text-yellow-600",
        text: "Pendente",
        bgColor: "bg-yellow-100",
        description: "Aguardando confirmação do pagamento",
      },
      processando: {
        icon: <Package className="h-5 w-5" />,
        color: "text-blue-600",
        text: "Processando",
        bgColor: "bg-blue-100",
        description: "Preparando seu pedido para envio",
      },
      enviado: {
        icon: <Truck className="h-5 w-5" />,
        color: "text-purple-600",
        text: "Enviado",
        bgColor: "bg-purple-100",
        description: "Seu pedido está a caminho",
      },
      entregue: {
        icon: <CheckCircle className="h-5 w-5" />,
        color: "text-green-600",
        text: "Entregue",
        bgColor: "bg-green-100",
        description: "Pedido entregue com sucesso",
      },
      cancelado: {
        icon: <XCircle className="h-5 w-5" />,
        color: "text-red-600",
        text: "Cancelado",
        bgColor: "bg-red-100",
        description: "Pedido cancelado",
      },
    };

    return statusMap[status] || {
      icon: <Package className="h-5 w-5" />,
      color: "text-gray-600",
      text: "Desconhecido",
      bgColor: "bg-gray-100",
      description: "Status desconhecido",
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pedido #${order?.numero_pedido}`,
          text: `Confira meus pedidos na ${process.env.NEXT_PUBLIC_APP_NAME || "Nossa Loja"}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 print:bg-white print:pt-4">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8 print:hidden">
            <Link
              href="/minha-conta/meus-pedidos"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Meus Pedidos
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pedido #{order.numero_pedido}
                </h1>
                <p className="text-gray-600 mt-2">
                  Realizado em {formatDate(order.data_pedido)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Status do Pedido */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
                  <div className={statusInfo.color}>
                    {statusInfo.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {statusInfo.text}
                    </h3>
                    <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                      {statusInfo.text}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    {statusInfo.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {api.helpers.formatPrice(order.total)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Valor total
                  </div>
                </div>
              </div>
              
              {/* Timeline de Status (opcional) */}
              {order.rastreamento?.historico && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Histórico de Rastreamento
                  </h4>
                  <div className="space-y-3">
                    {order.rastreamento.historico.map((evento, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900">
                              {evento.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatDate(evento.data)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {evento.local} - {evento.descricao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda - Itens do Pedido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Itens do Pedido */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Itens do Pedido ({order.items.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 flex-shrink-0">
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
                              {item.variacao}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Quantidade: {item.quantidade}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {api.helpers.formatPrice(item.total)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {api.helpers.formatPrice(item.preco_unitario)} cada
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              {order.observacoes && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Observações do Pedido
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {order.observacoes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna Direita - Informações */}
            <div className="space-y-6">
              {/* Resumo do Pedido */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resumo do Pedido
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {api.helpers.formatPrice(order.subtotal)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete</span>
                      <span className="font-medium">
                        {api.helpers.formatPrice(order.frete)}
                      </span>
                    </div>
                    
                    {order.metodo_pagamento && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pagamento</span>
                        <span className="font-medium">
                          {order.metodo_pagamento}
                        </span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {api.helpers.formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Endereço de Entrega
                    </h3>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>{order.endereco_entrega.rua}, {order.endereco_entrega.numero}</p>
                    {order.endereco_entrega.complemento && (
                      <p>Complemento: {order.endereco_entrega.complemento}</p>
                    )}
                    <p>{order.endereco_entrega.bairro}</p>
                    <p>
                      {order.endereco_entrega.cidade} - {order.endereco_entrega.estado}
                    </p>
                    <p>CEP: {order.endereco_entrega.cep}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Pagamento */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informações de Pagamento
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método:</span>
                      <span className="font-medium">{order.metodo_pagamento}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                        {statusInfo.text}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span>{formatDate(order.data_pedido)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <Card className="print:hidden">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => {
                      toast.info("Abrindo chat de atendimento");
                    }}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar com Atendimento
                    </Button>
                    
                    {order.status === "pendente" && (
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja cancelar este pedido?")) {
                            toast.success("Pedido cancelado com sucesso");
                            router.push("/minha-conta/meus-pedidos");
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar Pedido
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        router.push("/produtos");
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Comprar Novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:bg-white,
          .print\\:bg-white * {
            visibility: visible;
          }
          .print\\:bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:pt-4 {
            padding-top: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}