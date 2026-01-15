// lib/types/category.ts
export interface Category {
  id: string;
  nome: string;
  slug: string;
  ativa: boolean;
  created_at?: string;
}