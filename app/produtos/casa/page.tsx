"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import WhatsAppButton from "@/components/whatsapp"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FloatingIconsHero } from '@/components/ui/floating-icons-hero-section';
import {
  GiHighHeel,
  GiHandBag,
  GiCutDiamond,
  GiScissors,
  GiEarrings,
  GiRing,
  GiRunningShoe,
  GiSunglasses,
  GiTShirt,
  GiNecklace,
  GiBelt,
  GiWallet
} from 'react-icons/gi';
import { SandaliasPromoSection } from "@/components/SandaliasPromoSection"

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
  media?: Array<{
    type: "image" | "video"
    url: string
    thumbnail?: string
  }>
}

const fashionIcons = [
  { id: 1, icon: GiHighHeel, className: 'top-[15%] left-[10%]' },
  { id: 2, icon: GiHandBag, className: 'top-[20%] right-[15%]' },
  { id: 3, icon: GiCutDiamond, className: 'bottom-[30%] left-[5%]' },
  { id: 4, icon: GiScissors, className: 'top-[40%] left-[20%]' },
  { id: 5, icon: GiEarrings, className: 'bottom-[20%] right-[10%]' },
  { id: 6, icon: GiRing, className: 'top-[10%] left-[50%]' },
  { id: 7, icon: GiRunningShoe, className: 'bottom-[15%] left-[30%]' },
  { id: 8, icon: GiSunglasses, className: 'top-[60%] right-[25%]' },
  { id: 9, icon: GiTShirt, className: 'bottom-[40%] right-[30%]' },
  { id: 10, icon: GiNecklace, className: 'top-[30%] right-[5%]' },
  { id: 11, icon: GiBelt, className: 'top-[70%] left-[15%]' },
  { id: 12, icon: GiWallet, className: 'bottom-[10%] right-[20%]' },
];

