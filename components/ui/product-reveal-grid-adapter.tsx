"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"
import { ProductModal } from "@/components/product-modal"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { productsAPI, ecommerceHelpers } from "@/lib/api"

interface MediaItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface Product {
  id: number | string
  name: string
  description: string
  detailedDescription?: string
  colors?: string[]
  category?: string
  price: string | number
  originalPrice?: string | number
  rating?: number
  reviewCount?: number
  media?: MediaItem[]
  produto_midias?: Array<{ url: string; tipo: string; thumbnail?: string }>
  imagem?: string
  image?: string
  preco?: string | number
  preco_original?: string | number
  descricao?: string
  descricao_detalhada?: string
  avaliacao?: number
  total_avaliacoes?: number
  categoria?: { nome: string }
}

interface ProductRevealGridAdapterProps {
  products?: Product[] // Tornado opcional
  title?: string
  description?: string
  columns?: 1 | 2 | 3 | 4
  className?: string
  onProductClick?: (product: Product) => void
  categorySlug?: string
  featured?: boolean
  enableAnimations?: boolean
}

export function ProductRevealGridAdapter({
  products: initialProducts = [], // Valor padrão
  title,
  description: gridDescription,
  columns = 4,
  className,
  onProductClick,
  categorySlug,
  featured = false,
  enableAnimations = true,
}: ProductRevealGridAdapterProps) {
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  // Buscar produtos por categoria ou destaque
 useEffect(() => {
  const fetchProducts = async () => {
    if (categorySlug || featured) {
      setIsLoading(true)
      try {
        console.log('📦 [GridAdapter] Buscando produtos...', { categorySlug, featured })

        let fetchedProducts: any[] = []

        if (categorySlug) {
          // 🚨 CORREÇÃO: Pegue o .data da resposta
          const categoryResponse = await productsAPI.getByCategory(categorySlug)
          console.log('📊 [GridAdapter] Resposta da categoria:', categoryResponse)
          
          // Extrai o array de produtos
          fetchedProducts = Array.isArray(categoryResponse) 
            ? categoryResponse 
            : categoryResponse?.data || []
            
          console.log('📦 [GridAdapter] Produtos extraídos:', fetchedProducts.length, 'itens')
        }
        else if (featured) {
          const featuredData = await productsAPI.getFeatured()
          console.log('📊 [GridAdapter] Resposta destaque:', featuredData)
          
          // Extrai o array de produtos
          fetchedProducts = Array.isArray(featuredData) 
            ? featuredData 
            : featuredData?.data || []
        }

        // 🚨 VERIFIQUE se fetchedProducts é realmente um array
        console.log('🔍 [GridAdapter] fetchedProducts é array?', Array.isArray(fetchedProducts))
        console.log('📋 [GridAdapter] Tipo:', typeof fetchedProducts)
        console.log('📋 [GridAdapter] Valor:', fetchedProducts)

        if (!Array.isArray(fetchedProducts)) {
          console.error('❌ [GridAdapter] fetchedProducts não é array:', fetchedProducts)
          toast.error('Erro: formato de dados inválido')
          setProducts([])
          return
        }

        // Debug detalhado dos produtos
        if (fetchedProducts.length > 0) {
          console.log('📦 [GridAdapter] Primeiro produto:', {
            id: fetchedProducts[0]?.id,
            tipo: typeof fetchedProducts[0]?.id,
            nome: fetchedProducts[0]?.nome,
            estrutura: Object.keys(fetchedProducts[0] || {})
          })
        }

        const formattedProducts = fetchedProducts.map(product =>
          ecommerceHelpers.adaptProductForGrid(product)
        )

        console.log('✅ [GridAdapter] Produtos formatados:', formattedProducts.length)
        setProducts(formattedProducts)
        
      } catch (error) {
        console.error('❌ [GridAdapter] Erro ao buscar produtos:', error)
        toast.error('Erro ao carregar produtos')
        setProducts([]) // Limpa produtos em caso de erro
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (categorySlug || featured) {
    fetchProducts()
  }
}, [categorySlug, featured])
  const parsePrice = (value?: string | number): number => {
    if (!value) return 0
    if (typeof value === 'number') return value

    const stringValue = value.toString()
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()

    return parseFloat(stringValue) || 0
  }

  const convertToProductRevealProps = (product: Product) => {
    const mainImage = ecommerceHelpers.getMainImage(product)
    const hoverImage = product.media?.find(m => m.type === "video")?.thumbnail ||
      product.media?.find(m => m.type === "image")?.url ||
      mainImage

    const colors = ecommerceHelpers.getColors(product)

    const { id, ...productWithoutId } = product

    return {
      name: product.name,
      price: parsePrice(product.price) || parsePrice(product.preco) || 0,
      originalPrice: parsePrice(product.originalPrice) || parsePrice(product.preco_original),
      image: mainImage,
      hoverImage: hoverImage,
      description: product.detailedDescription || product.description || product.descricao || "",
      rating: product.rating || product.avaliacao || 4.5,
      reviewCount: product.reviewCount || product.total_avaliacoes || 0,
      productData: {
        id: product.id.toString(), // Mantém o id convertido para string
        nome: product.name,
        preco: parsePrice(product.price) || parsePrice(product.preco) || 0,
        produto_midias: product.produto_midias || product.media?.map(m => ({
          url: m.url,
          tipo: m.type === 'image' ? 'imagem' : 'video',
          thumbnail: m.thumbnail
        })) || [],
        cores: colors,
        ...productWithoutId // Outras propriedades mantidas sem o id original
      },
      productId: product.id.toString(),
      enableAnimations,
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      const cartProduct = {
        nome: product.name,
        preco: parsePrice(product.price) || parsePrice(product.preco) || 0,
        produto_midias: product.produto_midias || product.media?.map(m => ({
          url: m.url,
          tipo: m.type === 'image' ? 'imagem' : 'video',
          thumbnail: m.thumbnail
        })) || [],
        imagem: ecommerceHelpers.getMainImage(product),
        image: ecommerceHelpers.getMainImage(product),
        descricao: product.description || product.descricao || "",
        hoverImage: product.media?.find(m => m.type === 'video')?.thumbnail ||
          product.media?.find(m => m.type === 'image')?.url,
        rating: product.rating || product.avaliacao,
        reviewCount: product.reviewCount || product.total_avaliacoes,
        originalPrice: parsePrice(product.originalPrice) || parsePrice(product.preco_original),
        colors: ecommerceHelpers.getColors(product),
        category: product.category,
        ...product
      }

      await addItem(cartProduct, 1)
      toast.success(`${product.name} adicionado ao carrinho!`)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      toast.error("Erro ao adicionar produto ao carrinho")
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    onProductClick?.(product)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const handleModalAddToCart = async () => {
    if (selectedProduct) {
      await handleAddToCart(selectedProduct)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("w-full p-5", className)}>
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {gridDescription && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {gridDescription}
              </p>
            )}
          </div>
        )}
        <div className={cn("grid gap-8", gridCols[columns])}>
          {[...Array(columns * 2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-2xl mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className={cn("w-full p-5 text-center", className)}>
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {gridDescription && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {gridDescription}
              </p>
            )}
          </div>
        )}
        <div className="py-12">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-muted-foreground">
            {categorySlug
              ? `Não há produtos na categoria "${categorySlug}"`
              : featured
                ? "Não há produtos em destaque no momento"
                : "Não há produtos disponíveis"}
          </p>
        </div>
      </div>
    )
  }

  const getModalProps = () => {
    if (!selectedProduct) return null;

    const media = selectedProduct.media?.length
      ? selectedProduct.media.map((item) => ({
        type: item.type,
        url: item.url?.startsWith("@/") ? item.url.replace("@/", "/") : item.url || "/placeholder.svg",
        thumbnail: item.thumbnail?.startsWith("@/") ? item.thumbnail.replace("@/", "/") : item.thumbnail,
      }))
      : selectedProduct.produto_midias?.map(mid => ({
        type: (mid.tipo === 'imagem' ? 'image' : 'video') as "image" | "video",
        url: mid.url || "/placeholder.svg",
        thumbnail: mid.thumbnail || mid.url
      })) || [{ type: "image", url: "/placeholder.svg" }];

    return {
      name: selectedProduct.name,
      price: parsePrice(selectedProduct.price) || 0,
      originalPrice: parsePrice(selectedProduct.originalPrice),
      description: selectedProduct.detailedDescription ||
        selectedProduct.description ||
        selectedProduct.descricao ||
        "",
      rating: selectedProduct.rating || selectedProduct.avaliacao,
      reviewCount: selectedProduct.reviewCount || selectedProduct.total_avaliacoes,
      colors: ecommerceHelpers.getColors(selectedProduct),
      media: media,
      open: isModalOpen,
      onClose: handleCloseModal,
      onAddToCart: handleModalAddToCart,
    };
  };

  const modalProps = getModalProps();

  return (
    <div className={cn("w-full p-5", className)}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {gridDescription && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {gridDescription}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-8", gridCols[columns])}>
        {products.map((product) => {
          const props = convertToProductRevealProps(product)

          return (
            <ProductRevealCard
              key={product.id.toString()}
              {...props}
              onAdd={() => handleAddToCart(product)}
              onFavorite={() => {
                console.log("Toggle favorite:", product.id)
                toast.info("Funcionalidade de favoritos em desenvolvimento")
              }}
              onViewDetails={() => handleProductClick(product)}
            />
          )
        })}
      </div>

      {modalProps && (
        <ProductModal
          {...modalProps}
        />
      )}
    </div>
  )
}