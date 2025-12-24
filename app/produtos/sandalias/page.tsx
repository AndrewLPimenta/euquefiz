"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import WhatsAppButton from "@/components/whatsapp"

interface Product {
  id: number
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

const products: Product[] = [
  {
    id: 1,
    name: "Sandália M1",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 2,
    name: "Sandália M2",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 3,
     name: "Sandália M3",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 4,
     name: "Sandália M4",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 5,
     name: "Sandália M5",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 6,
     name: "Sandália M6",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 7,
     name: "Sandália M7",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
  {
    id: 8,
    name: "Sandália M8",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Sandálias",
    price: "R$ 00,00",
    originalPrice: "R$ 100,00",
    rating: 5.0,
    hoverImage: "/placeholder.svg",
    reviewCount: 1000,
    media: [
      { type: "image", url: "/placeholder.svg" },
      { type: "video", url: "/placeholder.svg", thumbnail: "/placeholder.svg" },
    ],
  },
]

export default function SandaliaPage() {

  return (
    <div className=" min-h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-2 px-10 mt-10">
      
        <ProductRevealGridAdapter
          products={products}
          title="Nossas Sandálias"
          description="Explore nossa coleção exclusiva de sandálias."
          columns={4}
        />
      </main>

       <WhatsAppButton
          message="Olá, gostaria de mais informações sobre a(as) sandália(as)!"
          buttonText=""
          position="bottom-right"
        />
      <Footer />
    </div>
  )
}