// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { cartAPI, productsAPI } from '@/lib/api' // Adicionar productsAPI
// import { toast } from 'sonner'
// import { isAuthenticated as checkAuth } from '@/lib/api' // Importar da lib/api

// interface CartItem {
//   id: string
//   productId: string
//   name: string
//   price: number
//   quantity: number
//   image: string
//   color?: string
//   size?: string
// }

// interface CartContextType {
//   items: CartItem[]
//   totalItems: number
//   totalPrice: number
//   isLoading: boolean
//   isCartOpen: boolean // Adicionar
//   addItem: (product: any, quantity?: number, color?: string, size?: string) => Promise<void>
//   updateQuantity: (id: string, quantity: number) => Promise<void>
//   removeItem: (id: string) => Promise<void>
//   clearCart: () => Promise<void>
//   refreshCart: () => Promise<void>
//   openCart: () => void // Adicionar
//   closeCart: () => void // Adicionar
// }

// // Cria o contexto
// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null)
//   const [isCartOpen, setIsCartOpen] = useState(false) // Estado para abrir/fechar

//   const openCart = () => setIsCartOpen(true)
//   const closeCart = () => setIsCartOpen(false)

//   const loadCart = async () => {
//     try {
//       setIsLoading(true)
      
//       // Carrega do localStorage primeiro
//       const savedCart = localStorage.getItem('cart')
//       let localCart: CartItem[] = []
      
//       if (savedCart) {
//         try {
//           localCart = JSON.parse(savedCart)
//         } catch (error) {
//           console.error('Erro ao carregar carrinho local:', error)
//           localStorage.removeItem('cart')
//         }
//       }
      
//       // Se autenticado, sincroniza com API
//       if (checkAuth()) {
//         try {
//           const apiData = await cartAPI.getCart()
//           console.log('🛒 Dados da API:', apiData)
          
//           // Extrair itens do carrinho da API
//           const apiItems = apiData.cart || apiData.items || apiData.data || []
          
//           if (apiItems.length > 0) {
//             const apiCart = apiItems.map((item: any) => ({
//               id: item.id || `${item.produto_id}-${Date.now()}`,
//               productId: item.produto_id?.toString() || '',
//               name: item.produto?.nome || 'Produto',
//               price: parseFloat(item.produto?.preco || item.preco_unitario || 0),
//               quantity: item.quantidade || 1,
//               image: item.produto?.produto_midias?.[0]?.url || '/placeholder.svg'
//             }))
            
//             setItems(apiCart)
//             localStorage.setItem('cart', JSON.stringify(apiCart))
//           } else 
            
//           if (localCart.length > 0) {
//             // Sincroniza carrinho local com API
//             try {
//               await cartAPI.syncLocalCart(localCart)
//             } catch (syncError) {
//               console.error('Erro ao sincronizar carrinho:', syncError)
//             }
//             setItems(localCart)
//           } else {
//             setItems(localCart)
//           }
//         } catch (error) {
//           console.error('Erro ao carregar carrinho da API:', error)
//           setItems(localCart)
//         }
//       } else {
//         setItems(localCart)
//       }
//     } catch (error) {
//       console.error('Erro geral ao carregar carrinho:', error)
//       setItems([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const addItem = async (product: any, quantity: number = 1, color?: string, size?: string) => {
//     const itemId = `${product.id || product.productId || Date.now()}-${color || 'default'}-${size || 'default'}`
    
//     try {
//       // Validar o ID do produto com a API
//       let validatedProductId = product.id?.toString()
      
//       if (product.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id)) {
//         try {
//           const { id: validId, isValid } = await productsAPI.validateProductId(product.id)
//           if (isValid) {
//             validatedProductId = validId
//           } else {
//             toast.error('Produto não encontrado')
//             return
//           }
//         } catch (error) {
//           console.error('Erro ao validar produto:', error)
//           // Continua com o ID original para carrinho local
//         }
//       }
      
//       // Primeiro: Verifica se já existe no carrinho
//       const existingItem = items.find(item => item.id === itemId)
//       const isNewItem = !existingItem
      
//       // Se autenticado, sincroniza com API
//       if (checkAuth()) {
//         try {
//           await cartAPI.addToCart(validatedProductId || product.id, quantity)
//         } catch (apiError) {
//           console.error('❌ Erro ao sincronizar com API:', apiError)
//           // Continua com carrinho local
//         }
//       }
      
//       // Atualiza estado local
//       setItems(currentItems => {
//         if (existingItem) {
//           // Atualiza quantidade de item existente
//           const newItems = currentItems.map(item =>
//             item.id === itemId
//               ? { ...item, quantity: item.quantity + quantity }
//               : item
//           )
//           localStorage.setItem('cart', JSON.stringify(newItems))
//           return newItems
//         }
        
//         // Adiciona novo item
//         const newItem: CartItem = {
//           id: itemId,
//           productId: validatedProductId || product.id?.toString() || '',
//           name: product.nome || product.name || 'Produto',
//           price: parseFloat(product.preco || product.price || 0),
//           quantity: quantity,
//           image: product.produto_midias?.[0]?.url || 
//                 product.imagem || 
//                 product.image || 
//                 '/placeholder.svg',
//           color,
//           size
//         }
        
