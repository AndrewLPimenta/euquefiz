"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import { AuthService } from "@/lib/auth"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const localKey = "cached_orders"

  const fetchOrders = async () => {
    if (!AuthService.isAuthenticated()) {
      console.warn("Usuário não logado. Orders são privadas.")
      const saved = localStorage.getItem(localKey)
      if (saved) setOrders(JSON.parse(saved))
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await api.orders.getMyOrders()
      if (!res.success) throw new Error(res.error || "Erro ao buscar pedidos")

      setOrders(res.orders)
      localStorage.setItem(localKey, JSON.stringify(res.orders))
    } catch (err: any) {
      console.error("Erro ao carregar pedidos:", err)
      toast.error("Não foi possível carregar pedidos. Usando cache local se disponível.")

      const saved = localStorage.getItem(localKey)
      if (saved) setOrders(JSON.parse(saved))
    } finally {
      setLoading(false)
    }
  }

  const getOrderById = (id: string) => orders.find((o) => o.id === id)

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    fetchOrders,
    getOrderById,
  }
}
