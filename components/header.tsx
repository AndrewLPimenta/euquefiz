"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-logo font-normal bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Euquefiz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative group",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:inline-flex hover:bg-primary/10 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-all duration-300" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="py-4 border-t border-border space-y-1">
            <nav className="flex flex-col gap-1">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:bg-primary/10 px-4 py-3 rounded-lg",
                    pathname === item.href ? "text-foreground bg-primary/5" : "text-muted-foreground",
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: mobileMenuOpen ? "fadeIn 0.3s ease-out forwards" : "none",
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full justify-start mt-2 transition-all duration-300 hover:bg-primary/10"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Tema Claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Tema Escuro
                  </>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
