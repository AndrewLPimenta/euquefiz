// app/conta/favoritos/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart, ShoppingBag, Trash2, Star,
  Grid, List, Filter, ShoppingCart,
  ArrowRight, Tag
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountLayout from "@/components/account-layout"
import { favoritesAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const favoritesData = await favoritesAPI.getMyFavorites()
      setFavorites(favoritesData)
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
      toast.error("Erro ao carregar favoritos")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await favoritesAPI.removeFavorite(favoriteId)
      setFavorites(favorites.filter(f => f.id !== favoriteId))
      toast.success("Removido dos favoritos")
    } catch (error) {
      console.error("Erro ao remover favorito:", error)
      toast.error("Erro ao remover favorito")
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      // Implementar adicionar ao carrinho
      toast.success("Produto adicionado ao carrinho")
    } catch (error) {
      toast.error("Erro ao adicionar ao carrinho")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="favoritos"
              title="Meus Favoritos"
              description="Produtos que você salvou para comprar depois"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </AccountLayout>
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
          <AccountLayout 
            activeTab="favoritos"
            title="Meus Favoritos"
            description="Produtos que você salvou para comprar depois"
          >
            {/* Header com contador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  <Heart className="inline-block h-6 w-6 text-pink-500 mr-2" />
                  Produtos Favoritos
                </h2>
                <p className="text-gray-500 mt-1">
                  {favorites.length} {favorites.length === 1 ? 'produto' : 'produtos'} salvos
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                {favorites.length > 0 && (
                  <Button asChild>
                    <Link href="/produtos">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continuar Comprando
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Lista de Favoritos */}
            {favorites.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Sua lista de favoritos está vazia
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Salve produtos que você gosta clicando no ícone de coração.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild>
                        <Link href="/produtos">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Explorar Produtos
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/">
                          <ArrowRight className="mr-2 h-5 w-5" />
                          Ver Novidades
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4">
                      {/* Imagem do produto */}
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={favorite.produto?.produto_midias?.[0]?.url || "/placeholder.svg"}
                          alt={favorite.produto?.nome || "Produto"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                            <Heart className="h-3 w-3 mr-1 text-pink-500" />
                            Favorito
                          </Badge>
                        </div>
                        
                        {/* Ações rápidas */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-full shadow-lg"
                            onClick={() => handleRemoveFavorite(favorite.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Informações do produto */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          <Link href={`/produtos/${favorite.produto?.slug || favorite.produto_id}`}>
                            {favorite.produto?.nome || "Produto"}
                          </Link>
                        </h3>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= (favorite.produto?.avaliacao || 4)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            ({favorite.produto?.total_avaliacoes || 0})
                          </span>
                        </div>
                        
                        {/* Preço */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold">
                              {formatPrice(favorite.produto?.preco || 0)}
                            </p>
                            {favorite.produto?.preco_original && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(favorite.produto.preco_original)}
                              </p>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(favorite.produto_id)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="group">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Imagem */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={favorite.produto?.produto_midias?.[0]?.url || "/placeholder.svg"}
                            alt={favorite.produto?.nome || "Produto"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Informações */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                <Link href={`/produtos/${favorite.produto?.slug || favorite.produto_id}`}>
                                  {favorite.produto?.nome || "Produto"}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {favorite.produto?.descricao}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveFavorite(favorite.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <p className="text-lg font-bold">
                                {formatPrice(favorite.produto?.preco || 0)}
                              </p>
                              {favorite.produto?.preco_original && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(favorite.produto.preco_original)}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/produtos/${favorite.produto?.slug || favorite.produto_id}`}>
                                  Ver Detalhes
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(favorite.produto_id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Ação em massa (se houver favoritos) */}
            {favorites.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Total: {favorites.length} {favorites.length === 1 ? 'produto' : 'produtos'} favoritados
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Todos
                    </Button>
                    <Button asChild>
                      <Link href="/carrinho">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ver Carrinho
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </AccountLayout>
        </div>
      </main>

      <Footer />
    </div>
  )
}