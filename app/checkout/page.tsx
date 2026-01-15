"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CreditCard, Barcode, QrCode, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCheckout } from '@/hooks/use-checkout'
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, isLoading: cartLoading } = useCart()
  const { processCheckout, isProcessing } = useCheckout()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutData, setCheckoutData] = useState({
    endereco_entrega: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    metodo_pagamento: 'pix',
    observacoes: '',
    cartao: {
      numero: '',
      nome_titular: '',
      validade: '',
      cvv: ''
    }
  })

  const [isLoadingCEP, setIsLoadingCEP] = useState(false)

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = () => {
      const token = localStorage.getItem('cliente_token') || 
                    sessionStorage.getItem('cliente_token')
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
    
    // Verificar se há itens no carrinho
    if (!cartLoading && items.length === 0) {
      toast.error('Seu carrinho está vazio')
      router.push('/')
    }
  }, [cartLoading, items.length, router])

  const handleInputChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      endereco_entrega: {
        ...prev.endereco_entrega,
        [field]: value
      }
    }))
  }

  const handleCartaoChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      cartao: {
        ...prev.cartao,
        [field]: value
      }
    }))
  }

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    
    if (cepLimpo.length !== 8) return
    
    setIsLoadingCEP(true)
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        setCheckoutData(prev => ({
          ...prev,
          endereco_entrega: {
            ...prev.endereco_entrega,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Erro ao buscar CEP. Preencha manualmente.')
    } finally {
      setIsLoadingCEP(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await processCheckout(checkoutData)
    
    if (result.success) {
      toast.success('Compra finalizada com sucesso!')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const calcularFrete = () => {
    // Lógica simplificada de frete
    return totalPrice > 200 ? 0 : 15
  }

  const totalComFrete = totalPrice + calcularFrete()

  if (isLoading || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">Acesso Negado</CardTitle>
            <p className="text-muted-foreground">
              Você precisa estar logado para finalizar a compra
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href={`/login?redirect=${encodeURIComponent('/checkout')}`}>
                  Fazer Login
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">Carrinho Vazio</CardTitle>
            <p className="text-muted-foreground">
              Adicione produtos ao carrinho para continuar
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">
                Ver Produtos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={checkoutData.endereco_entrega.cep}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        const formattedValue = value.length > 5 
                          ? `${value.slice(0,5)}-${value.slice(5,8)}`
                          : value
                        handleInputChange('cep', formattedValue)
                        if (value.length === 8) {
                          buscarCEP(value)
                        }
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                    />
                    {isLoadingCEP && (
                      <p className="text-xs text-muted-foreground">Buscando endereço...</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={checkoutData.endereco_entrega.numero}
                      onChange={(e) => handleInputChange('numero', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input
                    id="rua"
                    value={checkoutData.endereco_entrega.rua}
                    onChange={(e) => handleInputChange('rua', e.target.value)}
                    placeholder="Rua das Flores"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento (Opcional)</Label>
                  <Input
                    id="complemento"
                    value={checkoutData.endereco_entrega.complemento}
                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                    placeholder="Apto 101, Bloco B"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={checkoutData.endereco_entrega.bairro}
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                      placeholder="Centro"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={checkoutData.endereco_entrega.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={checkoutData.endereco_entrega.estado}
                    onValueChange={(value) => handleInputChange('estado', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Método de Pagamento *</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={checkoutData.metodo_pagamento}
                  onValueChange={(value: 'cartao' | 'boleto' | 'pix') => 
                    setCheckoutData(prev => ({ ...prev, metodo_pagamento: value }))
                  }
                  className="space-y-4"
                  required
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                      <QrCode className="h-4 w-4" />
                      <span>PIX</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      <span>Cartão de Crédito</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
                      <Barcode className="h-4 w-4" />
                      <span>Boleto Bancário</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Formulário do Cartão */}
                {checkoutData.metodo_pagamento === 'cartao' && (
                  <div className="mt-6 space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="numero_cartao">Número do Cartão *</Label>
                      <Input
                        id="numero_cartao"
                        value={checkoutData.cartao.numero}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ')
                          handleCartaoChange('numero', formattedValue)
                        }}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nome_titular">Nome do Titular *</Label>
                      <Input
                        id="nome_titular"
                        value={checkoutData.cartao.nome_titular}
                        onChange={(e) => handleCartaoChange('nome_titular', e.target.value)}
                        placeholder="Como está no cartão"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="validade">Validade (MM/AA) *</Label>
                        <Input
                          id="validade"
                          value={checkoutData.cartao.validade}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            const formattedValue = value.length > 2 
                              ? `${value.slice(0,2)}/${value.slice(2,4)}`
                              : value
                            handleCartaoChange('validade', formattedValue)
                          }}
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={checkoutData.cartao.cvv}
                          onChange={(e) => handleCartaoChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={checkoutData.observacoes}
                  onChange={(e) => setCheckoutData(prev => ({ 
                    ...prev, 
                    observacoes: e.target.value 
                  }))}
                  placeholder="Instruções especiais para entrega, etc."
                  rows={3}
                />
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-3">
                    <div className="max-w-[70%]">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Frete</span>
                  <span className="text-sm">
                    {calcularFrete() === 0 ? 'Grátis' : formatPrice(calcularFrete())}
                  </span>
                </div>
                
                {totalPrice < 200 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Frete grátis para compras acima de R$ 200,00
                  </p>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span>{formatPrice(totalComFrete)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg" 
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Ao finalizar a compra, você concorda com nossos{' '}
                <Link href="/termos" className="underline hover:text-primary">
                  Termos de Serviço
                </Link>
                {' '}e{' '}
                <Link href="/privacidade" className="underline hover:text-primary">
                  Política de Privacidade
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}