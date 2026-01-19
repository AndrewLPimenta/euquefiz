"use client"

import { useEffect, useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import WhatsAppButton from "@/components/whatsapp"
import { useParams } from 'next/navigation'
import { categoriesAPI, productsAPI, ecommerceHelpers } from '@/lib/api'
import { toast } from 'sonner'
import Head from 'next/head'

interface Product {
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
  media?: Array<{
    type: "image" | "video"
    url: string
    thumbnail?: string
  }>
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  async function loadData(reset: boolean = true) {
    if (!slug) return
    
    try {
      setLoading(true)
      setError(null)

      // 🚨 PROBLEMA 1: categoryResponse pode ser undefined
      const categoryResponse = await categoriesAPI.getBySlug(slug)
      
      if (!categoryResponse?.success) {
        setError(categoryResponse?.error || 'Categoria não encontrada')
        return
      }
      
      setCategory(categoryResponse.data)

      // 🚨 PROBLEMA 2: productsResponse pode ter estrutura diferente
      const productsResponse = await productsAPI.getByCategorySlug(slug, { page, limit })
      
      console.log("🔍 DEBUG productsResponse:", productsResponse) // Adicione para debug
      
      // 🚨 PROBLEMA 3: productsResponse.data pode ser undefined
      const productsData = productsResponse?.data || []
      const totalPagesValue = productsResponse?.totalPages || 1

      // 🚨 PROBLEMA 4: Adaptação de produtos com fallbacks robustos
      const adaptedProducts: Product[] = productsData.map((p: any) => {
        try {
          const adapted = ecommerceHelpers.adaptProductForGrid(p)
          
          // Garantir que temos um ID válido
          const idFinal = p?.id?.toString() || 
                         adapted?.id?.toString() || 
                         `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          
          // Garantir nome e descrição
          const productName = p?.nome || adapted?.name || "Produto sem nome"
          const productDescription = p?.descricao || adapted?.description || ""
          
          // Garantir preço formatado
          const priceStr = adapted?.price || "R$ 0,00"
          
          // Garantir cores
          const productColors = adapted?.colors || ["Default"]
          
          // Garantir mídia
          const productMedia = adapted?.media || [{
            type: "image" as const,
            url: "/placeholder.svg",
            thumbnail: "/placeholder.svg"
          }]

          return {
            id: idFinal,
            name: productName,
            description: productDescription,
            detailedDescription: p?.descricao_detalhada || adapted?.detailedDescription,
            colors: productColors,
            category: p?.categoria?.nome || adapted?.category || categoryResponse.data?.nome || "",
            price: priceStr,
            originalPrice: adapted?.originalPrice,
            hoverImage: adapted?.hoverImage || productMedia[0]?.url,
            rating: p?.avaliacao || adapted?.rating || 4.5,
            reviewCount: p?.total_avaliacoes || adapted?.reviewCount || 0,
            media: productMedia,
          }
        } catch (error) {
          console.error("❌ Erro ao adaptar produto:", p, error)
          // Retorna um produto placeholder em caso de erro
          return {
            id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: "Produto não disponível",
            description: "Este produto não pôde ser carregado",
            colors: ["Default"],
            category: categoryResponse.data?.nome || "",
            price: "R$ 0,00",
            hoverImage: "/placeholder.svg",
            rating: 0,
            reviewCount: 0,
            media: [{
              type: "image" as const,
              url: "/placeholder.svg",
              thumbnail: "/placeholder.svg"
            }]
          }
        }
      })

      const validProducts = adaptedProducts.filter(p => 
        p.id && p.name && p.price !== "R$ 0,00"
      )

      if (validProducts.length === 0 && productsData.length > 0) {
        console.warn("⚠️ Nenhum produto válido após adaptação")
        setError("Os produtos não puderam ser carregados corretamente")
      }

      setProducts(prev => reset ? validProducts : [...prev, ...validProducts])
      setTotalPages(totalPagesValue)

    } catch (err: any) {
      console.error("❌ Erro no loadData:", err)
      
      // Mensagem de erro mais específica
      let errorMessage = 'Não foi possível carregar os produtos desta categoria.'
      
      if (err.message?.includes('404') || err.message?.includes('não encontrada')) {
        errorMessage = 'Categoria não encontrada.'
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Problema de conexão. Verifique sua internet.'
      } else if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Acesso não autorizado.'
      }
      
      toast.error(errorMessage)
      setError(errorMessage)
      
      // Limpa produtos em caso de erro
      if (reset) {
        setProducts([])
      }
    } finally {
      setLoading(false)
    }
  }

  loadData(true)
}, [slug, page, limit]) // 🚨 Adicione limit nas dependências
  if (loading) return <LoadingScreen message="Carregando produtos..." />
  if (error || !category) return <ErrorScreen message={error || 'Categoria não encontrada'} />

  return (
    <>
      <Head>
        <title>{category.nome} | Euquefiz</title>
        <meta name="description" content={category.descricao || `Coleção exclusiva de ${category.nome.toLowerCase()}`} />
      </Head>

      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center w-full flex-2 px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">
          <CategoryHeader category={category} productsCount={products.length} />
          {products.length > 0 ? (
            <div className="w-full max-w-7xl">
              <ProductRevealGridAdapter products={products} title="" description="" columns={4} categorySlug={slug} />
            </div>
          ) : <EmptyState categoryName={category.nome} />}
        </main>
        <WhatsAppButton message={`Olá, gostaria de mais informações sobre os produtos da categoria ${category.nome}!`} buttonText="" position="bottom-right" />
        <Footer />
      </div>
    </>
  )
}

// ✅ Componentes auxiliares
const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400 mb-4"></div>
    <p>{message}</p>
  </div>
)

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-2xl font-bold mb-4">Erro</h1>
    <p>{message}</p>
  </div>
)

const CategoryHeader = ({ category, productsCount }: { category: any, productsCount: number }) => (
  <div className="w-full max-w-7xl mb-8 sm:mb-10 bg-background">
    <div className="bg-background color-text rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-900 mb-2">{category.nome}</h1>
        <p className="text-600 max-w-2xl">{category.descricao || `Explore nossa coleção exclusiva de ${category.nome.toLowerCase()}.`}</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <span className="inline-block text-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">{productsCount} {productsCount === 1 ? 'produto' : 'produtos'}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ categoryName }: { categoryName: string }) => (
  <div className="w-full max-w-7xl text-center py-12">
    <p>Ainda não temos produtos na categoria {categoryName}.</p>
  </div>
)
