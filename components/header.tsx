"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Bloquear scroll quando menu está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

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
    <>
      {/* Overlay escuro com blur */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 md:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Sempre visível */}
            <Link href="/" className="flex items-center space-x-2 z-50">
              <Image
                src="/logo-darkMode.png"
                alt="Euquefiz Logo"
                width={40}
                height={40}
                className="transition-transform duration-300 hover:scale-110"
              />
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

            <div className="flex items-center gap-2 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:inline-flex hover:bg-primary/20 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 hover:rotate-90" />
                ) : (
                  <Moon className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 hover:-rotate-12" />
                )}
              </Button>

              {/* Botão Hamburguer/X - Sempre visível com animação */}
           <Button
  variant="ghost"
  size="icon"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden transition-all duration-300 relative w-10 h-10 hover:bg-primary/10"
  aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
>
  <div className="relative w-5 h-5">
    {/* Todas as linhas começam no centro */}
    <span className={cn(
      "absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300 transform",
      mobileMenuOpen 
        ? "rotate-45 bg-primary top-1/2 -translate-y-1/2" 
        : "top-0"
    )} />
    
    <span className={cn(
      "absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300 top-1/2 -translate-y-1/2",
      mobileMenuOpen 
        ? "opacity-0" 
        : "opacity-100"
    )} />
    
    <span className={cn(
      "absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300 transform",
      mobileMenuOpen 
        ? "-rotate-45 bg-primary top-1/2 -translate-y-1/2" 
        : "bottom-0"
    )} />
  </div>
</Button>
            </div>
          </div>
        </div>

        {/* Menu móvel - Cobre 80% da tela horizontalmente e 100% verticalmente */}
        <div
          className={cn(
            "fixed top-0 right-0 h-full z-40 md:hidden border border-",
            "w-[80%] max-w-sm bg-background",
            "transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "shadow-2xl shadow-black/30",
            mobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          )}
          style={{
            height: '100vh',
            top: '0',
          }}
        >
          {/* Cabeçalho interno do menu */}
          <div className="h-16 border-b border-border/40 flex items-center px-6">
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-semibold text-foreground">
                Menu
              </span>
              <div className="text-sm text-muted-foreground">

              </div>
            </div>
          </div>

          {/* Conteúdo do menu com scroll */}
          <div className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8">
            {/* Navegação principal */}
            <nav className="flex flex-col gap-2 mb-8">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-all duration-300",
                    "px-4 py-4 rounded-xl hover:bg-primary/10 hover:pl-6",
                    "border border-transparent hover:border-primary/20",
                    "group relative overflow-hidden",
                    pathname === item.href
                      ? "text-primary bg-primary/5 border-primary/30"
                      : "text-foreground"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: mobileMenuOpen 
                      ? 'slideInRight 0.3s ease-out forwards' 
                      : 'none',
                  }}
                >
                  {item.name}
                  <span className={cn(
                    "absolute left-0 top-0 h-full w-1 to-secondary",
                    "transition-transform duration-300",
                    pathname === item.href
                      ? "translate-x-0"
                      : "-translate-x-full group-hover:translate-x-0"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Seção de tema */}
            <div className="pt-6 border-t border-border">
              <div className="mb-4 px-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Aparência
                </span>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                  setMobileMenuOpen(false)
                }}
                className="w-full justify-start py-6 rounded-xl transition-all duration-300 hover:bg-primary/10 hover:scale-[1.02]"
              >
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <>
                      <div className="mr-3 p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
                        <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Tema Claro</div>
                        <div className="text-xs text-muted-foreground">
                          Mudar para modo claro
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mr-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Tema Escuro</div>
                        <div className="text-xs text-muted-foreground">
                          Mudar para modo escuro
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Button>
            </div>

            {/* Rodapé do menu */}
            {/* <div className="mt-12 pt-6  text-center">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Euquefiz
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Todos os direitos reservados
              </div>
            </div> */}
          </div>
        </div>
      </header>

      {/* Animação CSS */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}