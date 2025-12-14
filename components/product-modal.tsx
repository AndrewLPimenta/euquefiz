"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ProductMediaCarousel } from "@/components/product-media-carousel"

interface MediaItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface Product {
  name: string
  description: string
  colors: string[]
  category: string
  price?: string
  detailedDescription?: string
  media?: MediaItem[]
}

interface ProductModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background z-50"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Carrossel de Mídia */}
          <div className="relative bg-muted">
            <ProductMediaCarousel media={product.media || []} productName={product.name} />
          </div>

          {/* Informações do Produto */}
          <div className="p-8 flex flex-col">
            <div className="flex-1 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.category}
                </Badge>
                <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
              </div>

              {product.price && (
                <div className="py-4 border-y border-border">
                  <p className="text-sm text-muted-foreground mb-1">Preço</p>
                  <p className="text-2xl font-bold">{product.price}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-3">Cores Disponíveis</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-muted px-4 py-2 rounded-full font-medium hover:bg-primary/10 transition-colors duration-300"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="pt-6 border-t border-border mt-6">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity duration-300 text-base font-semibold py-6"
              >
                Conferir Disponibilidade
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
