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
    name: "Cristianismo M1",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M2",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M3",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M4",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M5",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M6",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M7",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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
    name: "Cristianismo M8",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Cristianismo",
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

export default function CristianismoPage() {
  const buttonColor = "#25D366" // Cor do WhatsApp

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-2 px-10 mt-10">
        <ProductRevealGridAdapter
          products={products}
          title="Produtos Cristãos"
          description="Explore nossa coleção de produtos com inspiração cristã."
          columns={4}
        />
      </main>

      <WhatsAppButton
        message="Olá, gostaria de mais informações!"
        buttonColor={buttonColor}
        buttonText=""
        position="bottom-right"
      />

      <Footer />
    </div>
  )
}