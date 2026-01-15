"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Settings, ShoppingBag, Heart, LogOut, Package, CreditCard, MapPin, Bell, Shield, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { authAPI, ordersAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Interfaces para tipagem
interface UserProfile {
  id: string;
  nome: string;
  email: string;
  whatsapp?: string;
  sexo?: string;
  endereco?: string;
  data_criacao: string;
  data_atualizacao: string;
}

interface Order {
  id: string;
  numero_pedido: string;
  status: string;
  total: number;
  data_criacao: string;
  itens: Array<{
    id: string;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
  }>;
}

interface Address {
  id: string;
  tipo: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [activeTab, setActiveTab] = useState("perfil")
  
  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    sexo: "",
    endereco: ""
  })

  // Carregar dados do perfil
  useEffect(() => {
    loadUserData()
    loadOrders()
    loadAddresses()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const profile = await authAPI.getProfile()
      setUserData(profile)
      setFormData({
        nome: profile.nome || "",
        email: profile.email || "",
        whatsapp: profile.whatsapp || "",
        sexo: profile.sexo || "",
        endereco: profile.endereco || ""
      })
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
      toast.error("Erro ao carregar dados do perfil")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const ordersData = await ordersAPI.getMyOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    }
  }

  const loadAddresses = async () => {
    // Carregar endereços da API
    // Implementar quando a API de endereços estiver disponível
    const mockAddresses: Address[] = [
      {
        id: "1",
        tipo: "Casa",
        rua: "Rua Exemplo",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01001-000",
        principal: true
      },
      {
        id: "2",
        tipo: "Trabalho",
        rua: "Av. Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310-100",
        principal: false
      }
    ]
    setAddresses(mockAddresses)
  }

  const handleSaveProfile = async () => {
    try {
      setProfileLoading(true)
      // Implementar chamada para atualizar perfil
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error("Erro ao atualizar perfil")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('cliente_token')
    sessionStorage.removeItem('cliente_token')
    toast.success("Logout realizado com sucesso!")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    })
  }

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando seus dados...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Cabeçalho da conta */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Minha Conta</h1>
            <p className="text-muted-foreground">Gerencie suas informações, pedidos e preferências</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu lateral */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{userData?.nome || "Usuário"}</h3>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    {userData?.data_criacao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Membro desde {formatDate(userData.data_criacao)}
                      </p>
                    )}
                  </div>

                  <nav className="space-y-2">
                    <Button 
                      variant={activeTab === "perfil" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("perfil")}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Informações Pessoais</span>
                    </Button>

                    <Button 
                      variant={activeTab === "pedidos" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("pedidos")}
                    >
                      <Package className="h-5 w-5 mr-3" />
                      <span>Meus Pedidos</span>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/conta/favoritos" className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        <span>Favoritos</span>
                      </Link>
                    </Button>

                    <Button 
                      variant={activeTab === "enderecos" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("enderecos")}
                    >
                      <MapPin className="h-5 w-5 mr-3" />
                      <span>Endereços</span>
                    </Button>

                    <Button 
                      variant={activeTab === "seguranca" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("seguranca")}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      <span>Segurança</span>
                    </Button>

                    <Separator className="my-2" />

                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/conta/configuracoes" className="flex items-center gap-3">
                        <Settings className="h-5 w-5" />
                        <span>Configurações</span>
                      </Link>
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Sair</span>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-3">
              {/* Aba Perfil */}
              {activeTab === "perfil" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Nome Completo *</label>
                            <input
                              type="text"
                              value={formData.nome}
                              onChange={(e) => setFormData({...formData, nome: e.target.value})}
                              className="w-full p-3 border rounded-lg"
                              placeholder="Seu nome completo"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail *</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full p-3 border rounded-lg"
                              placeholder="seu@email.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">WhatsApp</label>
                            <input
                              type="tel"
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                              className="w-full p-3 border rounded-lg"
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sexo</label>
                            <select
                              value={formData.sexo}
                              onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                              className="w-full p-3 border rounded-lg"
                            >
                              <option value="">Selecione</option>
                              <option value="M">Masculino</option>
                              <option value="F">Feminino</option>
                              <option value="O">Outro</option>
                            </select>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Endereço</label>
                            <input
                              type="text"
                              value={formData.endereco}
                              onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                              className="w-full p-3 border rounded-lg"
                              placeholder="Rua, número, bairro, cidade"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Preferências</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Bell className="h-5 w-5" />
                              <div>
                                <p className="font-medium">Notificações por e-mail</p>
                                <p className="text-sm text-muted-foreground">Receba atualizações sobre seus pedidos</p>
                              </div>
                            </div>
                            <Button variant="outline">Gerenciar</Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setFormData({
                          nome: userData?.nome || "",
                          email: userData?.email || "",
                          whatsapp: userData?.whatsapp || "",
                          sexo: userData?.sexo || "",
                          endereco: userData?.endereco || ""
                        })}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={profileLoading}>
                          {profileLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Aba Pedidos */}
              {activeTab === "pedidos" && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Histórico de Pedidos</h3>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h4>
                        <p className="text-muted-foreground mb-6">
                          Você ainda não fez nenhum pedido. Que tal explorar nossos produtos?
                        </p>
                        <Button asChild>
                          <Link href="/produtos">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Ver Produtos
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold">Pedido #{order.numero_pedido || order.id.substring(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Data: {formatOrderDate(order.data_criacao)}
                                </p>
                                <div className="mt-2 text-sm">
                                  <p className="font-medium">Itens:</p>
                                  <ul className="text-muted-foreground">
                                    {order.itens?.slice(0, 2).map((item, idx) => (
                                      <li key={idx} className="truncate">
                                        • {item.produto_nome} × {item.quantidade}
                                      </li>
                                    ))}
                                    {order.itens && order.itens.length > 2 && (
                                      <li>+ {order.itens.length - 2} outros itens</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                  order.status === "entregue" 
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "cancelado"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/pedidos/${order.id}`}>Ver Detalhes</Link>
                              </Button>
                              <Button variant="outline" size="sm">Comprar Novamente</Button>
                              {order.status === "processando" && (
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  Cancelar Pedido
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Aba Endereços */}
              {activeTab === "enderecos" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Meus Endereços</h3>
                      <Button>Adicionar Endereço</Button>
                    </div>
                    
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium mb-2">Nenhum endereço cadastrado</h4>
                        <p className="text-muted-foreground">
                          Adicione um endereço para facilitar suas compras
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <Card key={address.id} className={address.principal ? "border-primary" : ""}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{address.tipo}</span>
                                    {address.principal && (
                                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                        Principal
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm mt-2">
                                    {address.rua}, {address.numero}
                                    {address.complemento && `, ${address.complemento}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.bairro}, {address.cidade} - {address.estado}
                                  </p>
                                  <p className="text-sm text-muted-foreground">CEP: {address.cep}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">Editar</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Aba Segurança */}
              {activeTab === "seguranca" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Shield className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold">Segurança da Conta</h3>
                          <p className="text-sm text-muted-foreground">Gerencie sua senha e preferências de segurança</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Alterar Senha</p>
                            <p className="text-sm text-muted-foreground">Atualize sua senha regularmente</p>
                          </div>
                          <Button variant="outline">Alterar</Button>
                        </div>

                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Autenticação de Dois Fatores</p>
                            <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                          </div>
                          <Button variant="outline">Ativar</Button>
                        </div>

                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Sessões Ativas</p>
                            <p className="text-sm text-muted-foreground">Gerencie seus dispositivos conectados</p>
                          </div>
                          <Button variant="outline">Verificar</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}