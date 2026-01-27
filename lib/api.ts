// lib/api.ts - VERSÃO FINAL CORRIGIDA
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.15.8:3001"

console.log("🌐 BASE_URL no front-end:", process.env.NEXT_PUBLIC_API_URL);

// 🔄 Função para requisições públicas
async function fetchPublicAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: options.cache || 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`)
  }

  return response.json()
}

// 🔄 Função para requisições autenticadas
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  if (!token) {
    throw new Error('Usuário não autenticado')
  }

  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()

    if (response.status === 401) {
      clearToken()
    }

    throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`)
  }

  return response.json()
}

/* =======================
   AUTENTICAÇÃO
======================= */
export const authAPI = {
  register: (data: {
    nome: string;
    email: string;
    senha: string;
    sexo?: string;
    whatsapp?: string;
    endereco?: string;
  }) => 
    
  fetchPublicAPI("/api/clients/register", {
    method: "POST",
    body: JSON.stringify(data),
  }),

login: (data: { email: string; senha: string }) =>
    fetchPublicAPI("/api/clients/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

getProfile: () => {
  const token = getToken()

  console.log("📝 Token enviado para /api/clients/profile:", token)

  if (!token) {
    throw new Error('Token não encontrado')
  }

  return fetch(`${BASE_URL}/api/clients/profile`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }).then(res => {
    console.log("📦 Status da resposta:", res.status)
    if (!res.ok) {
      if (res.status === 401) clearToken()
      throw new Error(`Erro ${res.status}: ${res.statusText}`)
    }
    return res.json()
  })
},

}

/* =======================
   CATEGORIAS
======================= */
export const categoriesAPI = {
  getAll: (options?: { cache?: RequestCache }) =>
    fetchPublicAPI("/api/categories", { cache: options?.cache || 'no-store' }),

  getBySlug: async (slug: string) => {
    try {
      const allCategories = await categoriesAPI.getAll()
      const categoriesArray = Array.isArray(allCategories)
        ? allCategories
        : allCategories?.data || []

      const category = categoriesArray.find((cat: any) => cat.slug === slug)

      if (!category) {
        return { success: false, error: `Categoria "${slug}" não encontrada` }
      }

      return { success: true, data: category }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}

/* =======================
   PRODUTOS
======================= */
export const productsAPI = {
  getAll: (options?: { cache?: RequestCache }) =>
    fetchPublicAPI("/api/products?include=all", { cache: options?.cache || 'no-store' }),

  getById: (id: string) => fetchPublicAPI(`/api/products/${id}?include=all`),

  getBySlug: (slug: string) => fetchPublicAPI(`/api/products/slug/${slug}?include=all`),

getByCategorySlug: async (
  categorySlug: string,
  options?: { page?: number; limit?: number }
): Promise<{
  data: any[]
  currentPage: number
  totalPages: number
  totalItems: number
}> => {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 20

    // 1. Buscar categoria
    const categoryResponse = await categoriesAPI.getBySlug(categorySlug)
    if (!categoryResponse.success || !categoryResponse.data) {
      return { data: [], currentPage: page, totalPages: 1, totalItems: 0 }
    }

    const categoryId = categoryResponse.data.id

    // 2. Buscar produtos da categoria usando query params
    const url = `/api/products?categoria_id=${categoryId}&page=${page}&limit=${limit}&include=all`
    const response: any = await fetchPublicAPI(url)

    const products = Array.isArray(response?.data) ? response.data : []
    const totalItems = response?.totalItems ?? products.length
    const totalPages = Math.max(1, Math.ceil(totalItems / limit))

    return {
      data: products,
      currentPage: page,
      totalPages,
      totalItems,
    }
  } catch (err) {
    console.error(`❌ Erro ao buscar produtos da categoria ${categorySlug}:`, err)
    return { data: [], currentPage: options?.page ?? 1, totalPages: 1, totalItems: 0 }
  }
},


  getByCategory: async (categorySlug: string) =>

    productsAPI.getByCategorySlug(categorySlug),

  search: (query: string) =>
    fetchPublicAPI(`/api/products/search?q=${encodeURIComponent(query)}&include=all`),

  getFeatured: () => fetchPublicAPI("/api/products/featured?include=all"),

  validateProductId: async (productIdentifier: string | number): Promise<{ id: string; isValid: boolean }> => {
    const idStr = productIdentifier.toString()

    // Se for UUID válido
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)) {
      try {
        await productsAPI.getById(idStr)
        return { id: idStr, isValid: true }
      } catch (error) {
        return { id: idStr, isValid: false }
      }
    }

    // Se for número, rejeita imediatamente (IDs numéricos não existem mais)
    if (/^\d+$/.test(idStr)) {
      return { id: idStr, isValid: false }
    }

    // Se for string, tenta buscar por slug
    try {
      const product = await productsAPI.getBySlug(idStr)
      if (product?.id) {
        return { id: product.id, isValid: true }
      }
    } catch (error) {
      // Não faz nada, apenas retorna inválido
    }

    return { id: idStr, isValid: false }
  },
}

