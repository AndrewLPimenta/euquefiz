import { useState, useEffect } from "react"
import { productsAPI, ecommerceHelpers } from "@/lib/api"
import { toast } from "sonner"

export function useCategoryProducts(slug: string, limit: number = 12) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async (reset: boolean = false) => {
    if (!slug) return
    setLoading(true)
    try {
      const res = await productsAPI.getByCategorySlug(slug, { page, limit })
      const validProducts = res.data.filter((p: any) => !/^\d+$/.test(p.id?.toString()))
      const adaptedProducts = (res.data || []).map((p: any) => ecommerceHelpers.adaptProductForGrid(p))

      setProducts(prev => reset ? adaptedProducts : [...prev, ...adaptedProducts])
      setTotalPages(res.totalPages)
    } catch (err: any) {
      console.error(err)
      setError("Não foi possível carregar produtos")
      toast.error("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(true)
  }, [slug, page])

  return { products, loading, error, page, totalPages, setPage, fetchProducts }
}
