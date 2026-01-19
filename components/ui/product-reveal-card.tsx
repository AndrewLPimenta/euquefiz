"use client"

import { motion, useReducedMotion, Variants } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingCart, Star, Heart, Eye } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ecommerceHelpers } from "@/lib/api"

interface ProductRevealCardProps {
  name?: string
  price?: number
  originalPrice?: number
  image?: string
  hoverImage?: string
  description?: string
  rating?: number
  reviewCount?: number
  onAdd?: (product: any) => void
  onFavorite?: () => void
  onViewDetails?: () => void
  enableAnimations?: boolean
  className?: string
  productId?: string | number
  productData?: any
}

const imageVariants: Variants = {
  rest: { opacity: 1 },
  hover: { opacity: 0 },
}

const hoverImageVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

export function ProductRevealCard({
  name = "Premium Wireless Headphones",
  price = 199,
  originalPrice = 299,
  image = "/placeholder.svg",
  hoverImage = "/placeholder.svg",
  description = "Experience studio-quality sound with advanced noise cancellation and 30-hour battery life.",
  rating = 4.8,
  reviewCount = 124,
  onAdd,
  onFavorite,
  onViewDetails,
  enableAnimations = true,
  className,
  productId,
  productData,
}: ProductRevealCardProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavorite?.()
    
    // Verificar autenticação simples
    const isAuthenticated = typeof window !== 'undefined' && 
      (localStorage.getItem('cliente_token') || sessionStorage.getItem('cliente_token'))
    
    if (!isAuthenticated) {
      toast.info("Faça login para adicionar aos favoritos")
      router.push("/entrar")
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
  e.stopPropagation()
  
  console.log('🛒 [ProductRevealCard] Adicionando produto:', {
    productId: productId,
    tipo_productId: typeof productId,
    productDataId: productData?.id,
    tipo_productDataId: typeof productData?.id,
    productData: productData, // ← Adicione este log
    name: name || productData?.nome
  })
  
  if (!productData) {
    toast.error("Erro: Dados do produto não disponíveis")
    return
  }
  
  // VERIFICAÇÃO CRÍTICA: Garantir que usamos o ID correto
  const productIdToSend = productData.id?.toString() || productId?.toString()
  
  console.log('🛒 [ProductRevealCard] ID a ser enviado:', {
    original: productId,
    fromProductData: productData.id,
    final: productIdToSend,
    isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdToSend)
  })
  
  setIsAddingToCart(true)
  
  try {
    const productForCart = {
      id: productIdToSend, // ← USA O ID CORRETO
      nome: name || productData.nome,
      preco: price || productData.preco || 0,
      produto_midias: productData.produto_midias || productData.media || [],
      imagem: productData.imagem || image,
      descricao: description || productData.descricao,
      // ... outras propriedades
    }
    
    await addItem(productForCart, 1)
    toast.success(`${name || productData.nome} adicionado ao carrinho!`)
  } catch (error) {
    console.error('❌ [ProductRevealCard] Erro ao adicionar ao carrinho:', error)
    toast.error("Erro ao adicionar produto ao carrinho")
  } finally {
    setIsAddingToCart(false)
  }
}

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetails?.()
  }

  const containerVariants: Variants = {
    rest: {
      scale: 1,
      y: 0,
      filter: "blur(0px)" as any,
    },
    hover: shouldAnimate ? {
      scale: 1.03,
      y: -8,
      filter: "blur(0px)" as any,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }
    } : {},
  }

  const overlayVariants: Variants = {
    rest: {
      y: "100%" as any,
      opacity: 0,
      filter: "blur(4px)" as any,
    },
    hover: {
      y: "0%" as any,
      opacity: 1,
      filter: "blur(0px)" as any,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const contentVariants: Variants = {
    rest: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const buttonVariants_motion: Variants = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    } : {},
    tap: shouldAnimate ? { scale: 0.95 } : {},
  }

  const favoriteVariants: Variants = {
    rest: { scale: 1, rotate: 0 },
    favorite: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
  }

  return (
    <motion.div
      data-slot="product-reveal-card"
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-full rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group",
        className
      )}
      onClick={handleViewDetails}
    >
      <div className="relative overflow-hidden aspect-square">
        <motion.img
          src={image || "/placeholder.svg"}
          alt={name || "Produto"}
          className="absolute inset-0 h-full w-full object-cover"
          variants={imageVariants}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg"
          }}
        />

        {hoverImage && hoverImage !== "/placeholder.svg" && (
          <motion.img
            src={hoverImage}
            alt={`${name} - Vista alternativa`}
            className="absolute inset-0 h-full w-full object-cover hidden md:block"
            variants={hoverImageVariants}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = image || "/placeholder.svg"
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <motion.button
          onClick={handleFavorite}
          variants={favoriteVariants}
          animate={isFavorite ? "favorite" : "rest"}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background"
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </motion.button>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating?.toFixed(1) || "4.5"} ({reviewCount || 0} avaliações)
          </span>
        </div>

        <div className="space-y-1">
          <motion.h3
            className="text-xl font-bold leading-tight tracking-tight line-clamp-1"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {ecommerceHelpers.formatPrice(price || 0)}
            </span>
            {originalPrice && originalPrice > (price || 0) && (
              <span className="text-lg text-muted-foreground line-through">
                {ecommerceHelpers.formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-background/96 backdrop-blur-xl flex flex-col justify-end"
      >
        <div className="p-6 space-y-4">
          <motion.div variants={contentVariants}>
            <h4 className="font-semibold mb-2">Detalhes do Produto</h4>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {description}
            </p>
          </motion.div>

          <motion.div variants={contentVariants} className="space-y-3">
            <motion.button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              variants={buttonVariants_motion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-12 font-medium",
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "shadow-lg shadow-primary/25",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleViewDetails}
              variants={buttonVariants_motion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-10 font-medium"
              )}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}