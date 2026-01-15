// app/ecommerce/category/[slug]/page.tsx - VERSÃO CORRIGIDA
"use client"

import { useEffect, useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import WhatsAppButton from "@/components/whatsapp"
import { useParams } from 'next/navigation'
import { categoriesAPI, productsAPI, ecommerceHelpers } from '@/lib/api'
import { toast } from 'sonner'

interface Product {
  id: string // MUDADO: Agora é string (UUID)
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
  
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!slug) return
      
      try {
        setLoading(true)
        console.log(`📂 Carregando categoria: ${slug}`)
        
        // Carrega a categoria
        const categoryResponse = await categoriesAPI.getBySlug(slug)
        if (!categoryResponse.success) {
          setError(categoryResponse.error || 'Categoria não encontrada')
          return
        }
        
        setCategory(categoryResponse.data)
        console.log(`✅ Categoria encontrada: ${categoryResponse.data.nome}`)
        
        // Carrega produtos da categoria
        console.log(`📦 Buscando produtos para categoria...`)
        const productsData = await productsAPI.getByCategory(slug)
        console.log(`📦 Produtos recebidos: ${productsData.length}`)
        
        // VALIDAÇÃO CRÍTICA: Remove produtos com IDs numéricos
        const validProducts = productsData.filter((product: any) => {
          const idStr = product.id?.toString() || ''
          const isNumeric = /^\d+$/.test(idStr)
          
          if (isNumeric) {
            console.warn(`⚠️ Produto ignorado (ID numérico): ${idStr} - ${product.nome}`)
            return false
          }
          
          return true
        })
        
        console.log(`✅ Produtos válidos: ${validProducts.length}/${productsData.length}`)
        
        // Adapta os produtos para o formato esperado pelo componente
        const adaptedProducts: Product[] = validProducts.map((product: any) => {
          // LOG CRÍTICO: Verificar o ID
          console.log(`🔄 Adaptando produto:`, {
            id_original: product.id,
            tipo_id: typeof product.id,
            nome: product.nome
          })
          
          // Usa o helper de adaptação que já existe no seu lib/api.ts
          const adapted = ecommerceHelpers.adaptProductForGrid(product)
          
          // VERIFICAÇÃO FINAL: Garantir que não estamos usando IDs numéricos
          const finalId = product.id?.toString() || adapted.id?.toString() || ''
          
          if (/^\d+$/.test(finalId)) {
            console.error(`❌ ERRO: ID ainda numérico após adaptação: ${finalId} - ${product.nome}`)
            // Gera um ID placeholder baseado no UUID real
            return {
              ...adapted,
              id: `placeholder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: product.nome || adapted.name,
              description: product.descricao || adapted.description,
              detailedDescription: product.descricao_detalhada || adapted.detailedDescription,
              colors: adapted.colors,
              category: product.categoria?.nome || adapted.category || "",
              price: adapted.price,
              originalPrice: adapted.originalPrice,
              hoverImage: adapted.hoverImage,
              rating: product.avaliacao || adapted.rating || 4.5,
              reviewCount: product.total_avaliacoes || adapted.reviewCount || 0,
              media: adapted.media
            }
          }
          
          return {
            ...adapted,
            id: finalId, // MANTÉM o UUID como string
            name: product.nome || adapted.name,
            description: product.descricao || adapted.description,
            detailedDescription: product.descricao_detalhada || adapted.detailedDescription,
            colors: adapted.colors,
            category: product.categoria?.nome || adapted.category || "",
            price: adapted.price,
            originalPrice: adapted.originalPrice,
            hoverImage: adapted.hoverImage,
            rating: product.avaliacao || adapted.rating || 4.5,
            reviewCount: product.total_avaliacoes || adapted.reviewCount || 0,
            media: adapted.media
          }
        })
        
        // LOG FINAL: Verificar produtos adaptados
        console.log('📊 Produtos adaptados:', adaptedProducts.map(p => ({
          id: p.id,
          tipo: typeof p.id,
          nome: p.name
        })))
        
        setProducts(adaptedProducts)
        
      } catch (err: any) {
        console.error('❌ Erro ao carregar dados:', err)
        setError('Não foi possível carregar os produtos desta categoria.')
        toast.error('Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-10 mt-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400 mb-4"></div>
            <p className="text-600">Carregando produtos...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-10 mt-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-900 mb-4">Categoria não encontrada</h1>
            <p className="text-600 mb-6">{error || 'A categoria solicitada não existe.'}</p>
            <a 
              href="/ecommerce" 
              className="inline-block bg-background-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Voltar ao ínicio
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-2 px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">

        <div className="w-full max-w-7xl mb-8 sm:mb-10 bg-background" >
          <div className="bg-background color-text rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text--900 mb-2">
                  {category.nome}
                </h1>
                <p className="text-600 max-w-2xl">
                  {category.descricao || `Explore nossa coleção exclusiva de ${category.nome.toLowerCase()}.`}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="inline-block text-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {products.length} {products.length === 1 ? 'produto' : 'produtos'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de produtos */}
        {products.length > 0 ? (
          <div className="w-full max-w-7xl">
            <ProductRevealGridAdapter
              products={products}
              title=""
              description=""
              columns={4}
              categorySlug={slug}
            />
          </div>
        ) : (
          <div className="w-full max-w-7xl text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum produto disponível
              </h2>
              <p className="text-gray-600 mb-6">
                Ainda não temos produtos na categoria {category.nome}.
              </p>
              <a 
                href="/ecommerce" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Ver todos os produtos
              </a>
            </div>
          </div>
        )}
      </main>

      <WhatsAppButton
        message={`Olá, gostaria de mais informações sobre os produtos da categoria ${category.nome}!`}
        buttonText=""
        position="bottom-right"
      />
      
      <Footer />
    </div>
  )
}