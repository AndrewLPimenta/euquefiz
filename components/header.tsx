
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  User, 
  LogOut,
  ShoppingBag,
  Heart,
  UserPlus,
  Search,
  Bell
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CartIcon } from "@/components/ui/cart-icon"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { categoriesAPI } from "@/lib/api"
import { MessageSquare, Star, CheckCircle, Award, Shield } from "lucide-react";
import Router from "next/router"

interface MenuItem {
  name: string;
  href: string;
  badge?: string; 
}

interface Category {
  id: string
  nome: string
  slug: string
  subcategorias?: Category[]
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth()
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      const cats = response.data || response || []
      setCategories(cats)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

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

  // Fechar menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      if (window.innerWidth >= 768) {
        // Fechar menu de produtos
        const productsButton = document.querySelector('[data-products-button]')
        const dropdown = document.querySelector('[data-products-dropdown]')
        
        if (productsButton && dropdown && 
            !productsButton.contains(target) && 
            !dropdown.contains(target)) {
          setProductsMenuOpen(false)
        }

        // Fechar menu de usuário
        const userButton = document.querySelector('[data-user-button]')
        const userDropdown = document.querySelector('[data-user-dropdown]')
        
        if (userButton && userDropdown && 
            !userButton.contains(target) && 
            !userDropdown.contains(target)) {
          setUserMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  if (!mounted) {
    return null
  }

  const navigation = [
    { name: "Início", href: "/" },
    { 
      name: "Produtos", 
      href: "/products",
      hasDropdown: true,
    },
    { name: "Ofertas", href: "/ofertas", badge: "" },
    { name: "Novidades", href: "/novidades", badge: "" },
  ]

  return (
    <>
      {/* Overlay escuro com blur */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300",
          mobileMenuOpen || (productsMenuOpen && window.innerWidth < 768) || isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => {
          setMobileMenuOpen(false)
          if (window.innerWidth < 768) {
            setProductsMenuOpen(false)
          }
          setIsSearchOpen(false)
        }}
      />

      {/* Search Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-xl transition-all duration-300",
        isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você está procurando hoje?"
                className="w-full px-6 py-4 text-lg bg-background border-2 border-primary/30 rounded-2xl focus:outline-none focus:border-primary"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Sugestões populares</h3>
              <div className="flex flex-wrap gap-2">
                {['Calçados', 'Bolsas', 'Presentes', 'Decoração', 'Acessórios'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`)
                      setIsSearchOpen(false)
                    }}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>🎁 Frete grátis em compras acima de R$ 100</span>
            <span className="hidden lg:inline">|</span>
            <span className="hidden lg:inline">📦 Entrega para todo Brasil</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ajuda" className="hover:text-primary-foreground/80 transition-colors">
              Ajuda & Suporte
            </Link>
            <Link href="/rastrear" className="hover:text-primary-foreground/80 transition-colors">
              Rastrear Pedido
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 z-50 flex-shrink-0">
              <Image
                src="/logo-darkMode.png"
                alt="Euquefiz Logo"
                width={45}
                height={45}
                className="transition-transform duration-300 hover:scale-110"
              />
              <div className="hidden lg:block">
                <div className="font-bold text-xl tracking-tight"></div>
                <div className="text-xs text-muted-foreground"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 mx-8 flex-1">
              {navigation.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <>
                      <button
                        data-products-button
                        onClick={() => {
                          setProductsMenuOpen(!productsMenuOpen)
                          setUserMenuOpen(false)
                        }}
                        className={cn(
                          "text-sm font-medium transition-all duration-300",
                          "flex items-center gap-1 px-3 py-2 rounded-lg",
                          pathname.startsWith("/products") || pathname.startsWith("/category")
                            ? "text-foreground bg-primary/5" 
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        )}
                      >
                        {item.name}
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          productsMenuOpen ? "rotate-180" : ""
                        )} />
                      </button>
                      
                      {/* Mega Menu de Produtos */}
                      <div
                        data-products-dropdown
                        className={cn(
                          "absolute top-full left-0 mt-2",
                          "w-[800px] bg-background border border-border rounded-2xl shadow-2xl",
                          "transition-all duration-300 origin-top",
                          "opacity-0 scale-95 pointer-events-none",
                          productsMenuOpen 
                            ? "opacity-100 scale-100 pointer-events-auto" 
                            : ""
                        )}
                      >
                        <div className="p-6 grid grid-cols-3 gap-8">
                          {categories.slice(0, 6).map((category) => (
                            <div key={category.id} className="space-y-3">
                              <Link
                                href={`/category/${category.slug}`}
                                onClick={() => setProductsMenuOpen(false)}
                                className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                              >
                                <span>{category.nome}</span>
                                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              
                              {/* Subcategorias */}
                              {category.subcategorias && category.subcategorias.length > 0 && (
                                <ul className="space-y-2 pl-2">
                                  {category.subcategorias.slice(0, 4).map((subcat) => (
                                    <li key={subcat.id}>
                                      <Link
                                        href={`/category/${subcat.slug}`}
                                        onClick={() => setProductsMenuOpen(false)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        {subcat.nome}
                                      </Link>
                                    </li>
                                  ))}
                                  {category.subcategorias.length > 4 && (
                                    <li>
                                      <Link
                                        href={`/category/${category.slug}`}
                                        onClick={() => setProductsMenuOpen(false)}
                                        className="text-sm text-primary hover:text-primary/80 font-medium"
                                      >
                                        Ver todas...
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          ))}
                          
                          {/* Banner Promocional */}
                          <div className="col-span-3 mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold">Ofertas Especiais 🎯</h3>
                                <p className="text-sm text-muted-foreground">Até 50% off em produtos selecionados</p>
                              </div>
                              <Button size="sm" asChild>
                                <Link href="/ofertas">Ver Ofertas</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-all duration-300 relative group px-3 py-2",
                        pathname === item.href 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-1">
                        {item.name}
                        {item.badge && <span>{item.badge}</span>}
                      </span>
                      <span className={cn(
                        "absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary",
                        "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                        pathname === item.href ? "scale-x-100" : ""
                      )} />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-full px-4 py-2 text-sm bg-secondary/50 border border-border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 z-50">
              {/* Search Button (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden hover:bg-primary/20"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* User Menu (Desktop) */}
              <div className="hidden md:block relative">
                {isAuthenticated ? (
                  <>
                    <button
                      data-user-button
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen)
                        setProductsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className="text-sm font-medium truncate max-w-[120px]">
                          Olá, {user?.nome?.split(' ')[0] || 'Cliente'}
                        </div>
                        <div className="text-xs text-muted-foreground">Minha conta</div>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        userMenuOpen ? "rotate-180" : ""
                      )} />
                    </button>

                    {/* User Dropdown */}
                    <div
                      data-user-dropdown
                      className={cn(
                        "absolute top-full right-0 mt-2",
                        "w-64 bg-background border border-border rounded-xl shadow-2xl",
                        "transition-all duration-300 origin-top-right",
                        "opacity-0 scale-95 pointer-events-none",
                        userMenuOpen 
                          ? "opacity-100 scale-100 pointer-events-auto" 
                          : ""
                      )}
                    >
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{user?.nome}</div>
                            <div className="text-sm text-muted-foreground">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          href="/minha-conta"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Minha Conta</span>
                        </Link>
                        <Link
                          href="/meus-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Meus Pedidos</span>
                        </Link>
                        <Link
                          href="/favoritos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Favoritos</span>
                        </Link>
                        
                        <div className="border-t border-border my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex">
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/cadastro">Cadastre-se</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Favoritos */}
              {/* <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden md:inline-flex hover:bg-primary/20 relative"
              >
                <Link href="/favoritos">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button> */}

              {/* Carrinho */}
              <div className="relative">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center animate-pulse">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>

              {/* Tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:inline-flex hover:bg-primary/20"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 transition-all duration-300 hover:rotate-90" />
                ) : (
                  <Moon className="h-5 w-5 transition-all duration-300 hover:-rotate-12" />
                )}
              </Button>

              {/* Menu Hamburguer */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-10 h-10 hover:bg-primary/10"
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                <div className="relative w-5 h-5">
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

        {/* Menu Móvel */}
        <div
          className={cn(
            "fixed top-0 right-0 h-full z-50 md:hidden",
            "w-full max-w-sm bg-background",
            "transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "shadow-2xl shadow-black/30",
            mobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          )}
          style={{ height: '100vh', top: '0' }}
        >
          {/* Cabeçalho do menu */}
          <div className="h-16 border-b border-border/40 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Olá, {user?.nome?.split(' ')[0]}</div>
                    <div className="text-xs text-muted-foreground">Minha conta</div>
                  </div>
                </>
              ) : (
                <div className="font-semibold">Menu</div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Conteúdo com scroll */}
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Seção do usuário */}
            <div className="p-6 border-b border-border/40">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{user?.nome}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href="/conta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <User className="h-5 w-5 mb-1" />
                      <span className="text-xs">Conta</span>
                    </Link>
                    <Link
                      href="/meus-pedidos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5 mb-1" />
                      <span className="text-xs">Pedidos</span>
                    </Link>
                    <Link
                      href="/favoritos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Heart className="h-5 w-5 mb-1" />
                      <span className="text-xs">Favoritos</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground">Faça login para uma experiência personalizada</p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="flex-1" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/cadastro">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Cadastrar
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Navegação principal */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Navegação
              </h3>
              
              <div className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.href}>
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3 rounded-lg",
                            "text-left font-medium transition-all duration-300",
                            productsMenuOpen 
                              ? "bg-primary/5 text-primary" 
                              : "hover:bg-primary/10"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {item.name}
                            {item.badge && <span className="text-xs">{item.badge}</span>}
                          </span>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform duration-300",
                            productsMenuOpen ? "rotate-90" : ""
                          )} />
                        </button>

                        {/* Submenu Mobile */}
                        <div className={cn(
                          "space-y-1 pl-4 overflow-hidden transition-all duration-300",
                          productsMenuOpen ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
                        )}>
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setProductsMenuOpen(false)
                              }}
                              className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                              <span>{category.nome}</span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ))}
                          <Link
                            href="/products"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setProductsMenuOpen(false)
                            }}
                            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-primary font-medium"
                          >
                            <span>Ver todos os produtos</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-lg",
                          "font-medium transition-all duration-300",
                          pathname === item.href
                            ? "bg-primary/5 text-primary"
                            : "hover:bg-primary/10"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.name}
                          {item.badge && <span className="text-xs">{item.badge}</span>}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}

                {/* Links adicionais */}
                <div className="pt-4 mt-4 border-t border-border/40">
                  <Link
                    href="/ajuda"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span>Ajuda & Suporte</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/rastrear"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span>Rastrear Pedido</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="p-6 border-t border-border/40">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Configurações
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark")
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5" />
                        <span>Tema Claro</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5" />
                        <span>Tema Escuro</span>
                      </>
                    )}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      <span>Sair da Conta</span>
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Rodapé do menu */}
            <div className="p-6 bg-/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Precisa de ajuda?</p>
                <Button variant="outline" size="sm" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/contato">
<span className="mr-2"><MessageSquare size={18} /></span>
                    Fale Conosco
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

// <span className="mr-2"><MessageSquare size={18} /></span>
// <span className="mr-2"><Star size={18} /></span>
// <span className="mr-2"><CheckCircle size={18} /></span>
// <span className="mr-2"><Award size={18} /></span>
// <span className="mr-2"><Shield size={18} /></span>
// <span className="mr-2"><Heart size={18} /></span>