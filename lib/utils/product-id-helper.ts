// lib/utils/product-id-helper.ts
export const productIdHelper = {
  // Verifica se um ID é válido (UUID)
  isValidProductId: (id: string | number | undefined): boolean => {
    if (!id) return false
    const idStr = id.toString()
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)
  },
  
  // Converte ID para string e valida
  sanitizeProductId: (id: string | number | undefined): string => {
    if (!id) return ''
    const idStr = id.toString()
    
    // Se for UUID válido, retorna
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)) {
      return idStr
    }
    
    // Se for número, retorna string vazia (inválido)
    if (/^\d+$/.test(idStr)) {
      console.warn(`❌ ID numérico inválido detectado: ${idStr}`)
      return ''
    }
    
    return idStr
  }
}