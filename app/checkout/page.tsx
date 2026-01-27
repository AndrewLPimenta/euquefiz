// app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { 
  Loader2, MapPin, Package, Truck, CreditCard, 
  ShoppingBag, ArrowLeft, Check, X, Lock, 
  CheckCircle, Shield, Tag, Calendar, ShoppingCart 
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { useCart } from "@/contexts/cart-context"
import {
  authAPI,
  addressAPI,
  ordersAPI,
  checkoutAPI,
  formatCurrency,
  formatCEP,
  formatPhone,
  isAuthenticated
} from "@/lib/api"

// Schema de validação
const checkoutSchema = z.object({
  // Endereço
  cep: z.string().min(8, "CEP inválido").max(9),
  rua: z.string().min(3, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado é obrigatório"),
  
  // Contato
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  
  // Método de pagamento
  metodo_pagamento: z.enum(["pix", "credit_card", "boleto", "debit_card"], {
    errorMap: () => ({ message: "Selecione um método de pagamento" })
  }),
  
  // Observações
  observacoes: z.string().max(500).optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, totalPrice: cartTotal, refreshCart, isLoading: cartLoading } = useCart()
  
  // Estados
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [calculatingShipping, setCalculatingShipping] = useState(false)
  
  // Dados
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  
  // Valores
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  
  // Formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      metodo_pagamento: "pix"
    }
  })
  
  const cepValue = watch("cep")
  
  // Verificar autenticação e carrinho
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Faça login para finalizar a compra")
      router.push("/entrar?redirect=/checkout")
      return
    }
    
    if (cartItems.length === 0 && !cartLoading) {
      toast.error("Seu carrinho está vazio")
      router.push("/")
      return
    }
    
    if (!cartLoading && cartItems.length > 0) {
      loadData()
    }
  }, [cartLoading, cartItems.length])
  
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Usar subtotal do carrinho
      const currentSubtotal = cartTotal
      setSubtotal(currentSubtotal)
      setTotal(currentSubtotal)
      
      // Carregar dados do usuário
      const userResponse = await authAPI.getProfile()
      const userData = userResponse.data || userResponse
      setUser(userData)
      
      if (userData) {
        setValue("email", userData.email || "")
        setValue("telefone", formatPhone(userData.whatsapp || ""))
      }
      
      // Carregar endereços salvos
      const addressesResponse = await addressAPI.getMyAddresses()
      setAddresses(addressesResponse)
      
      if (addressesResponse.length > 0) {
        const defaultAddress = addressesResponse.find(addr => addr.is_default) || addressesResponse[0]
        selectAddress(defaultAddress)
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados do checkout")
    } finally {
      setLoading(false)
    }
  }
  
  const selectAddress = (address: any) => {
    setSelectedAddressId(address.id)
    
    setValue("cep", address.cep || "")
    setValue("rua", address.rua || "")
    setValue("numero", address.numero || "")
    setValue("complemento", address.complemento || "")
    setValue("bairro", address.bairro || "")
    setValue("cidade", address.cidade || "")
    setValue("estado", address.estado || "")
    
    if (address.cep && cartItems.length > 0) {
      calculateShippingForCEP(address.cep)
    }
  }
  
  // Buscar endereço por CEP
  useEffect(() => {
    const fetchAddressByCEP = async () => {
      if (cepValue && cepValue.replace(/\D/g, '').length === 8) {
        try {
          const { success, data } = await checkoutAPI.getAddressByCEP(cepValue)
          if (success && data) {
            setValue("rua", data.rua || "")
            setValue("bairro", data.bairro || "")
            setValue("cidade", data.cidade || "")
            setValue("estado", data.estado || "")
            setValue("cep", data.cep || cepValue)
            
            trigger(["rua", "bairro", "cidade", "estado"])
            calculateShippingForCEP(data.cep || cepValue)
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error)
        }
      }
    }
    
    const timeoutId = setTimeout(fetchAddressByCEP, 800)
    return () => clearTimeout(timeoutId)
  }, [cepValue, setValue, trigger, cartItems.length])
  
  const calculateShippingForCEP = async (cep: string) => {
    if (!cep || cartItems.length === 0) return
    
    try {
      setCalculatingShipping(true)
      
      const itemsForShipping = cartItems.map((item: any) => ({
        produto_id: item.productId,
        quantidade: item.quantity
      }))
      
      const shippingResponse = await checkoutAPI.calculateShipping(cep, itemsForShipping, subtotal)
      
      if (shippingResponse.success) {
        const shippingValue = shippingResponse.data.value || 0
        setShipping(shippingValue)
        setTotal(subtotal + shippingValue)
      } else {
        // Fallback: cálculo simples
        const fallbackShipping = subtotal > 200 ? 0 : 15
        setShipping(fallbackShipping)
        setTotal(subtotal + fallbackShipping)
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error)
      const fallbackShipping = subtotal > 200 ? 0 : 15
      setShipping(fallbackShipping)
      setTotal(subtotal + fallbackShipping)
    } finally {
      setCalculatingShipping(false)
    }
  }
  
  const createAddressObject = (data: CheckoutFormData) => {
    return {
      cep: data.cep.replace(/\D/g, ''),
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento || "",
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado
    }
  }
  
