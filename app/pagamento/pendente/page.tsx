// app/pagamento/pendente/page.tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Home, RefreshCw } from "lucide-react"

export default function PagamentoPendentePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="border-yellow-200 shadow-lg">
          <CardContent className="pt-8 pb-6">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                <Clock className="h-12 w-12 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Pagamento em Análise
              </h1>
              <p className="text-lg text-gray-600">
                Estamos processando seu pagamento.
              </p>
            </div>

            {/* Informações */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">O que isso significa?</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Para pagamentos via boleto: pode levar até 3 dias úteis</li>
                <li>• Para PIX: confira se realizou o pagamento</li>
                <li>• Para cartão: pode levar alguns minutos</li>
                <li>• Você receberá um email quando for confirmado</li>
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => router.push('/pedidos')}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Verificar Status do Pedido
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Continuar Navegando
              </Button>
            </div>

            {/* Informações extras */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Em caso de dúvidas, verifique seu email ou entre em contato.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}