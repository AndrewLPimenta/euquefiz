// lib/types/product.ts
export interface Product {
  id: string | number;
  nome: string;
  slug: string;
  descricao?: string;
  descricao_detalhada?: string;
  preco: number;
  preco_original?: number;
  avaliacao?: number;
  total_avaliacoes?: number;
  categoria_id: string;
  categoria?: {
    id: string;
    nome: string;
    slug: string;
    ativa: boolean;
  };
  cores: Array<{
    id: string;
    nome: string;
  }>;
  midias: Array<{
    id: string;
    tipo: 'imagem' | 'video';
    url: string;
    thumbnail?: string;
  }>;
  status?: 'ativo' | 'inativo' | 'esgotado';
  created_at?: string;
}

export interface ProductColor {
  id: string;
  produto_id: string;
  nome: string;
}

export interface ProductMedia {
  id: string;
  produto_id: string;
  tipo: 'imagem' | 'video';
  url: string;
  thumbnail?: string;
}