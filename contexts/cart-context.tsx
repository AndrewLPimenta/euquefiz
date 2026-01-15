"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { cartAPI, isAuthenticated as checkAuth } from "@/lib/api"
import { toast } from "sonner"

/* =======================
   TIPOS
======================= */
interface CartItem {
  id: string              // ID DO ITEM NO CARRINHO
  productId: string       // ID DO PRODUTO
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  isCartOpen: boolean

  addItem: (product: any, quantity?: number) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>

  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

/* =======================
   ADAPTER (API → FRONT)
======================= */
function adaptApiCartToItems(apiCart: any[]): CartItem[] {
  return apiCart.map(item => ({
    id: item.id, // 🔴 ID DO ITEM DO CARRINHO
    productId: item.produto_id,
    name: item.produtos?.nome ?? "Produto",
    price: Number(item.produtos?.preco ?? 0),
    quantity: item.quantidade,
    image:
      item.produtos?.produto_midias?.[0]?.url ??
      "/placeholder.svg",
  }))
}

/* =======================
   CONTEXT
======================= */
const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  /* =======================
     LOAD CART
  ======================= */
  const loadCart = async () => {
    setIsLoading(true)

    try {
      // 🔹 NÃO LOGADO → LOCAL
      if (!checkAuth()) {
        const saved = localStorage.getItem("cart")
        setItems(saved ? JSON.parse(saved) : [])
        return
      }

      // 🔹 LOGADO → API
      const data = await cartAPI.getCart()
      const adapted = adaptApiCartToItems(data.cart ?? [])

      setItems(adapted)
      localStorage.setItem("cart", JSON.stringify(adapted))
    } catch (err) {
      console.error("❌ Erro ao carregar carrinho:", err)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     ADD ITEM
  ======================= */
  const addItem = async (product: any, quantity = 1) => {
    try {
      setIsLoading(true)

      if (!checkAuth()) {
        setItems(prev => {
          const existing = prev.find(i => i.productId === product.id)

          const updated = existing
            ? prev.map(i =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  productId: product.id,
                  name: product.nome,
                  price: product.preco,
                  quantity,
                  image:
                    product.produto_midias?.[0]?.url ??
                    "/placeholder.svg",
                },
              ]

          localStorage.setItem("cart", JSON.stringify(updated))
          return updated
        })

        setIsCartOpen(true)
        toast.success("Produto adicionado ao carrinho")
        return
      }

      await cartAPI.addToCart(product.id, quantity)
      await loadCart()

      setIsCartOpen(true)
      toast.success("Produto adicionado ao carrinho")
    } catch (err) {
      console.error("❌ Erro ao adicionar item:", err)
      toast.error("Erro ao adicionar produto")
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     UPDATE QUANTITY (🔥 CORRETO)
  ======================= */
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return

    try {
      setIsLoading(true)

      if (!checkAuth()) {
        setItems(prev => {
          const updated = prev.map(item =>
            item.id === cartItemId
              ? { ...item, quantity }
              : item
          )
          localStorage.setItem("cart", JSON.stringify(updated))
          return updated
        })

        toast.success("Quantidade atualizada")
        return
      }

      // 🔴 cartItemId = carrinho.id
      await cartAPI.updateQuantity(cartItemId, quantity)
      await loadCart()

      toast.success("Quantidade atualizada")
    } catch (err) {
      console.error("❌ Erro ao atualizar quantidade:", err)
      toast.error("Erro ao atualizar quantidade")
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     REMOVE ITEM
  ======================= */
  const removeItem = async (cartItemId: string) => {
    try {
      setIsLoading(true)

      if (!checkAuth()) {
        setItems(prev => {
          const updated = prev.filter(i => i.id !== cartItemId)
          localStorage.setItem("cart", JSON.stringify(updated))
          return updated
        })

        toast.success("Item removido")
        return
      }

      await cartAPI.removeItem(cartItemId)
      await loadCart()

      toast.success("Item removido")
    } catch (err) {
      console.error("❌ Erro ao remover item:", err)
      toast.error("Erro ao remover item")
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     CLEAR CART
  ======================= */
  const clearCart = async () => {
    try {
      setIsLoading(true)

      if (checkAuth()) {
        await cartAPI.clearCart()
      }

      setItems([])
      localStorage.removeItem("cart")
      toast.success("Carrinho limpo")
    } catch (err) {
      console.error("❌ Erro ao limpar carrinho:", err)
      toast.error("Erro ao limpar carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     UI HELPERS
  ======================= */
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen(prev => !prev)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )

  useEffect(() => {
    loadCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        isCartOpen,

        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: loadCart,

        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/* =======================
   HOOK
======================= */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider")
  }
  return ctx
}