/* =======================
   FUNÇÕES DE AUTENTICAÇÃO
======================= */
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cliente_token') ||
      sessionStorage.getItem('cliente_token')
  }
  return null
}

export function setToken(token: string, remember: boolean = true) {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem('cliente_token', token)
    } else {
      sessionStorage.setItem('cliente_token', token)
    }
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cliente_token')
    sessionStorage.removeItem('cliente_token')
  }
}

export function isAuthenticated() {
  return !!getToken()
}

/* =======================
   CARRINHO - CORREÇÃO CRÍTICA
======================= */
export const cartAPI = {
  getCart: () => fetchWithAuth('/api/cart'),

  // ➕ Adicionar item ao carrinho - VERSÃO SIMPLIFICADA E FUNCIONAL
  addToCart: async (produto_id: string | number, quantidade: number = 1) => {
    try {
      const { id: validatedId, isValid } = await productsAPI.validateProductId(produto_id)

      if (!isValid) {
        throw new Error(`Produto ID ${produto_id} é inválido ou não existe`)
      }

      console.log(`🛒 [cartAPI.addToCart] Enviando:`, { produto_id: validatedId, quantidade })

      return await fetchWithAuth('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          produto_id: validatedId,
          quantidade
        })
      })
    } catch (error) {
      console.error(`❌ [cartAPI.addToCart] Erro:`, error)
      throw error
    }
  },

  updateQuantity: (item_id: string, quantidade: number) =>
    fetchWithAuth(`/api/cart/${item_id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade })
    }),

  removeItem: (item_id: string) =>
    fetchWithAuth(`/api/cart/item/${item_id}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    fetchWithAuth('/api/cart/clear', {
      method: 'DELETE',
    }),

  syncLocalCart: async (localCart: Array<{ productId: string | number; quantity: number }>) => {
    const token = getToken()
    if (!token || localCart.length === 0) return { success: false, message: 'Nenhum item para sincronizar' }

    try {
      // Filtra apenas UUIDs válidos
      const validCartItems = []

      for (const item of localCart) {
        if (!item.productId) continue

        const idStr = item.productId.toString()

        // Aceita apenas UUIDs válidos
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)) {
          validCartItems.push(item)
        }
      }

      if (validCartItems.length === 0) {
        return { success: false, message: 'Nenhum item válido para sincronizar' }
      }

      // Limpa e adiciona itens válidos
      await cartAPI.clearCart()

      for (const item of validCartItems) {
        try {
          await cartAPI.addToCart(item.productId, item.quantity)
        } catch (error) {
          console.error(`⚠️ Erro ao sincronizar item ${item.productId}:`, error)
        }
      }

      return {
        success: true,
        totalItems: localCart.length,
        validItems: validCartItems.length,
      }
    } catch (error: any) {
      console.error(`❌ Erro ao sincronizar carrinho:`, error.message)
      return { success: false, message: error.message }
    }
  },
}