//         const newItems = [...currentItems, newItem]
//         localStorage.setItem('cart', JSON.stringify(newItems))
//         return newItems
//       })
      
//       // Guarda o ID do último item adicionado
//       setLastAddedItemId(itemId)
      
//       // Abre o carrinho automaticamente
//       openCart()
      
//       // Mostra notificação
//       toast.success(`${product.nome || product.name || 'Produto'} adicionado ao carrinho!`)
      
//     } catch (error) {
//       console.error('❌ Erro ao adicionar ao carrinho:', error)
//       toast.error('Erro ao adicionar produto ao carrinho')
//     }
//   }

//   const updateQuantity = async (id: string, quantity: number) => {
//     try {
//       if (quantity < 1) {
//         await removeItem(id)
//         return
//       }
      
//       // Encontra o item local
//       const localItem = items.find(item => item.id === id)
//       if (!localItem) {
//         toast.error('Item não encontrado')
//         return
//       }
      
//       // Atualiza localmente primeiro
//       setItems(currentItems => {
//         const newItems = currentItems.map(item =>
//           item.id === id ? { ...item, quantity } : item
//         )
//         localStorage.setItem('cart', JSON.stringify(newItems))
//         return newItems
//       })
      
//       // Se autenticado, sincroniza com API
//       if (checkAuth()) {
//         try {
//           // Busca o carrinho da API para encontrar o ID do item
//           const apiResponse = await cartAPI.getCart()
//           const apiItems = apiResponse.cart || apiResponse.items || apiResponse.data || []
          
//           // Encontrar o item da API correspondente
//           const apiItem = apiItems.find((apiItem: any) => 
//             apiItem.produto_id?.toString() === localItem.productId?.toString()
//           )
          
//           if (apiItem?.id) {
//             await cartAPI.updateQuantity(apiItem.id, quantity)
//             console.log('✅ Quantidade atualizada na API')
//           } else {
//             // Se não encontrou na API, adiciona como novo
//             await cartAPI.addToCart(localItem.productId, quantity)
//           }
//         } catch (apiError) {
//           console.error('❌ Erro ao sincronizar com API:', apiError)
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Erro geral ao atualizar quantidade:', error)
//       toast.error('Erro ao atualizar quantidade')
//     }
//   }

//   const removeItem = async (id: string) => {
//     try {
//       const localItem = items.find(item => item.id === id)
//       if (!localItem) {
//         toast.error('Item não encontrado')
//         return
//       }
      
//       // Remove localmente primeiro
//       setItems(currentItems => {
//         const newItems = currentItems.filter(item => item.id !== id)
//         localStorage.setItem('cart', JSON.stringify(newItems))
//         return newItems
//       })
      
//       // Se autenticado, remove da API
//       if (checkAuth()) {
//         try {
//           const apiResponse = await cartAPI.getCart()
//           const apiItems = apiResponse.cart || apiResponse.items || apiResponse.data || []
          
//           const apiItem = apiItems.find((apiItem: any) => 
//             apiItem.produto_id?.toString() === localItem.productId?.toString()
//           )
          
//           if (apiItem?.id) {
//             await cartAPI.removeItem(apiItem.id)
//             console.log('🗑️ Item removido da API')
//           }
//         } catch (apiError) {
//           console.error('❌ Erro ao remover da API:', apiError)
//         }
//       }
      
//       toast.success(`${localItem.name} removido do carrinho`)
      
//     } catch (error) {
//       console.error('❌ Erro geral ao remover item:', error)
//       toast.error('Erro ao remover produto')
//     }
//   }

//   const clearCart = async () => {
//     try {
//       if (checkAuth()) {
//         try {
//           await cartAPI.clearCart()
//         } catch (apiError) {
//           console.error('❌ Erro ao limpar carrinho da API:', apiError)
//         }
//       }
      
//       setItems([])
//       localStorage.removeItem('cart')
//       setLastAddedItemId(null)
      
//       toast.success('Carrinho limpo')
//       closeCart()
//     } catch (error) {
//       console.error('❌ Erro ao limpar carrinho:', error)
//       toast.error('Erro ao limpar carrinho')
//     }
//   }

//   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
//   const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

//   useEffect(() => {
//     loadCart()
//   }, [])

//   // Limpa o lastAddedItemId após 2 segundos
//   useEffect(() => {
//     if (lastAddedItemId) {
//       const timer = setTimeout(() => {
//         setLastAddedItemId(null)
//       }, 2000)
      
//       return () => clearTimeout(timer)
//     }
//   }, [lastAddedItemId])

//   return (
//     <CartContext.Provider value={{
//       items,
//       totalItems,
//       totalPrice,
//       isLoading,
//       isCartOpen,
//       addItem,
//       updateQuantity,
//       removeItem,
//       clearCart,
//       refreshCart: loadCart,
//       openCart,
//       closeCart
//     }}>
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider')
//   }
//   return context
// }