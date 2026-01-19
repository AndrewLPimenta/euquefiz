"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { publicAPI } from "@/lib/api/public"
import api from "@/lib/api"
import { AuthService } from "@/lib/auth"

export interface Product {
  id: string
  nome: string
  slug: string
  descricao?: string
  preco: number
  preco_original?: number
  categoria_id: string
  produto_midias: { url: string }[]
  produto_cores?: { nome: string }[]
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cache local para fallback offline
  const localKey = "cached_products"
  const localCatKey = "cached_categories"

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let data: Product[] = []

      if (AuthService.isAuthenticated()) {
        // Usuário logado → busca API autenticada
        const res = await api.products.getAll()
        if (!res.success) throw new Error(res.error || "Erro ao buscar produtos")
        data = res.products
      } else {
        // Usuário não logado → busca API pública
        data = await publicAPI.getProducts()
      }

      setProducts(data)
      localStorage.setItem(localKey, JSON.stringify(data))
    } catch (err: any) {
      console.error("Erro ao carregar produtos:", err)
      toast.error("Não foi possível carregar produtos. Usando dados offline se disponíveis.")

      // Fallback offline
      const saved = localStorage.getItem(localKey)
      if (saved) setProducts(JSON.parse(saved))
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      let data: any[] = []
      if (AuthService.isAuthenticated()) {
        const res = await api.categories.getAll()
        if (res.success) data = res.categories
      } else {
        data = await publicAPI.getCategories()
      }
      setCategories(data)
      localStorage.setItem(localCatKey, JSON.stringify(data))
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
      const saved = localStorage.getItem(localCatKey)
      if (saved) setCategories(JSON.parse(saved))
    }
  }

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)
  const getProductsByCategory = (catId: string) =>
    products.filter((p) => p.categoria_id === catId)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return {
    products,
    categories,
    loading,
    fetchProducts,
    fetchCategories,
    getProductBySlug,
    getProductsByCategory,
  }
}
