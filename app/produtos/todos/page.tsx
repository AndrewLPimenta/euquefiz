"use client"

import { useEffect, useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import WhatsAppButton from "@/components/whatsapp"
import { productsAPI, ecommerceHelpers } from '@/lib/api'
import { toast } from 'sonner'
import Head from 'next/head'

export default function AllProductsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData(reset: boolean = true) {
      try {
        setLoading(true)
        setError(null)
        const productsResponse: any = await productsAPI.getAll()

        const adaptedProducts = (productsResponse.data || []).map((p: any) => {
          const adapted = ecommerceHelpers.adaptProductForGrid(p)
          return {
            ...adapted,
            id: p.id?.toString() || `placeholder-${Date.now()}-${Math.random()}`,
            name: p.nome || adapted.name,
            description: p.descricao || adapted.description,
            detailedDescription: p.descricao_detalhada || adapted.detailedDescription,
            colors: adapted.colors,
            category: p.categoria?.nome || adapted.category || "",
            price: adapted.price,
            originalPrice: adapted.originalPrice,
            hoverImage: adapted.hoverImage,
            rating: p.avaliacao || adapted.rating || 4.5,
            reviewCount: p.total_avaliacoes || adapted.reviewCount || 0,
            media: adapted.media,
          }
        })

        setProducts(prev => reset ? adaptedProducts : [...prev, ...adaptedProducts])
        setTotalPages(productsResponse.totalPages || 1)

      } catch (err: any) {
        console.error(err)
        setError('Não foi possível carregar os produtos.')
        toast.error('Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }

    loadData(true)
  }, [page])

  if (loading) return <LoadingScreen message="Carregando todos os produtos..." />
  if (error) return <ErrorScreen message={error} />

  return (
    <>
      <Head>
        <title>Todos os Produtos | Euquefiz</title>
        <meta name="description" content="Explore todos os produtos disponíveis na nossa loja." />
      </Head>

      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center w-full flex-2 px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">
          <CategoryHeader title="Todos os Produtos" productsCount={products.length} />
          {products.length > 0 ? (
            <div className="w-full max-w-7xl">
              <ProductRevealGridAdapter products={products} title="" description="" columns={4} />
            </div>
          ) : <EmptyState categoryName="Todos os Produtos" />}
        </main>
        <WhatsAppButton message={`Olá, gostaria de mais informações sobre os produtos!`} buttonText="" position="bottom-right" />
        <Footer />
      </div>
    </>
  )
}

// Reaproveitando componentes auxiliares
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

const CategoryHeader = ({ title, productsCount }: { title: string, productsCount: number }) => (
  <div className="w-full max-w-7xl mb-8 sm:mb-10 bg-background">
    <div className="bg-background color-text rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-900 mb-2">{title}</h1>
      </div>
      <div className="mt-4 sm:mt-0">
        <span className="inline-block text-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">{productsCount} {productsCount === 1 ? 'produto' : 'produtos'}</span>
      </div>
    </div>
  </div>
)

const EmptyState = ({ categoryName }: { categoryName: string }) => (
  <div className="w-full max-w-7xl text-center py-12">
    <p>Ainda não temos produtos em {categoryName}.</p>
  </div>
)
