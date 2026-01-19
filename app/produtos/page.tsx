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
import { SectionProducts } from "@/components/section-products"

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


  const categories = [

    "Todos",

    // tenho que colocar pra pegar os dados da api
  ]

  const filteredProducts = selectedCategory === "Todos"


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
          {/* <SandaliasPromoSection
          products={sandalias}
        /> */}
        </div>
        <WhatsAppButton
          message="Olá, gostaria de mais informações!"
          buttonColor={buttonColor}
          buttonText=""
          position="bottom-right"
        />

        <section className="py-12 md:py-20 px-4">

          <div className="container mx-auto" >
            <SectionProducts />
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
                Gostou de algum produto?
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Entre em contato para saber mais sobre cores, tamanhos e personalizações.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}