const onSubmit = async (data: CheckoutFormData) => {
  try {
    setSubmitting(true);
    
    const orderData = {
      items: cartItems.map((item: any) => ({
        produto_id: item.productId,
        quantidade: item.quantity
      })),
      endereco_entrega_cliente: createAddressObject(data),
      metodo_pagamento: data.metodo_pagamento,
      observacoes: data.observacoes,
    };
    
    // 1. Criar pedido
    const orderResponse = await ordersAPI.createOrder(orderData);
    
    if (!orderResponse.success) {
      toast.error(orderResponse.error || "Erro ao criar pedido");
      return;
    }
    
    const orderId = orderResponse.data.pedido.id;
    toast.success("Pedido criado! Redirecionando para pagamento...");
    
    // 2. Criar pagamento no Mercado Pago
    const paymentResponse = await ordersAPI.createMercadoPagoPayment(
      orderId,
      `${window.location.origin}/pedido/${orderId}/sucesso` // URL de retorno após pagamento
    );
    
    if (!paymentResponse.success) {
      toast.error("Erro ao criar pagamento");
      return;
    }
    
    // 3. Redirecionar para o checkout do Mercado Pago
    window.location.href = paymentResponse.data.init_point;
    
  } catch (error: any) {
    console.error("Erro ao finalizar pedido:", error);
    toast.error(error.message || "Erro ao finalizar pedido");
  } finally {
    setSubmitting(false);
  }
};
  
  const handleBack = () => {
    router.push("/")
  }
  
  if (cartLoading || loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-12 w-64 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-6">Adicione produtos para continuar</p>
        <Button onClick={() => router.push("/")}>
          Continuar Comprando
        </Button>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600 mt-2">Último passo para receber seus produtos</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Seus endereços</h3>
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-4 border rounded-lg cursor-pointer ${
                              selectedAddressId === address.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => selectAddress(address)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">
                                  {address.nome || "Endereço"}
                                  {address.is_default && (
                                    <Badge className="ml-2" variant="secondary">Padrão</Badge>
                                  )}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {address.rua}, {address.numero}
                                  {address.complemento && `, ${address.complemento}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.bairro} • {address.cidade}/{address.estado}
                                </p>
                              </div>
                              {selectedAddressId === address.id && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator className="my-6" />
                  </>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        {...register("cep")}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value)
                          e.target.value = formatted
                          setValue("cep", formatted)
                        }}
                      />
                      {errors.cep && (
                        <p className="text-sm text-red-500 mt-1">{errors.cep.message}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="rua">Rua *</Label>
                      <Input
                        id="rua"
                        placeholder="Nome da rua"
                        {...register("rua")}
                      />
                      {errors.rua && (
                        <p className="text-sm text-red-500 mt-1">{errors.rua.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        placeholder="123"
                        {...register("numero")}
                      />
                      {errors.numero && (
                        <p className="text-sm text-red-500 mt-1">{errors.numero.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        placeholder="Apto, Bloco, etc."
                        {...register("complemento")}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      placeholder="Nome do bairro"
                      {...register("bairro")}
                    />
                    {errors.bairro && (
                      <p className="text-sm text-red-500 mt-1">{errors.bairro.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        placeholder="Nome da cidade"
                        {...register("cidade")}
                      />
                      {errors.cidade && (
                        <p className="text-sm text-red-500 mt-1">{errors.cidade.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        placeholder="UF"
                        maxLength={2}
                        {...register("estado")}
                      />
                      {errors.estado && (
                        <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    {...register("telefone")}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      e.target.value = formatted
                      setValue("telefone", formatted)
                    }}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="pix"
                  onValueChange={(value: any) => setValue("metodo_pagamento", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">PIX</span>
                          <p className="text-sm text-gray-500">
                            Pagamento instantâneo
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Recomendado
                        </Badge>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      <div>
                        <span className="font-medium">Cartão de Crédito</span>
                        <p className="text-sm text-gray-500">
                          Pagamento seguro via Mercado Pago
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                      <div>
                        <span className="font-medium">Boleto Bancário</span>
                        <p className="text-sm text-gray-500">
                          Pague em qualquer banco
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="mt-6">
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Alguma observação sobre o pedido?"
                    {...register("observacoes")}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna lateral - Resumo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Itens do carrinho */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Seus produtos ({cartItems.length})</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Valores */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    {calculatingShipping ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-sm">Calculando...</span>
                      </div>
                    ) : shipping !== null ? (
                      <span>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Informe o CEP</span>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                {/* Informações de segurança */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Compra 100% segura</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Seus dados são protegidos e sua compra é processada com segurança.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Botão de finalizar */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting || calculatingShipping || shipping === null}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Ao finalizar, você será redirecionado para o pagamento seguro.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}