export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [buttonColor] = useState('#25D366')

  const products: Product[] = [
    {
      id: 1,
      name: "Necessaire",
      description: "Organize seus produtos de beleza e cuidados pessoais com estilo",
      detailedDescription:
        "Necessaire artesanal feita com materiais de alta qualidade. Perfeita para organizar seus produtos de beleza e cuidados pessoais. Diversos tamanhos disponíveis.",
      colors: ["Salmão", "Verde Água", "Variadas"],
      category: "Organização",
      price: "R$ 45,00",
      rating: 4.8,
      reviewCount: 23,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
    {
      id: 2,
      name: "Kit Escritório",
      description: "Deixe sua mesa de trabalho organizada e inspiradora",
      detailedDescription:
        "Kit completo para escritório incluindo porta-canetas, organizador de papéis e suporte para celular. Material durável e design elegante.",
      colors: ["Salmão", "Verde Água"],
      category: "Organização",
      price: "R$ 89,00",
      originalPrice: "R$ 120,00",
      rating: 4.7,
      reviewCount: 15,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },
      ]
    },
    {
      id: 3,
      name: "Clutch",
      description: "Acessório elegante para completar seu look em eventos especiais",
      detailedDescription:
        "Clutch artesanal perfeita para eventos e ocasiões especiais. Acabamento impecável e design sofisticado.",
      colors: ["Salmão", "Verde Água", "Dourada"],
      category: "Acessórios",
      price: "R$ 75,00",
      rating: 4.9,
      reviewCount: 31,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },
      ]
    },
    {
      id: 4,
      name: "Sousplat",
      description: "Transforme sua mesa com charme e sofisticação",
      detailedDescription:
        "Sousplat artesanal para deixar sua mesa mais elegante. Ideal para jantares especiais e decoração do dia a dia.",
      colors: ["Salmão", "Verde Água", "Neutras"],
      category: "Mesa",
      price: "R$ 35,00",
      originalPrice: "R$ 50,00",
      rating: 4.6,
      reviewCount: 18,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
    {
      id: 5,
      name: "Kit Lavabo",
      description: "Elegância e organização para seu banheiro de visitas",
      detailedDescription:
        "Kit completo para lavabo incluindo porta-sabonete líquido, toalha decorativa e bandeja. Conjunto harmonioso e funcional.",
      colors: ["Salmão", "Verde Água"],
      category: "Banheiro",
      price: "R$ 120,00",
      rating: 4.9,
      reviewCount: 27,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
    {
      id: 6,
      name: "Espírito Santo de Porta",
      description: "Decoração religiosa delicada para sua porta",
      detailedDescription:
        "Peça artesanal representando o Espírito Santo, perfeita para decorar portas e ambientes. Acabamento delicado e design atemporal.",
      colors: ["Branco", "Dourado", "Prateado"],
      category: "Decoração",
      price: "R$ 55,00",
      originalPrice: "R$ 75,00",
      rating: 5.0,
      reviewCount: 42,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
    {
      id: 7,
      name: "Cachepô",
      description: "Destaque suas plantas com cachepôs artesanais únicos",
      detailedDescription:
        "Cachepô artesanal para destacar suas plantas favoritas. Diversos tamanhos e cores disponíveis.",
      colors: ["Salmão", "Verde Água"],
      category: "Decoração",
      price: "R$ 42,00",
      rating: 4.7,
      reviewCount: 19,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
    {
      id: 8,
      name: "Trio Cachepô Organizadores",
      description: "Conjunto versátil para plantas e organização criativa",
      detailedDescription:
        "Trio de cachepôs em tamanhos diferentes, perfeito para criar composições com plantas ou organizar pequenos objetos.",
      colors: ["Salmão", "Verde Água", "Combinados"],
      category: "Decoração",
      price: "R$ 110,00",
      originalPrice: "R$ 150,00",
      rating: 4.8,
      reviewCount: 34,
      media: [
        { type: "image", url: "/placeholder.svg" },
        { type: "video", url: "/video-default.mp4", thumbnail: "/placeholder.svg" },

      ]
    },
  ]

  const sandalias = [
    {
      id: 101,
      name: "Sandália Artesanal Salmão",
      description: "Conforto e elegância para o dia a dia",
      colors: ["Salmão", "Verde Água"],
      category: "Sandálias",
      price: "R$ 149,00",
      media: [{ type: "image", url: "/placeholder.svg" }]
    },
    {
      id: 102,
      name: "Sandália  Prateada",
      description: "Leveza e estilo em cada passo",
      colors: ["Verde Água"],
      category: "Sandálias",
      price: "R$ 149,00",
      media: [{ type: "image", url: "/placeholder.svg" }]
    }, {
      id: 103,
      name: "Sandália Dourada",
      description: "Leveza e estilo em cada passo",
      colors: ["Verde Água"],
      category: "Sandálias",
      price: "R$ 149,00",
      media: [{ type: "image", url: "/placeholder.svg" }]
    }
  ]

  const categories = ["Todos", "Sandálias", "Organização", "Acessórios", "Mesa", "Banheiro", "Decoração"]

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter((p) => p.category === selectedCategory)

  if (selectedCategory === "Todos") {
    categories.splice(0, 1)

  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FloatingIconsHero
          title="Conheça nossos produtos"
          subtitle="Descubra nossa coleção abaixo."
          ctaText="Clique para explorar"
          ctaHref="#nossos-produtos"
          icons={fashionIcons}
          targetSectionId="nossos-produtos"
        />
      <main className="flex-1">
        {/* Hero Section */}
       
 <div className="flex " id="nossos-produtos">
        <SandaliasPromoSection
          products={sandalias}
          
        />
      </div>
        <WhatsAppButton
          message="Olá, gostaria de mais informações!"
          buttonColor={buttonColor}
          buttonText=""
          position="bottom-right"
        />

        <section className="py-12 md:py-20 px-4">

          <div className="container mx-auto" >
            {/* Category Filters */}
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

            {/* Products Grid */}
            <ProductRevealGridAdapter
              products={filteredProducts}
              columns={4}
            />
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
    </div>
  )
}