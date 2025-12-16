
"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"
import { ProductModal } from "@/components/product-modal"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Product {
  id: number
  name: string
  description: string
  detailedDescription?: string
  colors: string[]
  category: string
  price: string
  originalPrice?: string
  rating?: number
  reviewCount?: number
  media?: MediaItem[]
}

interface MediaItem {
  type: 'image' | 'video'
  url: string
  thumbnail?: string
}

interface ProductRevealGridAdapterProps {
  products: Product[]
  title?: string
  description?: string
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ProductRevealGridAdapter({
  products,
  title,
  description,
  columns = 4,
  className,
}: ProductRevealGridAdapterProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  const convertToProductRevealProps = (product: Product) => {
    const priceStr = product.price.replace('R$', '').replace(',', '.').trim()
    const price = parseFloat(priceStr) || 0
    
    const originalPriceStr = product.originalPrice?.replace('R$', '').replace(',', '.').trim()
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : undefined
    
    const colors = product.colors.map(color => {
      const colorMap: Record<string, string> = {
        "Salmão": "#FA8072",
        "Verde Água": "#7FFFD4",
        "Dourada": "#FFD700",
        "Branco": "#FFFFFF",
        "Natural": "#F5E6D3",
        "Rosa": "#FFC0CB",
        "Azul": "#0000FF",
        "Amarelo": "#FFFF00",
        "Madeira": "#8B4513",
        "Terracota": "#E2725B",
        "Prateado": "#C0C0C0",
        "Neutras": "#D4D4D8",
        "Variadas": "#A78BFA",
        "Combinados": "#FBBF24",
      }
      return colorMap[color] || "#6B7280"
    })

    return {
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: product.media?.[0]?.url || "/placeholder.jpg",
      description: product.detailedDescription || product.description,
      rating: product.rating || 4.5,
      reviewCount: product.reviewCount || 50,
    }
  }

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product.name) // Debug
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={`grid ${gridCols[columns]} gap-8`}>
        {products.map((product) => {
          const props = convertToProductRevealProps(product)
          
          return (
            <div 
              key={product.id} 
              className="cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <ProductRevealCard
                {...props}
                onAdd={() => console.log("Add to cart:", product.id)}
                onFavorite={() => console.log("Toggle favorite:", product.id)}
                onViewDetails={() => handleProductClick(product)} // Passando a função aqui
              />
            </div>
          )
        })}
      </div>

      {selectedProduct && (
       <ProductModal
  name={selectedProduct.name}
  price={Number(
    selectedProduct.price.replace("R$", "").replace(",", ".")
  )}
  originalPrice={
    selectedProduct.originalPrice
      ? Number(
          selectedProduct.originalPrice.replace("R$", "").replace(",", ".")
        )
      : undefined
  }
  description={
    selectedProduct.detailedDescription || selectedProduct.description
  }
  rating={selectedProduct.rating}
  reviewCount={selectedProduct.reviewCount}
  colors={selectedProduct.colors}
  media={
    selectedProduct.media?.length
      ? selectedProduct.media.map((item) => ({
          ...item,
          url: item.url.startsWith("@/")
            ? item.url.replace("@/", "/")
            : item.url,
          thumbnail: item.thumbnail?.startsWith("@/")
            ? item.thumbnail.replace("@/", "/")
            : item.thumbnail,
        }))
      : [{ type: "image", url: "/placeholder.jpg" }]
  }
  open={isModalOpen}
  onClose={handleCloseModal}
/>

      )}
    </div>
  )
}