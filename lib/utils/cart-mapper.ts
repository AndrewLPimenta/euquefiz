export function mapApiCartToLocal(apiCart: any[]): any[] {
  return apiCart.map((item: any) => ({
    id: item.id,
    productId: item.produto_id,
    name: item.produtos?.nome || 'Produto',
    price: parseFloat(item.produtos?.preco) || 0,
    quantity: item.quantidade || 1,
    image: item.produtos?.produto_midias?.[0]?.url || '/placeholder.svg'
  }));
}

export function mapLocalCartToApi(localCart: any[]): any[] {
  return localCart.map((item: any) => ({
    produto_id: item.productId,
    quantidade: item.quantity
  }));
}