"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"
import { ProductModal } from "@/components/product-modal"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MediaItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

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

  const parsePrice = (value?: string) =>
    value
      ? parseFloat(value.replace("R$", "").replace(",", "."))
      : undefined

const convertToProductRevealProps = (product: Product) => {
  const imageMedia = product.media?.find((m) => m.type === "image")
  const videoMedia = product.media?.find((m) => m.type === "video")

  const mainImage = imageMedia?.url ?? "/placeholder.svg"

  const hoverImage =
    videoMedia?.thumbnail ||
    imageMedia?.url ||
    "/placeholder.svg"

  return {
    name: product.name,
    price: parsePrice(product.price) ?? 0,
    originalPrice: parsePrice(product.originalPrice),

    image: mainImage,
    hoverImage,

    description: product.detailedDescription || product.description,
    rating: product.rating ?? 4.5,
    reviewCount: product.reviewCount ?? 50,
  }
}


  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  return (
    <div className={cn("w-full p-5", className)}>
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

      <div className={cn("grid gap-8", gridCols[columns])}>
        {products.map((product) => {
          const props = convertToProductRevealProps(product)

          return (
            <ProductRevealCard
              key={product.id}
              {...props}
              onAdd={() => console.log("Add to cart:", product.id)}
              onFavorite={() => console.log("Toggle favorite:", product.id)}
              onViewDetails={() => handleProductClick(product)}
            />
          )
        })}
      </div>

      {selectedProduct && (
        <ProductModal
          name={selectedProduct.name}
          price={parsePrice(selectedProduct.price) ?? 0}
          originalPrice={parsePrice(selectedProduct.originalPrice)}
          description={
            selectedProduct.detailedDescription ||
            selectedProduct.description
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
