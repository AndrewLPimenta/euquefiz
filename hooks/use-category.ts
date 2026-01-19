"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { categoriesAPI, productsAPI, ecommerceHelpers } from "@/lib/api"

export interface Product {
  id: string
  name: string
  description: string
  detailedDescription?: string
  colors: string[]
  category: string
  price: string
  originalPrice?: string
  hoverImage?: string
  rating?: number
  reviewCount?: number
  media?: Array<{ type: "image" | "video"; url: string; thumbnail?: string }>
}

export function useCategoryProducts(slug?: string, limit: number = 12) {
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function loadData(reset: boolean = true) {
      try {
        setLoading(true)
        setError(null)

        let categoryData = null
        if (slug) {
          const catRes = await categoriesAPI.getBySlug(slug)
          if (!catRes.success) throw new Error(catRes.error || "Categoria não encontrada")
          categoryData = catRes.data
          setCategory(categoryData)
        } else {
          setCategory({ nome: "Todos os produtos", descricao: "Confira nossa seleção completa." })
        }

        // Busca produtos
        const productsRes: any = slug
          ? await productsAPI.getByCategorySlug(slug, { page, limit })
          : await productsAPI.getAll({ cache: "no-store" })

        // Remove produtos inválidos (IDs numéricos)
        const validProducts = productsRes.filter((p: any) => !/^\d+$/.test(p.id?.toString()))

        const adapted = validProducts.map((p: any) => ecommerceHelpers.adaptProductForGrid(p))

        setProducts(prev => (reset ? adapted : [...prev, ...adapted]))
        setTotalPages(productsRes.totalPages || 1)
      } catch (err: any) {
        console.error("Erro ao carregar produtos/categoria:", err)
        setError(err.message || "Erro ao carregar produtos")
        toast.error(err.message || "Erro ao carregar produtos")
      } finally {
        setLoading(false)
      }
    }

    loadData(true)
  }, [slug, page])

  const nextPage = () => setPage(prev => (prev < totalPages ? prev + 1 : prev))
  const prevPage = () => setPage(prev => (prev > 1 ? prev - 1 : prev))

  return { category, products, loading, error, page, totalPages, nextPage, prevPage, setPage }
}
