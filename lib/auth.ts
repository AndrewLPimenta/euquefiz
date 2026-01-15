"use client"

import { authAPI } from '@/lib/api'

export class AuthService {

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('cliente_token') || 
                  sessionStorage.getItem('cliente_token')
    return !!token
  }

  // Obter token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('cliente_token') || 
           sessionStorage.getItem('cliente_token')
  }

  // Login
  static async login(email: string, password: string, rememberMe: boolean = false): Promise<boolean> {
    try {
      const response = await authAPI.login({ email, password })
      
      if (response.success && response.token) {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('cliente_token', response.token)
        
        // Salvar dados do usuário
        if (response.cliente) {
          storage.setItem('cliente_data', JSON.stringify(response.cliente))
        }
        
        return true
      }
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  // Logout
  static logout(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('cliente_token')
    sessionStorage.removeItem('cliente_token')
    localStorage.removeItem('cliente_data')
    sessionStorage.removeItem('cliente_data')
    
    // Redirecionar para home
    window.location.href = '/'
  }

  // Obter dados do usuário
  static getUser(): any | null {
    if (typeof window === 'undefined') return null
    
    const storage = localStorage.getItem('cliente_token') ? localStorage : sessionStorage
    const userData = storage.getItem('cliente_data')
    
    return userData ? JSON.parse(userData) : null
  }

  // Verificar permissões específicas
  static hasPermission(requiredPermission: string): boolean {
    const user = this.getUser()
    if (!user) return false
    
    // Lógica de permissões (você pode expandir isso)
    switch (requiredPermission) {
      case 'checkout':
        return this.isAuthenticated()
      case 'admin':
        return user.role === 'admin'
      default:
        return false
    }
  }
}