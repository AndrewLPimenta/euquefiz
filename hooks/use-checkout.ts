"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/contexts/cart-context'
import { ordersAPI } from '@/lib/api'

export interface CheckoutData {
  endereco_entrega: {
    cep: string
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
  metodo_pagamento: 'cartao' | 'boleto' | 'pix'
  observacoes?: string
  cartao?: {
    numero: string
    nome_titular: string
    validade: string
    cvv: string
  }
}

export function useCheckout() {
  const router = useRouter()
  const { items, clearCart, totalPrice, refreshCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false
    return !!(localStorage.getItem('cliente_token') || sessionStorage.getItem('cliente_token'))
  }

  const validateCheckout = (checkoutData: CheckoutData) => {
    const errors: string[] = []

    // Validações do endereço
    if (!checkoutData.endereco_entrega.cep?.trim()) errors.push('CEP é obrigatório')
    if (!checkoutData.endereco_entrega.rua?.trim()) errors.push('Rua é obrigatória')
    if (!checkoutData.endereco_entrega.numero?.trim()) errors.push('Número é obrigatório')
    if (!checkoutData.endereco_entrega.bairro?.trim()) errors.push('Bairro é obrigatório')
    if (!checkoutData.endereco_entrega.cidade?.trim()) errors.push('Cidade é obrigatória')
    if (!checkoutData.endereco_entrega.estado?.trim()) errors.push('Estado é obrigatório')

    // Validações do método de pagamento
    if (!checkoutData.metodo_pagamento) {
      errors.push('Método de pagamento é obrigatório')
    } else if (checkoutData.metodo_pagamento === 'cartao') {
      if (!checkoutData.cartao?.numero?.trim()) errors.push('Número do cartão é obrigatório')
      if (!checkoutData.cartao?.nome_titular?.trim()) errors.push('Nome do titular é obrigatório')
      if (!checkoutData.cartao?.validade?.trim()) errors.push('Validade do cartão é obrigatória')
      if (!checkoutData.cartao?.cvv?.trim()) errors.push('CVV do cartão é obrigatório')
      
      // Validação simples do cartão
      if (checkoutData.cartao?.numero) {
        const cardNumber = checkoutData.cartao.numero.replace(/\s/g, '')
        if (cardNumber.length < 13 || cardNumber.length > 19) {
          errors.push('Número do cartão inválido')
        }
      }
      
      if (checkoutData.cartao?.cvv && checkoutData.cartao.cvv.length < 3) {
        errors.push('CVV inválido')
      }
    }

    return errors
  }

  const processCheckout = async (checkoutData: CheckoutData) => {
    // Verificar autenticação
    if (!isAuthenticated()) {
      toast.error('Faça login para finalizar a compra')
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`)
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Validar dados
    const validationErrors = validateCheckout(checkoutData)
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return { success: false, error: validationErrors.join(', ') }
    }

    // Verificar se há itens no carrinho
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio')
      return { success: false, error: 'Carrinho vazio' }
    }

    setIsProcessing(true)

    try {
      // 1. Preparar dados do pedido
      const orderData = {
        items: items.map(item => ({
          produto_id: item.productId,
          quantidade: item.quantity,
          preco: item.price
        })),
        endereco_entrega: checkoutData.endereco_entrega,
        metodo_pagamento: checkoutData.metodo_pagamento,
        observacoes: checkoutData.observacoes,
        total: totalPrice
      }

      console.log('📦 Criando pedido:', orderData)

      // 2. Criar pedido na API
      const orderResponse = await ordersAPI.createOrder(orderData)
      
      console.log('✅ Pedido criado:', orderResponse)

      if (orderResponse.success) {
        // 3. Limpar carrinho após sucesso
        await clearCart()
        
        toast.success('Pedido criado com sucesso!')
        
        // 4. Redirecionar para página de confirmação
        const orderId = orderResponse.data?.pedido?.id || orderResponse.orderId
        
        if (orderId) {
          router.push(`/order-confirmation/${orderId}`)
        } else {
          router.push('/order-confirmation')
        }
        
        return { 
          success: true, 
          orderId: orderId
        }
      } else {
        throw new Error(orderResponse.error || 'Erro ao criar pedido')
      }
    } catch (error: any) {
      console.error('❌ Erro no checkout:', error)
      
      // Mensagens de erro específicas
      let errorMessage = 'Erro ao processar pagamento'
      
      if (error.message.includes('401')) {
        errorMessage = 'Sessão expirada. Faça login novamente.'
        localStorage.removeItem('cliente_token')
        sessionStorage.removeItem('cliente_token')
        router.push(`/login?redirect=${encodeURIComponent('/checkout')}`)
      } else if (error.message.includes('400')) {
        errorMessage = 'Dados inválidos. Verifique as informações.'
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.'
      } else {
        errorMessage = error.message || 'Erro ao processar pagamento'
      }
      
      toast.error(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const initiateCheckout = () => {
    if (!isAuthenticated()) {
      toast.info('Faça login para finalizar a compra')
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`)
      return
    }

    if (items.length === 0) {
      toast.error('Adicione produtos ao carrinho primeiro')
      return
    }

    router.push('/checkout')
  }

  return {
    validateCheckout,
    processCheckout,
    initiateCheckout,
    isProcessing,
    canCheckout: isAuthenticated() && items.length > 0
  }
}