/* =======================
   PEDIDOS
======================= */
export const ordersAPI = {
  createOrder: (orderData: any) =>
    fetchWithAuth('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  getMyOrders: () => fetchWithAuth('/api/orders/my'),

  getOrderById: (orderId: string) => fetchWithAuth(`/api/orders/${orderId}`),

  // Criar pagamento Mercado Pago
  createMercadoPagoPayment: (orderId: string, returnUrl?: string) =>
    fetchWithAuth(`/api/orders/${orderId}/create-payment`, {
      method: 'POST',
      body: JSON.stringify({ return_url: returnUrl })
    }),

  // Verificar status do pagamento
  getPaymentStatus: (orderId: string) =>
    fetchWithAuth(`/api/orders/${orderId}/payment-status`),

  // Validar cupom
  validateCoupon: (couponCode: string, subtotal: number) =>
    fetchWithAuth('/api/orders/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ coupon_code: couponCode, subtotal })
    }),

  // Aplicar cupom a um pedido
  applyCoupon: (orderId: string, couponCode: string) =>
    fetchWithAuth(`/api/orders/${orderId}/apply-coupon`, {
      method: 'POST',
      body: JSON.stringify({ coupon_code: couponCode })
    }),

  // Remover cupom de um pedido
  removeCoupon: (orderId: string) =>
    fetchWithAuth(`/api/orders/${orderId}/remove-coupon`, {
      method: 'DELETE'
    }),

  // Buscar cupons do usuário
  getUserCoupons: () => fetchWithAuth('/api/orders/my-coupons'),

  // Buscar pedido por payment_id (necessário para as páginas de pagamento)
  getOrderByPaymentId: async (paymentId: string) => {
    // Você precisa criar essa rota no backend ou buscar via API
    try {
      const response = await fetchWithAuth(`/api/orders/payment/${paymentId}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar pedido por payment_id:', error)
      // Alternativa: buscar todos os pedidos e filtrar
      const { data: orders } = await ordersAPI.getMyOrders()
      const order = Array.isArray(orders) 
        ? orders.find(o => o.payment_id === paymentId) 
        : null
      return { success: !!order, data: order }
    }
  }
}

// 🔧 Adicione também uma função auxiliar para formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

}

/* =======================
   HELPERS PARA ECOMMERCE
======================= */
export const ecommerceHelpers = {
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  },

  getColors: (product: any): string[] => {
    if (product.produto_cores && Array.isArray(product.produto_cores)) {
      return product.produto_cores.map((cor: any) => cor.nome || cor.cor || 'Desconhecida')
    }

    if (product.cores && Array.isArray(product.cores)) {
      return product.cores
    }

    return ["Default"]
  },

  getMainImage: (product: any): string => {
    if (product.produto_midias && Array.isArray(product.produto_midias)) {
      const imagem = product.produto_midias.find((m: any) => m.tipo === 'imagem')
      return imagem?.url || product.produto_midias[0]?.url || "/placeholder.svg"
    }

    const image = product.midias?.find((m: any) => m.tipo === 'imagem')
    return image?.url || "/placeholder.svg"
  },

  adaptProductForGrid: (product: any) => {
    const mainImage = ecommerceHelpers.getMainImage(product)

    return {
      id: product.id?.toString() || '',
      name: product.nome || 'Produto sem nome',
      description: product.descricao || '',
      detailedDescription: product.descricao_detalhada,
      colors: ecommerceHelpers.getColors(product),
      category: product.categoria?.nome || "",
      price: ecommerceHelpers.formatPrice(product.preco || 0),
      originalPrice: product.preco_original ?
        ecommerceHelpers.formatPrice(product.preco_original) : undefined,
      rating: product.avaliacao || 4.5,
      reviewCount: product.total_avaliacoes || 0,
      hoverImage: mainImage,
      media: product.produto_midias?.map((media: any) => ({
        type: (media.tipo === 'imagem' ? 'image' : 'video') as "image" | "video",
        url: media.url || "/placeholder.svg",
        thumbnail: media.thumbnail || media.url || "/placeholder.svg"
      })) || [{
        type: "image" as const,
        url: mainImage,
        thumbnail: mainImage
      }],
      originalProduct: product
    }
  },

  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }
}

/* =======================
   UTILITÁRIOS DE ID DE PRODUTO
======================= */
export const productIdUtils = {
  isValidProductId: (id: string | number): boolean => {
    const idStr = id.toString()
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)
  },

  cleanLocalCart: (localCart: any[]): any[] => {
    if (!localCart || localCart.length === 0) return []

    return localCart.filter(item => {
      if (!item.productId) return false
      const idStr = item.productId.toString()
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)
    })
  }
}


/* =======================
   CLIENTES (PERFIL)
======================= */
export const clientProfileAPI = {
  getProfile: authAPI.getProfile, // Já existe

  updateProfile: async (data: {
    nome?: string;
    email?: string;
    whatsapp?: string;
    sexo?: string;
    endereco?: string;
  }) => {
    return fetchWithAuth('/api/clients/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return fetchWithAuth('/api/clients/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

/* =======================
   ENDEREÇOS
======================= */
export const addressAPI = {
  getMyAddresses: async (): Promise<any[]> => {
    try {
      const response = await fetchWithAuth('/api/clients/addresses')
      return response.data || response || []
    } catch (error) {
      console.error('❌ Erro ao buscar endereços:', error)
      return []
    }
  },

  createAddress: (data: any) => 
    fetchWithAuth('/api/clients/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAddress: (id: string, data: any) =>
    fetchWithAuth(`/api/clients/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAddress: (id: string) =>
    fetchWithAuth(`/api/clients/addresses/${id}`, {
      method: 'DELETE',
    }),

  setDefaultAddress: (id: string) =>
    fetchWithAuth(`/api/clients/addresses/${id}/default`, {
      method: 'PUT',
    }),
}

/* =======================
   FAVORITOS
======================= */
export const favoritesAPI = {
  getMyFavorites: async (): Promise<any[]> => {
    try {
      const response = await fetchWithAuth('/api/clients/favorites')
      return response.data || response || []
    } catch (error) {
      console.error('❌ Erro ao buscar favoritos:', error)
      return []
    }
  },

  addFavorite: (productId: string) =>
    fetchWithAuth('/api/clients/favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  removeFavorite: (favoriteId: string) =>
    fetchWithAuth(`/api/clients/favorites/${favoriteId}`, {
      method: 'DELETE',
    }),

  checkFavorite: (productId: string) =>
    fetchWithAuth(`/api/clients/favorites/check/${productId}`),
}

/* =======================
   PEDIDOS DO CLIENTE
======================= */
export const clientOrdersAPI = {
  getMyOrders: async (): Promise<any[]> => {
    try {
      const response = await fetchWithAuth('/api/orders/my')
      
      // Formata para o formato esperado
      if (response && Array.isArray(response)) {
        return response.map((order: any) => ({
          id: order.id,
          numero_pedido: order.id.substring(0, 8).toUpperCase(),
          status: order.status || 'pendente',
          total: order.total || order.valor_total || 0,
          data_criacao: order.created_at || order.data_criacao,
          itens: order.items?.map((item: any) => ({
            id: item.id,
            produto_nome: item.produto?.nome || 'Produto',
            quantidade: item.quantidade || 1,
            preco_unitario: item.preco || item.preco_unitario || 0
          })) || []
        }))
      }
      
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((order: any) => ({
          id: order.id,
          numero_pedido: order.id.substring(0, 8).toUpperCase(),
          status: order.status || 'pendente',
          total: order.total || order.valor_total || 0,
          data_criacao: order.created_at || order.data_criacao,
          itens: order.items?.map((item: any) => ({
            id: item.id,
            produto_nome: item.produto?.nome || 'Produto',
            quantidade: item.quantidade || 1,
            preco_unitario: item.preco || item.preco_unitario || 0
          })) || []
        }))
      }
      
      return []
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error)
      return []
    }
  },

  getOrderById: async (orderId: string) => {
    try {
      const response = await fetchWithAuth(`/api/orders/${orderId}`)
      
      if (response.success || response.id) {
        const order = response.data || response
        
        return {
          id: order.id,
          numero_pedido: order.id.substring(0, 8).toUpperCase(),
          status: order.status || 'pendente',
          total: order.total || order.valor_total || 0,
          data_criacao: order.created_at || order.data_criacao,
          subtotal: order.subtotal || 0,
          frete: order.frete || 0,
          desconto: order.desconto || 0,
          forma_pagamento: order.forma_pagamento || 'Não especificado',
          endereco_entrega: order.endereco_entrega || {},
          itens: order.items?.map((item: any) => ({
            id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto?.nome || 'Produto',
            quantidade: item.quantidade || 1,
            preco_unitario: item.preco || item.preco_unitario || 0,
            total: (item.quantidade || 1) * (item.preco || 0)
          })) || []
        }
        
      }

      throw new Error('Pedido não encontrado')
    } catch (error) {
      console.error('❌ Erro ao buscar pedido:', error)
      throw error
    }
  },
}

/* =======================
   CHECKOUT & FRETE
======================= */
export const checkoutAPI = {
  calculateShipping: async (cep: string, items: any[], subtotal: number) => {
    try {
      console.log("🚚 Calculando frete para CEP:", cep);
      
      // Tenta chamar o backend
      const response = await fetchWithAuth('/api/checkout/calculate-shipping', {
        method: 'POST',
        body: JSON.stringify({ cep, items, subtotal })
      });
      
      console.log("✅ Resposta do backend:", response);
      return response;
      
    } catch (error: any) {
      console.error('⚠️ Backend de frete não disponível:', error.message);
      console.log('🔄 Usando cálculo local como fallback...');
      
      // FALLBACK: cálculo local
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        return {
          success: false,
          error: "CEP inválido"
        };
      }
      
      let frete = 0;
      const freteGratis = subtotal > 200;
      
      if (freteGratis) {
        frete = 0;
      } else {
        const totalItems = items.reduce((sum, item) => sum + (item.quantidade || 1), 0);
        
        if (totalItems <= 2) frete = 15;
        else if (totalItems <= 5) frete = 25;
        else if (totalItems <= 10) frete = 35;
        else frete = 45;
      }
      
      return {
        success: true,
        data: {
          value: frete,
          formatted_value: `R$ ${frete.toFixed(2)}`,
          estimated_days: '3-7 dias úteis',
          service: freteGratis ? 'Grátis' : 'Padrão',
          free_shipping: freteGratis,
          details: {
            cep: cleanCEP,
            subtotal,
            items_count: items.length,
            total_items: items.reduce((sum, item) => sum + (item.quantidade || 1), 0)
          }
        }
      };
    }
  },


  // Buscar endereço por CEP (via API pública)
  getAddressByCEP: async (cep: string) => {
    try {
      // Remove caracteres não numéricos
      const cleanCEP = cep.replace(/\D/g, '')
      
      if (cleanCEP.length !== 8) {
        return { success: false, error: 'CEP inválido' }
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await response.json()

      if (data.erro) {
        return { success: false, error: 'CEP não encontrado' }
      }

      return {
        success: true,
        data: {
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          cep: data.cep
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      return { success: false, error: 'Erro ao buscar endereço' }
    }
  }
}

/* =======================
   FUNÇÕES DE FORMATAÇÃO
======================= */
export const formatCEP = (cep: string): string => {
  const clean = cep.replace(/\D/g, '')
  if (clean.length === 8) {
    return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }
  return cep
}

export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) {
    return clean.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  if (clean.length === 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }
  return phone
}

/* =======================
   EXPORT DEFAULT
======================= */
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  helpers: ecommerceHelpers,
  productIdUtils,
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  checkoutAPI,
  BASE_URL,

}