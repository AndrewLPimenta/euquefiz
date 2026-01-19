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
  MessageSquare,
  Star,
  CheckCircle,
  Award,
  Shield,
  Truck,
  HelpCircle,
  Home,
  Tag,
  Sparkles
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CartIcon } from "@/components/ui/cart-icon"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { categoriesAPI } from "@/lib/api"

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
  const [isScrolled, setIsScrolled] = useState(false)
  
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const productsDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    loadCategories()
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchOpen])

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

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Fechar menu de produtos no desktop
      if (window.innerWidth >= 1024) {
        if (productsDropdownRef.current && !productsDropdownRef.current.contains(target)) {
          const productsButton = document.querySelector('[data-products-button]')
          if (productsButton && !productsButton.contains(target)) {
            setProductsMenuOpen(false)
          }
        }
      }
      
      // Fechar menu de usuário no desktop
      if (window.innerWidth >= 768) {
        if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
          const userButton = document.querySelector('[data-user-button]')
          if (userButton && !userButton.contains(target)) {
            setUserMenuOpen(false)
          }
        }
      }
      
      // Fechar overlay de busca
      if (isSearchOpen && !target.closest('[data-search-container]')) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      const cats = response.data || response || []
      setCategories(cats)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/category?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
      setMobileMenuOpen(false)
    }
  }

  const quickSearch = (term: string) => {
    router.push(`/category?q=${encodeURIComponent(term)}`)
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  if (!mounted) {
    return null
  }

  const mainNavigation = [
    { 
      name: "Início", 
      href: "/", 
      icon: <Home className="h-4 w-4" />
    },
    { 
      name: "Produtos", 
      href: "/produtos",
      icon: <ShoppingBag className="h-4 w-4" />,
      hasDropdown: true,
    },
    { 
      name: "Ofertas", 
      href: "/produtos?ofertas=true", 
      icon: <Tag className="h-4 w-4" />,
      badge: "HOT"
    },
    { 
      name: "Novidades", 
      href: "/produtos?novidades=true", 
      icon: <Sparkles className="h-4 w-4" />
    },
    { 
      name: "Sobre", 
      href: "/sobre", 
      icon: <Star className="h-4 w-4" />
    },
    { 
      name: "Contato", 
      href: "/contato", 
      icon: <MessageSquare className="h-4 w-4" />
    },
  ]

  return (
    <>
      {/* Overlays */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300",
          mobileMenuOpen || isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => {
          if (mobileMenuOpen) setMobileMenuOpen(false)
          if (isSearchOpen) setIsSearchOpen(false)
        }}
      />

      {/* Search Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300",
          isSearchOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        data-search-container
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
        <div className="relative z-10 h-full overflow-y-auto">
          <div className="container mx-auto px-4 pt-20 pb-8">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite o nome do produto, categoria ou marca..."
                  className="w-full pl-12 pr-32 py-4 text-base bg-background border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery("")
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Buscar
                  </Button>
                </div>
              </form>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Sugestões de busca
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Calçados', 'Bolsas', 'Presentes', 'Decoração', 'Acessórios', 'Eletrônicos', 'Livros', 'Moda'].map((term) => (
                      <button
                        key={term}
                        onClick={() => quickSearch(term)}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Categorias populares
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/categoria/${category.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
                      >
                        <div className="font-medium text-sm mb-1 truncate">{category.nome}</div>
                        <div className="text-xs text-muted-foreground group-hover:text-foreground">
                          {category.subcategorias?.length || 0} subcategorias
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar - Apenas Desktop */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm py-2 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Truck className="h-3 w-3" />
                Frete grátis acima de R$ 100
              </span>
              <span className="h-3 w-px bg-primary-foreground/30" />
              <span className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Compra 100% segura
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/ajuda" className="hover:text-primary-foreground/80 transition-colors flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Ajuda & Suporte
              </Link>
              <span className="h-3 w-px bg-primary-foreground/30" />
              <Link href="/rastrear" className="hover:text-primary-foreground/80 transition-colors">
                Rastrear Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300",
        isScrolled ? "border-b border-border/40 shadow-lg" : ""
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 z-50 flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-darkMode.png"
                  alt="Euquefiz Logo"
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-110"
                  sizes="40px"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - LG+ */}
            <nav className="hidden lg:flex items-center gap-1 mx-4 flex-1">
              {mainNavigation.map((item) => (
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
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary/10",
                          (pathname.startsWith("/produtos") || pathname.startsWith("/categoria") || productsMenuOpen)
                            ? "text-foreground bg-primary/5" 
                            : "text-muted-foreground"
                        )}
                      >
                        {item.icon}
                        <span className="whitespace-nowrap">{item.name}</span>
                        <ChevronDown className={cn(
                          "h-3 w-3 transition-transform duration-300",
                          productsMenuOpen ? "rotate-180" : ""
                        )} />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                      
                      {/* Mega Menu de Produtos */}
                      {productsMenuOpen && (
                        <div
                          ref={productsDropdownRef}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[800px] max-w-[90vw] bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
                          style={{ left: '50%', transform: 'translateX(-50%)' }}
                        >
                          <div className="p-6 grid grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto">
                            {categories.slice(0, 8).map((category) => (
                              <div key={category.id} className="space-y-2">
                                <Link
                                  href={`/categoria/${category.slug}`}
                                  onClick={() => setProductsMenuOpen(false)}
                                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                  <span className="border-b-2 border-transparent group-hover:border-primary pb-1">
                                    {category.nome}
                                  </span>
                                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                
                                {category.subcategorias && category.subcategorias.length > 0 && (
                                  <ul className="space-y-1">
                                    {category.subcategorias.slice(0, 5).map((subcat) => (
                                      <li key={subcat.id}>
                                        <Link
                                          href={`/categoria/${subcat.slug}`}
                                          onClick={() => setProductsMenuOpen(false)}
                                          className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                                        >
                                          {subcat.nome}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                            
                            <div className="col-span-4 mt-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-lg border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Tag className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-base">Ofertas Imperdíveis</h3>
                                    <p className="text-xs text-muted-foreground">Até 60% off em categorias selecionadas</p>
                                  </div>
                                </div>
                                <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                                  <Link href="/produtos?ofertas=true">Ver Todas</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group whitespace-nowrap hover:bg-primary/10",
                        pathname === item.href 
                          ? "text-foreground bg-primary/5" 
                          : "text-muted-foreground"
                      )}
                    >
                      {item.icon}
                      {item.name}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <span className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary",
                        "group-hover:w-3/4 transition-all duration-300",
                        pathname === item.href ? "w-3/4" : ""
                      )} />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - MD/LG */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              {/* <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos, marcas..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-secondary/50 border border-border rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form> */}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3 z-50 flex-shrink-0">
              {/* Search Button - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden hover:bg-primary/20 h-10 w-10"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* User Menu - MD+ */}
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
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="text-left hidden lg:block truncate max-w-[120px]">
                        <div className="text-sm font-medium truncate">
                          Olá, {user?.nome?.split(' ')[0] || 'Cliente'}
                        </div>
                        <div className="text-xs text-muted-foreground">Minha conta</div>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-300 flex-shrink-0",
                        userMenuOpen ? "rotate-180" : ""
                      )} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div
                        ref={userDropdownRef}
                        className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-2xl z-50"
                      >
                        <div className="p-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{user?.nome}</div>
                              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <Link
                            href="/conta"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group text-sm"
                          >
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            <span>Minha Conta</span>
                          </Link>
                          <Link
                            href="/meus-pedidos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group text-sm"
                          >
                            <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            <span>Meus Pedidos</span>
                          </Link>
                          <Link
                            href="/conta/favoritos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group text-sm"
                          >
                            <Heart className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            <span>Favoritos</span>
                          </Link>
                          
                          <div className="border-t border-border my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-left group text-sm"
                          >
                            <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                            <span>Sair da Conta</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="hidden lg:inline-flex hover:bg-primary/10 text-sm"
                    >
                      <Link href="/entrar">
                        <User className="h-4 w-4 mr-2" />
                        Entrar
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      asChild
                      className="bg-primary hover:bg-primary/90 text-sm"
                    >
                      <Link href="/cadastro">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Cadastrar
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Favoritos */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden md:inline-flex hover:bg-primary/20 relative h-10 w-10"
              >
                <Link href="/conta/favoritos">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              {/* Carrinho */}
              <div className="relative">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>

              {/* Tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:inline-flex hover:bg-primary/20 h-10 w-10"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Menu Hamburguer - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-10 w-10 hover:bg-primary/10"
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Móvel */}
        <div
          ref={mobileMenuRef}
          className={cn(
            "fixed inset-0 z-50 md:hidden",
            "bg-background flex flex-col",
            "transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Cabeçalho do Menu */}
          <div className="h-16 border-b border-border/40 flex items-center justify-between px-4 bg-background flex-shrink-0">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="max-w-[200px]">
                    <div className="font-medium text-sm truncate">
                      Olá, {user?.nome?.split(' ')[0] || 'Usuário'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email || 'Minha conta'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">Menu</div>
                    <div className="text-xs text-muted-foreground">Faça login para mais opções</div>
                  </div>
                </>
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

          {/* Conteúdo Rolável */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Ações Rápidas */}
              <div className="grid grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/conta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <User className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Minha Conta</span>
                    </Link>
                    <Link
                      href="/meus-pedidos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Meus Pedidos</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/entrar"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <User className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Entrar</span>
                    </Link>
                    <Link
                      href="/cadastro"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <UserPlus className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Cadastrar</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Navegação Principal */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  Navegação
                </h3>
                <div className="space-y-1">
                  {mainNavigation.map((item) => (
                    <div key={item.href}>
                      {item.hasDropdown ? (
                        <>
                          <button
                            onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3 rounded-xl",
                              "text-left font-medium transition-all duration-300",
                              productsMenuOpen 
                                ? "bg-primary/5 text-primary" 
                                : "hover:bg-primary/10"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              {item.icon}
                              {item.name}
                              {item.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </span>
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-transform duration-300",
                              productsMenuOpen ? "rotate-90" : ""
                            )} />
                          </button>

                          {/* Submenu Mobile */}
                          <div className={cn(
                            "space-y-1 overflow-hidden transition-all duration-300",
                            productsMenuOpen ? "max-h-[500px] opacity-100 mt-1 ml-4" : "max-h-0 opacity-0"
                          )}>
                            <Link
                              href="/produtos"
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setProductsMenuOpen(false)
                              }}
                              className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-primary font-medium"
                            >
                              <span>Ver todos os produtos</span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                            
                            {categories.slice(0, 5).map((category) => (
                              <Link
                                key={category.id}
                                href={`/categoria/${category.slug}`}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setProductsMenuOpen(false)
                                }}
                                className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-primary/10 transition-colors"
                              >
                                <span className="truncate">{category.nome}</span>
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              </Link>
                            ))}
                            
                            <Link
                              href="/produtos?ofertas=true"
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setProductsMenuOpen(false)
                              }}
                              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 text-primary font-medium"
                            >
                              <span className="flex items-center gap-2">
                                <Tag className="h-3 w-3" />
                                Ver Ofertas
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl",
                            "font-medium transition-all duration-300",
                            pathname === item.href
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-primary/10"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            {item.name}
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Links Úteis */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  Ajuda & Suporte
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/ajuda"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4" />
                      Ajuda & Suporte
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/rastrear"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Truck className="h-4 w-4" />
                      Rastrear Pedido
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Configurações */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  Configurações
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors text-left"
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
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
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
            </div>
          </div>
        </div>
      </header>
    </>
  )
}