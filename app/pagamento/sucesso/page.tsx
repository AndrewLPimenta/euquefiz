// app/pagamento/sucesso/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, ShoppingBag, Package } from "lucide-react"
import { ordersAPI, formatCurrency } from "@/lib/api"
import { toast } from "sonner"

export default function PagamentoSucessoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  
  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')
  const status = searchParams.get('status')

  useEffect(() => {
    loadOrder()
  }, [externalReference, paymentId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      
      // Tenta buscar pelo external_reference (order_id)
      if (externalReference) {
        const orderData = await ordersAPI.getOrderById(externalReference)
        setOrder(orderData.data || orderData)
      }
      // Se não tiver, mas tiver payment_id, tenta buscar pelo payment_id
      else if (paymentId) {
        // Você pode precisar criar uma API para buscar por payment_id
        toast.info("Buscando informações do pedido...")
      }
      
    } catch (err) {
      console.error("Erro ao carregar pedido:", err)
      toast.error("Erro ao carregar detalhes do pedido")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Processando seu pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-8 pb-6">
            {/* Cabeçalho */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pagamento Confirmado!
              </h1>
              <p className="text-gray-600">
                Seu pedido foi processado com sucesso.
              </p>
              
              {order?.id && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <span className="font-medium">Pedido:</span>
                  <code className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</code>
                </div>
              )}
            </div>

            {/* Mensagem */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">O que acontece agora?</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Recebemos a confirmação do seu pagamento</li>
                    <li>• Seu pedido está sendo preparado</li>
                    <li>• Você receberá atualizações por email</li>
                    <li>• Prazo estimado de entrega: 3-7 dias úteis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => router.push('/')}
              >
                <Home className="mr-2 h-5 w-5" />
                Continuar Comprando
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/pedidos')}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Meus Pedidos
              </Button>
            </div>

            {/* Informações extras */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Dúvidas? Entre em contato:{" "}
                <a href="mailto:suporte@loja.com" className="text-blue-600 hover:underline">
                  suporte@loja.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}