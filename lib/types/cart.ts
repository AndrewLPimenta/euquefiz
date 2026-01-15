export interface Product {
  id: string | number
  nome?: string
  name?: string
  preco?: string | number
  price?: string | number
  produto_midias?: Array<{ url: string; tipo?: string }>
  imagem?: string
  image?: string
  hoverImage?: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  isLocal?: boolean 
  color?: string
  size?: string
}