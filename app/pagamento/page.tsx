'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle, CreditCard, Lock, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'

import { ordersAPI, formatCurrency } from '@/lib/api'

export default function PagamentoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState('')

  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      setError('Pedido não encontrado')
      setLoading(false)
      return
    }

    loadOrderAndCreatePayment()
  }, [orderId])

  const loadOrderAndCreatePayment = async () => {
    try {
      setLoading(true)
      
      // 1. Buscar detalhes do pedido
      const orderResponse = await ordersAPI.getOrderById(orderId!)
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Pedido não encontrado')
      }

      setOrder(orderResponse.data)

      // 2. Criar pagamento no Mercado Pago
      const paymentResponse = await ordersAPI.createMercadoPagoPayment(
        orderId!,
        `${window.location.origin}/pedido/${orderId}/sucesso`
      )

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Erro ao criar pagamento')
      }

      setPaymentData(paymentResponse.data)
      
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err)
      setError(err.message || 'Erro ao processar pagamento')
      toast.error(err.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleRedirectToMercadoPago = () => {
    if (paymentData?.init_point) {
      setProcessing(true)
      window.location.href = paymentData.init_point
    }
  }

  const handleRetry = () => {
    setError('')
    loadOrderAndCreatePayment()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Preparando seu pagamento</h1>
          <p className="text-gray-600">Aguarde um momento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Erro no Pagamento</CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              Tentar Novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/meus-pedidos')}
              className="w-full"
            >
              Ver Meus Pedidos
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!order || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Dados não encontrados</h1>
          <Button onClick={() => router.push('/')}>
            Voltar para a loja
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Finalizar Pagamento
          </h1>
          <p className="text-gray-600">
            Seu pedido está quase pronto! Complete o pagamento para finalizar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna da esquerda - Resumo do pedido */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Pedido Criado com Sucesso!
                </CardTitle>
                <CardDescription>
                  Número do pedido: <strong>{order.id.slice(0, 8).toUpperCase()}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Aguardando Pagamento
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-medium capitalize">
                      {order.metodo_pagamento?.replace('_', ' ') || 'Mercado Pago'}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Itens do pedido */}
                <div>
                  <h3 className="font-medium mb-3">Itens do Pedido</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {order.pedido_itens?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{item.produto?.nome || 'Produto'}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantidade} × {formatCurrency(item.preco)}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(item.quantidade * item.preco)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{order.frete === 0 ? 'Grátis' : formatCurrency(order.frete || 0)}</span>
                  </div>
                  {order.desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-{formatCurrency(order.desconto || 0)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de segurança */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800 mb-2">
                      Pagamento 100% Seguro
                    </h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Processado pelo Mercado Pago</li>
                      <li>• Dados criptografados</li>
                      <li>• Ambiente seguro SSL</li>
                      <li>• Garantia de reembolso</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da direita - Pagamento */}
          <div>
            <Card className="sticky top-8">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamento Seguro
                  </CardTitle>
                  <Badge variant="secondary">Mercado Pago</Badge>
                </div>
                <CardDescription>
                  Você será redirecionado para uma página segura
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Pague com Segurança</h3>
                    <p className="text-gray-600">
                      Clique no botão abaixo para ser redirecionado ao ambiente seguro do Mercado Pago
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Valor a pagar:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(order.total || 0)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Taxas inclusas • Preço final
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Métodos disponíveis:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-lg p-3 text-center">
                        <div className="font-medium">PIX</div>
                        <div className="text-xs text-gray-500">Instantâneo</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="font-medium">Cartão</div>
                        <div className="text-xs text-gray-500">Crédito/Débito</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="font-medium">Boleto</div>
                        <div className="text-xs text-gray-500">Até 3 dias</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="font-medium">Saldo MP</div>
                        <div className="text-xs text-gray-500">Imediato</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-6">
                <Button
                  onClick={handleRedirectToMercadoPago}
                  disabled={processing || !paymentData?.init_point}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pagar com Mercado Pago
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Ao clicar, você será redirecionado para o site do Mercado Pago
                </p>
              </CardFooter>
            </Card>

            {/* Avisos */}
            <div className="mt-4 space-y-3">
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">⚠️ Importante:</p>
                <ul className="space-y-1">
                  <li>• Não feche esta janela durante o pagamento</li>
                  <li>• Após pagar, aguarde o redirecionamento automático</li>
                  <li>• Em caso de dúvidas, entre em contato conosco</li>
                </ul>
              </div>
              
              <Button
                variant="outline"
                onClick={() => router.push(`/pedido/${orderId}`)}
                className="w-full"
              >
                Voltar para detalhes do pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}