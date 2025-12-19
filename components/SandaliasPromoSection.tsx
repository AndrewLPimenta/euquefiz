"use client"

import { useEffect, useState, useRef } from "react"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ProductRevealGridAdapter } from "@/components/ui/product-reveal-grid-adapter"
import { ArrowRight } from "lucide-react"

interface SandaliasPromoSectionProps {
  products: any[]
  interval?: number
}

export function SandaliasPromoSection({
  products,
  interval = 4000,
}: SandaliasPromoSectionProps) {
  const [index, setIndex] = useState(0)
  const isHovering = useRef(false)

  // 🎉 Confetti ao entrar
  useEffect(() => {
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.4 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcB77"],
    })
  }, [])

  // 🔁 Auto slide
  useEffect(() => {
    if (isHovering.current) return

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length)
    }, interval)

    return () => clearInterval(id)
  }, [products.length, interval])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-15 flex items-center justify-center">
      <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-bold tracking-widest text-primary-foreground">
              Promoção Especial
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Compre uma, leve outra!
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Leve <strong>2 sandálias</strong> por apenas
              <span className="block text-3xl font-bold text-primary mt-2">
                R$ 149,00
              </span>
            </p>


          </motion.div>

          {/* 🎠 Carrossel */}
          <div
            onMouseEnter={() => (isHovering.current = true)}
            onMouseLeave={() => (isHovering.current = false)}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
              >
                <ProductRevealGridAdapter
                  products={[products[index]]}
                  columns={1}
                />
              </motion.div>
            </AnimatePresence>
              <motion.div initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 mt-9 text-center flex items-center justify-center align-center">
        <Link
          href="/produtos/sandalias"
          className="
    group inline-flex items-center gap-3
    rounded-full bg-primary
    px-6 py-3 text-sm font-bold
    text-primary-foreground
    transition-all
    hover:scale-105 hover:shadow-lg
    sm:px-7 sm:py-3.5
    md:px-8 md:py-4 md:text-base
  "
        >
          Saiba mais
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
          </div>
        </div>
        
      </div>
    
    </section>
  )
}
