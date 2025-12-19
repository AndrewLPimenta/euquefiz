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
    name: "Casa M1",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M2",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M3",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M4",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M5",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M6",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M7",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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
    name: "Casa M8",
    description: "lorem ipsum",
    detailedDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    colors: ["Default", "Branco", "Preto"],
    category: "Casa",
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

export default function CasaPage() {
  const buttonColor = "#25D366";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center w-full flex-2 px-10 mt-10">
        <ProductRevealGridAdapter
          products={products}
          title="Produtos pra Casa"
          description="Explore nossa coleção de produtos pro seu lar."
          columns={3}
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