"use client"

import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCart } from '@/contexts/cart-context'

export function CartIcon() {
  const { 
    items: cartItems, 
    totalItems, 
    totalPrice, 
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    openCart,
    closeCart
  } = useCart()
  
  const router = useRouter()

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('cliente_token') || 
                  sessionStorage.getItem('cliente_token')
    return !!token
  }

  const goToCheckout = () => {
    console.log('📦 Indo para checkout...', { 
      itemsCount: cartItems.length,
      isAuthenticated: isAuthenticated() 
    })
    
    if (cartItems.length === 0) {
      toast.error('Adicione produtos ao carrinho primeiro')
      return
    }
    
    if (!isAuthenticated()) {
      toast.info('Faça login para finalizar a compra')
      router.push('/login?redirect=/checkout')
      closeCart()
      return
    }
    
    closeCart()
    router.push('/checkout')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  console.log('🛒 CartIcon renderizado:', { 
    isCartOpen, 
    totalItems, 
    itemsCount: cartItems.length,
    totalPrice 
  })

  return (
    <>
      {/* Botão do carrinho */}
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-primary/20 transition-all duration-300"
        aria-label="Carrinho de compras"
        onClick={openCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
            variant="default"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </Badge>
        )}
      </Button>

      {/* Modal do carrinho */}
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="flex flex-col p-0 w-full sm:max-w-lg z-50">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Meu Carrinho</SheetTitle>
            </div>
          </SheetHeader>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-muted-foreground">Carregando carrinho...</p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Adicione produtos para continuar
              </p>
              <Button onClick={closeCart}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-lg bg-card"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 ml-2 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {item.color && item.color !== 'default' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Cor: {item.color}
                          </p>
                        )}
                        
                        {item.size && item.size !== 'default' && (
                          <p className="text-xs text-muted-foreground">
                            Tamanho: {item.size}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-none"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-none"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <p className="font-bold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Frete</span>
                  <span className="text-sm">Calculado no checkout</span>
                </div>
                
                {!isAuthenticated() && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⓘ Faça login para salvar seu carrinho e finalizar a compra
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={goToCheckout}
                  >
                    {isAuthenticated() ? 'Finalizar Compra' : 'Fazer Login para Comprar'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={closeCart}
                  >
                    Continuar Comprando
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={clearCart}
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}