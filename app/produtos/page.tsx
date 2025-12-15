"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductModal } from "@/components/product-modal"
import { useState } from "react"
import { cn } from "@/lib/utils"
import WhatsAppButton from "@/components/whatsapp" 

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


export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }


const [buttonColor, setButtonColor] = useState('#25D366');

  const products: Product[] = [
    {
      name: "Necessaire",
      description: "Organize seus produtos de beleza e cuidados pessoais com estilo",
      detailedDescription:
        "Necessaire artesanal feita com materiais de alta qualidade. Perfeita para organizar seus produtos de beleza e cuidados pessoais. Diversos tamanhos disponíveis.",
      colors: ["Salmão", "Verde Água", "Variadas"],
      category: "Organização",
      price: "R$ 45,00",
      media: [],
    },
    {
      name: "Kit Escritório",
      description: "Deixe sua mesa de trabalho organizada e inspiradora",
      detailedDescription:
        "Kit completo para escritório incluindo porta-canetas, organizador de papéis e suporte para celular. Material durável e design elegante.",
      colors: ["Salmão", "Verde Água"],
      category: "Organização",
      price: "R$ 89,00",
      media: [],
    },
    {
      name: "Clutch",
      description: "Acessório elegante para completar seu look em eventos especiais",
      detailedDescription:
        "Clutch artesanal perfeita para eventos e ocasiões especiais. Acabamento impecável e design sofisticado.",
      colors: ["Salmão", "Verde Água", "Dourada"],
      category: "Acessórios",
      price: "R$ 75,00",
      media: [],
    },
    {
      name: "Sousplat",
      description: "Transforme sua mesa com charme e sofisticação",
      detailedDescription:
        "Sousplat artesanal para deixar sua mesa mais elegante. Ideal para jantares especiais e decoração do dia a dia.",
      colors: ["Salmão", "Verde Água", "Neutras"],
      category: "Mesa",
      price: "R$ 35,00",
      media: [],
    },
    {
      name: "Kit Lavabo",
      description: "Elegância e organização para seu banheiro de visitas",
      detailedDescription:
        "Kit completo para lavabo incluindo porta-sabonete líquido, toalha decorativa e bandeja. Conjunto harmonioso e funcional.",
      colors: ["Salmão", "Verde Água"],
      category: "Banheiro",
      price: "R$ 120,00",
      media: [],
    },
    {
      name: "Espírito Santo de Porta",
      description: "Decoração religiosa delicada para sua porta",
      detailedDescription:
        "Peça artesanal representando o Espírito Santo, perfeita para decorar portas e ambientes. Acabamento delicado e design atemporal.",
      colors: ["Branco", "Dourado", "Prateado"],
      category: "Decoração",
      price: "R$ 55,00",
      media: [],
    },
    {
      name: "Cachepô",
      description: "Destaque suas plantas com cachepôs artesanais únicos",
      detailedDescription:
        "Cachepô artesanal para destacar suas plantas favoritas. Diversos tamanhos e cores disponíveis.",
      colors: ["Salmão", "Verde Água", "Terracota"],
      category: "Decoração",
      price: "R$ 42,00",
     media: [
  {
    type: "image",
    url: "/caminho/para/sua-imagem.jpg"
  },
  {
    type: "video",
    url: "/caminho/para/seu-video.mp4",
    thumbnail: "/caminho/para/thumbnail.jpg" // opcional
  },
  {
    type: "image",
    url: "https://url-externa.com/imagem.jpg"
  }
]
    },
    {
      name: "Trio Cachepô Organizadores",
      description: "Conjunto versátil para plantas e organização criativa",
      detailedDescription:
        "Trio de cachepôs em tamanhos diferentes, perfeito para criar composições com plantas ou organizar pequenos objetos.",
      colors: ["Salmão", "Verde Água", "Combinados"],
      category: "Decoração",
      price: "R$ 110,00",
      media: [],
    },
    {
      name: "Cesto",
      description: "Organização prática e decorativa para qualquer ambiente",
      detailedDescription:
        "Cesto artesanal versátil para organizar brinquedos, roupas, mantas ou qualquer item da sua casa. Prático e decorativo.",
      colors: ["Natural", "Salmão", "Verde Água"],
      category: "Organização",
      price: "R$ 68,00",
      media: [],
    },
    {
      name: "Kit Higiene Bebê",
      description: "Kit completo e encantador para o quarto do seu bebê",
      detailedDescription:
        "Kit higiene bebê completo incluindo garrafa térmica, potes e bandeja. Perfeito para decorar e organizar o quarto do bebê.",
      colors: ["Rosa", "Azul", "Amarelo", "Neutro"],
      category: "Bebê",
      price: "R$ 150,00",
      media: [],
    },
    {
      name: "Chaveiro",
      description: "Chaveiro artesanal personalizado para presentear ou usar",
      detailedDescription:
        "Chaveiro artesanal exclusivo, perfeito para presente ou uso pessoal. Possibilidade de personalização.",
      colors: ["Variadas"],
      category: "Acessórios",
      price: "R$ 15,00",
      media: [],
    },
    {
      name: "Porta Vinhos",
      description: "Presente perfeito para apreciadores de vinho",
      detailedDescription:
        "Porta vinhos artesanal elegante e funcional. Excelente presente para apreciadores de vinho.",
      colors: ["Madeira", "Salmão", "Verde Água"],
      category: "Mesa",
      price: "R$ 95,00",
      media: [],
    },
  ]

  const categories = ["Todos", "Organização", "Acessórios", "Mesa", "Banheiro", "Decoração", "Bebê"]

  const filteredProducts =
    selectedCategory === "Todos" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-balance">Nossa Coleção</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Descubra produtos artesanais únicos para cada cantinho da sua casa
            </p>
          </div>
        </section>
 <WhatsAppButton

        message="Olá, gostaria de mais informações!"
        buttonColor={buttonColor}
        buttonText="Fale conosco"
        position="bottom-right"
      />

        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-12 md:mb-16 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  className={cn(
                    "px-4 md:px-6 py-2 md:py-2.5 cursor-pointer text-xs md:text-sm font-medium transition-all duration-300",
                    category === selectedCategory
                      ? "scale-105 md:scale-110 shadow-lg"
                      : "hover:bg-primary/10 hover:scale-105",
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  onClick={() => handleProductClick(product)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeIn 0.5s ease-out forwards",
                  }}
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3 p-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-3xl md:text-4xl">🎬</div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs md:text-sm font-semibold text-foreground">Carrossel de Mídia</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">Adicione fotos e vídeos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-5">
                    <div className="mb-2 md:mb-3">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    {product.price && (
                      <p className="text-sm md:text-base font-bold text-primary mb-3">{product.price}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] md:text-xs bg-muted px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium"
                        >
                          {color}
                        </span>
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-[10px] md:text-xs bg-muted px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
                          +{product.colors.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-balance">
                Gostou de algum produto?
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Entre em contato para saber mais sobre cores, tamanhos e personalizações
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ProductModal product={selectedProduct} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
