"use client"

import Link from "next/link"
import { Instagram, Mail, Phone } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const logoMode = {
  light: "/logo-hero-claro.png",
  dark: "/logo-hero-escuro.png",
}

export function Footer() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentLogo, setCurrentLogo] = useState(logoMode.light)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Determinar qual tema está ativo
    const activeTheme = theme === "system" ? systemTheme : theme
    setCurrentLogo(activeTheme === "dark" ? logoMode.dark : logoMode.light)
  }, [theme, systemTheme, mounted])

  if (!mounted) {
    // Renderização durante SSR/hidratação
    return (
      <footer className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4 h-8 w-24 bg-muted animate-pulse rounded"></div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Produtos artesanais feitos com amor, carinho e muita dedicação. Cada peça é única e especial.
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src={currentLogo}
              alt="Euquefiz"
              className="mb-4s border-primary"
              width={70}
              height={40}
              priority={false}
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Produtos feitos com amor, carinho e muita dedicação.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>(19) 99778-50259</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>dani.franca002@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4 text-primary" />
                <span>@euquefiz_bydani</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Euquefiz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}