// lib/types/user.ts
export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer' | 'user';
  created_at?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  sexo?: string;
  whatsapp?: string;
  endereco?: string;
  created_at?: string;
}