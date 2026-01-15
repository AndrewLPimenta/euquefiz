"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/lib/api"

interface User {
  id: string
  nome: string
  email: string
  sexo?: string | null
  whatsapp?: string | null
  endereco?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, senha: string, remember?: boolean) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  updateUserProfile: (profile: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken()
      console.log('🔍 Verificando autenticação inicial, token:', token ? 'Sim' : 'Não')
      
      if (token) {
        try {
          console.log('🔄 Carregando perfil do cliente...')
          const response = await api.auth.getProfile()
          
          if (response.success && response.client) {
            setUser(response.client)
            console.log('✅ Perfil carregado:', response.client.nome)
          } else {
            // Token inválido, limpar
            console.log('❌ Token inválido, limpando...')
            api.clearToken()
            setUser(null)
          }
        } catch (error: any) {
          console.error('❌ Erro ao verificar autenticação:', error)
          if (error.message.includes('401') || error.message.includes('Token')) {
            api.clearToken()
            setUser(null)
          }
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, senha: string, remember: boolean = true) => {
    setLoading(true)
    try {
      console.log('🔐 Tentando login...', { email })
      
      const response = await api.auth.login({ email, senha })
      
      console.log('📦 Resposta do login:', { 
        success: response.success, 
        hasToken: !!response.token,
        clientName: response.client?.nome 
      })
      
      if (response.success && response.token) {
        // Salvar token
        api.setToken(response.token, remember)
        console.log('💾 Token salvo:', response.token.substring(0, 20) + '...')
        
        // Atualizar estado do usuário
        if (response.client) {
          setUser(response.client)
          console.log('👤 Cliente atualizado:', response.client.nome)
        }
        
        toast.success('Login realizado com sucesso!')
        
        // Redirecionar
        const redirect = new URLSearchParams(window.location.search).get('redirect') || '/'
        console.log('🔄 Redirecionando para:', redirect)
        router.push(redirect)
        router.refresh()
      } else {
        throw new Error(response.error || 'Erro ao fazer login')
      }
    } catch (error: any) {
      console.error('❌ Erro no login:', error)
      toast.error(error.message || 'Credenciais inválidas')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData: any) => {
    setLoading(true)
    try {
      console.log('📝 Tentando registro...')
      
      const dataToSend = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        sexo: formData.sexo || undefined,
        whatsapp: formData.whatsapp || undefined,
        endereco: formData.endereco || undefined,
      }
      
      const response = await api.auth.register(dataToSend)
      
      console.log('📦 Resposta do registro:', { 
        success: response.success, 
        hasToken: !!response.token,
        clientName: response.client?.nome 
      })
      
      if (response.success) {
        // SALVAR TOKEN se veio na resposta
        if (response.token) {
          api.setToken(response.token, true)
          console.log('💾 Token salvo após registro:', response.token.substring(0, 20) + '...')
        }
        
        // Atualizar estado do usuário
        if (response.client) {
          setUser(response.client)
          console.log('👤 Cliente atualizado após registro:', response.client.nome)
        }
        
        toast.success('Cadastro realizado com sucesso!')
        
        // Redirecionar para página principal ou carrinho
        router.push('/carrinho')
        router.refresh()
        
      } else {
        throw new Error(response.error || 'Erro ao cadastrar')
      }
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error)
      toast.error(error.message || 'Erro ao criar conta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Fazendo logout...')
    api.clearToken()
    setUser(null)
    
    toast.info('Logout realizado')
    router.push('/')
    router.refresh()
  }

  const updateUserProfile = (profile: User) => {
    setUser(profile)
  }

  const isAuthenticated = !!api.getToken() && !!user

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}