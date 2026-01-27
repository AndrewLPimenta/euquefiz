// components/account/account-layout.tsx
"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  User, Settings, Package, Heart, LogOut, 
  MapPin, Shield, Home, ShoppingBag, Bell,
  CreditCard, Truck, HelpCircle, ChevronRight
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AccountLayoutProps {
  children: ReactNode
  activeTab?: string
  title?: string
  description?: string
}

export default function AccountLayout({ 
  children, 
  activeTab = "dashboard",
  title,
  description 
}: AccountLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success("Logout realizado com sucesso!")
    router.push("/")
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/conta",
      description: "Visão geral da conta"
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: User,
      href: "/conta?tab=perfil",
      description: "Informações pessoais"
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icon: Package,
      href: "/conta/pedidos",
      description: "Histórico e status"
    },
    {
      id: "favoritos",
      label: "Favoritos",
      icon: Heart,
      href: "/conta/favoritos",
      description: "Produtos salvos"
    },
    {
      id: "enderecos",
      label: "Endereços",
      icon: MapPin,
      href: "/conta/enderecos",
      description: "Gerencie endereços"
    },
    {
      id: "seguranca",
      label: "Segurança",
      icon: Shield,
      href: "/conta/alterar-senha",
      description: "Senha e privacidade"
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: Bell,
      href: "/conta/notificacoes",
      description: "Preferências de email"
    }
  ]

  const supportItems = [
    {
      label: "Ajuda e Suporte",
      icon: HelpCircle,
      href: "/ajuda"
    },
    {
      label: "Formas de Pagamento",
      icon: CreditCard,
      href: "/pagamento"
    },
    {
      label: "Política de Entrega",
      icon: Truck,
      href: "/entrega"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Menu Lateral */}
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardContent className="p-6">
            {/* Perfil Resumido */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{user?.nome || 'Usuário'}</h3>
              <p className="text-sm text-gray-500 truncate max-w-full">
                {user?.email}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  Conta verificada
                </span>
              </div>
            </div>

            {/* Menu Principal */}
            <nav className="space-y-1 mb-6">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id || pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start h-12 px-3 mb-1"
                    >
                      <div className="flex items-center w-full">
                        <Icon className="h-5 w-5 mr-3" />
                        <div className="flex-1 text-left">
                          <span className="font-medium">{item.label}</span>
                          <p className="text-xs text-gray-500 truncate">
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-2" />
                        )}
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </nav>

            <Separator className="my-4" />

            {/* Menu de Suporte */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2 px-3">Suporte</h4>
              <nav className="space-y-1">
                {supportItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 px-3 text-sm"
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <Separator className="my-4" />

            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:col-span-3">
        {/* Cabeçalho da Página */}
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        )}
        
        {/* Conteúdo */}
        {children}
      </div>
    </div>
  )
}