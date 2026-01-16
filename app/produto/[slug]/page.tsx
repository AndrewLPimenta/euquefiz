// app/produto/[slug]/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { productsAPI, ecommerceHelpers } from "@/lib/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw,
  Check,
  Package,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await productsAPI.getBySlug(slug)
      setProduct(productData)
      
      // Setar primeira cor como padrão
      const colors = ecommerceHelpers.getColors(productData)
      if (colors.length > 0) {
        setSelectedColor(colors[0])
      }
      
      // Carregar produtos relacionados
      if (productData.categoria_id) {
        const allProducts = await productsAPI.getAll()
        const related = Array.isArray(allProducts) ? allProducts : allProducts?.data || []
        const filtered = related
          .filter((p: any) => 
            p.categoria_id === productData.categoria_id && 
            p.id !== productData.id
          )
          .slice(0, 4)
        setRelatedProducts(filtered)
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      toast.error('Produto não encontrado')
      router.push('/produtos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
      await addItem(product.id, quantity)
      toast.success('Produto adicionado ao carrinho!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar ao carrinho')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/carrinho')
  }

  const formatDescription = (text: string) => {
    if (!text) return ''
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <Button onClick={() => router.push('/produtos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para produtos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const colors = ecommerceHelpers.getColors(product)
  const media = product.produto_midias || []
  const images = media.filter((m: any) => m.tipo === 'imagem')
  const videos = media.filter((m: any) => m.tipo === 'video')
  
  const mainImage = ecommerceHelpers.getMainImage(product)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-6">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => router.push('/produtos')}
              className="hover:text-primary transition-colors"
            >
              Produtos
            </button>
            <span className="mx-2">/</span>
            {product.categoria && (
              <>
                <button 
                  onClick={() => router.push(`/category/${product.categoria.slug || product.categoria.id}`)}
                  className="hover:text-primary transition-colors"
                >
                  {product.categoria.nome}
                </button>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="font-medium text-foreground truncate max-w-xs">
              {product.nome}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              {/* Imagem Principal */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <div className="w-full h-full flex items-center justify-center">
                  {images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={images[selectedImageIndex]?.url || mainImage}
                        alt={product.nome}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Imagem do produto</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <div className="relative w-full h-full bg-muted">
                        <Image
                          src={image.url}
                          alt={`${product.nome} - imagem ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Vídeos */}
              {videos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Vídeos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {videos.map((video: any, index: number) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black">
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-contain"
                          poster={video.thumbnail}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Categoria e Favorito */}
              <div className="flex justify-between items-start">
                <div>
                  {product.categoria && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {product.categoria.nome}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-1">{product.nome}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.avaliacao || 4.5}</span>
                      <span className="ml-1">({product.total_avaliacoes || 0} avaliações)</span>
                    </div>
                    <span>•</span>
                    <span>Código: {product.id?.substring(0, 8)}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">
                    {ecommerceHelpers.formatPrice(product.preco)}
                  </span>
                  {product.preco_original && product.preco_original > product.preco && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {ecommerceHelpers.formatPrice(product.preco_original)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        -{Math.round((1 - product.preco / product.preco_original) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Em estoque • Pronta entrega
                </p>
              </div>

              {/* Cores */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Cores disponíveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade */}
              <div className="space-y-3">
                <h3 className="font-medium">Quantidade</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.estoque || 10} unidades disponíveis
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1 group"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                >
                  Comprar Agora
                </Button>
              </div>

              {/* Benefícios */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Frete Grátis</p>
                    <p className="text-sm text-muted-foreground">Acima de R$ 200</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Troca Garantida</p>
                    <p className="text-sm text-muted-foreground">30 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Compra Segura</p>
                    <p className="text-sm text-muted-foreground">SSL Certificado</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Garantia</p>
                    <p className="text-sm text-muted-foreground">12 meses</p>
                  </div>
                </div>
              </div>

              {/* Compartilhar */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="text-muted-foreground">Compartilhar:</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded-full transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição Detalhada */}
          {product.descricao_detalhada && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Descrição do Produto</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {formatDescription(product.descricao_detalhada)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Produtos Relacionados */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produtos Relacionados</h2>
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/category/${product.categoria?.slug || product.categoria?.id}`)}
                >
                  Ver todos
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct: any) => (
                  <Card
                    key={relatedProduct.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      <div 
                        className="aspect-square bg-gradient-to-br from-muted to-muted/50 cursor-pointer"
                        onClick={() => router.push(`/produto/${relatedProduct.slug || relatedProduct.id}`)}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={ecommerceHelpers.getMainImage(relatedProduct)}
                            alt={relatedProduct.nome}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1 mb-1">
                          {relatedProduct.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {relatedProduct.descricao}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">
                            {ecommerceHelpers.formatPrice(relatedProduct.preco)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/produto/${relatedProduct.slug || relatedProduct.id}`)
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}