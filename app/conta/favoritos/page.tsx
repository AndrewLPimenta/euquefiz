"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, ShoppingBag, Trash2, ArrowRight, Home, User, Loader2 } from "lucide-react"
import { authAPI, ecommerceHelpers } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Favorite {
  id: string;
  produto_id: string;
  produto: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria?: {
      nome: string;
    };
    produto_midias?: Array<{
      id: string;
      tipo: string;
      url: string;
    }>;
  };
  data_criacao: string;
}

export default function FavoritesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [removing, setRemoving] = useState<string | null>(null)

  // Mock data - substituir por API real quando disponível
  const mockFavorites: Favorite[] = [
    {
      id: "1",
      produto_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      produto: {
        id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        nome: "Quadro Decorativo Moderno",
        descricao: "Peça exclusiva feita à mão com detalhes em madeira",
        preco: 299.90,
        categoria: { nome: "Decoração" },
        produto_midias: [{ id: "1", tipo: "imagem", url: "/placeholder.svg" }]
      },
      data_criacao: new Date().toISOString()
    },
    {
      id: "2",
      produto_id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
      produto: {
        id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
        nome: "Conjunto de Almofadas",
        descricao: "Conjunto de 3 almofadas com estampas exclusivas",
        preco: 189.90,
        categoria: { nome: "Têxtil" },
        produto_midias: [{ id: "2", tipo: "imagem", url: "/placeholder.svg" }]
      },
      data_criacao: new Date().toISOString()
    }
  ]

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      // Verificar autenticação
      await authAPI.getProfile()
      
      // TODO: Implementar API real de favoritos quando disponível
      // const favoritesData = await fetchWithAuth('/api/favorites')
      // setFavorites(favoritesData)
      
      // Usando mock por enquanto
      setFavorites(mockFavorites)
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
      toast.error("Você precisa estar logado para ver seus favoritos")
      router.push("/entrar")
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    try {
      setRemoving(favoriteId)
      // TODO: Implementar API real para remover favorito
      // await fetchWithAuth(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
      
      // Simulação de remoção
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
      toast.success("Produto removido dos favoritos")
    } catch (error) {
      console.error("Erro ao remover favorito:", error)
      toast.error("Erro ao remover favorito")
    } finally {
      setRemoving(null)
    }
  }

  const getMainImage = (product: any) => {
    return ecommerceHelpers.getMainImage(product)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando seus favoritos...</p>
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
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                <Home className="h-4 w-4 inline mr-1" />
                Home
              </Link>
              <span>/</span>
              <Link href="/conta" className="hover:text-primary transition-colors">
                <User className="h-4 w-4 inline mr-1" />
                Minha Conta
              </Link>
              <span>/</span>
              <span className="font-medium">Favoritos</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Meus Favoritos</h1>
                <p className="text-muted-foreground">Produtos que você salvou para depois</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu lateral */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/conta" className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        <span>Minha Conta</span>
                      </Link>
                    </Button>

                    <Button className="w-full justify-start bg-primary/10 text-primary" asChild>
                      <Link href="/conta/favoritos" className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        <span>Favoritos ({favorites.length})</span>
                      </Link>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/conta/pedidos" className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5" />
                        <span>Meus Pedidos</span>
                      </Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Favoritos */}
            <div className="lg:col-span-3">
              {favorites.length > 0 ? (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {favorites.length} {favorites.length === 1 ? 'item' : 'itens'} salvos
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/produtos">
                        Continuar Comprando
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Imagem do Produto */}
                            <div className="md:w-1/3 bg-gradient-to-br from-muted to-muted/50 aspect-square relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-2 p-4">
                                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <Heart className="h-8 w-8 text-primary" />
                                  </div>
                                  <p className="text-xs font-medium text-muted-foreground">Produto favorito</p>
                                </div>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
                                  onClick={() => removeFavorite(item.id)}
                                  disabled={removing === item.id}
                                >
                                  {removing === item.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Informações do Produto */}
                            <div className="md:w-2/3 p-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-primary font-semibold mb-1">
                                    {item.produto.categoria?.nome || "Sem categoria"}
                                  </p>
                                  <h3 className="text-lg font-bold mb-2">{item.produto.nome}</h3>
                                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {item.produto.descricao}
                                  </p>
                                </div>

                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xl font-bold">
                                      {ecommerceHelpers.formatPrice(item.produto.preco)}
                                    </p>
                                    <p className="text-sm text-green-600">
                                      Disponível
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                    >
                                      <Link href={`/produtos/${item.produto.id}`}>
                                        Ver Detalhes
                                      </Link>
                                    </Button>
                                    <Button
                                      size="sm"
                                      asChild
                                    >
                                      <Link href={`/produtos/${item.produto.id}`}>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Comprar
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Ações */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <h3 className="font-semibold mb-1">Pronto para transformar seu espaço?</h3>
                        <p className="text-sm text-muted-foreground">
                          Adicione seus favoritos ao carrinho ou descubra mais produtos
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" asChild>
                          <Link href="/produtos">
                            Ver Todos os Produtos
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href="/contato">
                            Falar com Consultor
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Heart className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Sua lista de favoritos está vazia</h3>
                        <p className="text-muted-foreground mb-6">
                          Salve seus produtos favoritos aqui para encontrá-los facilmente depois
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button asChild>
                          <Link href="/produtos">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Explorar Produtos
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/">
                            Voltar para Home
                          </Link>
                        </Button>
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