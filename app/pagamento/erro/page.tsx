// app/pagamento/erro/page.tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, Home, ShoppingCart, RefreshCw } from "lucide-react"

export default function PagamentoErroPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')

  const getErrorMessage = () => {
    switch(status) {
      case 'rejected':
        return "Seu pagamento foi rejeitado."
      case 'cancelled':
        return "Pagamento cancelado."
      default:
        return "Não foi possível processar seu pagamento."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="border-red-200 shadow-lg">
          <CardContent className="pt-8 pb-6">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Ops! Algo deu errado
              </h1>
              <p className="text-lg text-gray-600">
                {getErrorMessage()}
              </p>
            </div>

            {/* Possíveis soluções */}
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">O que fazer:</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Verifique os dados do seu cartão</li>
                <li>• Confirme se há saldo disponível</li>
                <li>• Tente outra forma de pagamento</li>
                <li>• Entre em contato com seu banco</li>
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => router.push('/checkout')}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Tentar Novamente
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/carrinho')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Meu Carrinho
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Página Inicial
                </Button>
              </div>
            </div>

            {/* Contato */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Ainda com problemas?{" "}
                <a href="mailto:suporte@loja.com" className="text-blue-600 hover:underline">
                  Entre em contato com nosso suporte
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}