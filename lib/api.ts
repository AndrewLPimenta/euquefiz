// lib/api.ts - VERSÃO FINAL CORRIGIDA
const BASE_URL = process.env.NEXT_PUBLIC_API_URL 

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
  }) => fetchPublicAPI("/api/clients/register", {
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
    
    if (!token) {
      throw new Error('Token não encontrado')
    }
    
    return fetch(`${BASE_URL}/api/clients/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
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
  
  getByCategorySlug: async (categorySlug: string) => {
    try {
      const categoryResponse = await categoriesAPI.getBySlug(categorySlug)
      
      if (!categoryResponse.success || !categoryResponse.data) {
        return []
      }
      
      const category = categoryResponse.data
      const allProducts = await productsAPI.getAll()
      
      const productsArray = Array.isArray(allProducts)
        ? allProducts
        : allProducts?.data || allProducts?.produtos || []
      
      return productsArray.filter((product: any) => 
        product.categoria_id === category.id
      )
    } catch (error) {
      return []
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
  BASE_URL,
}