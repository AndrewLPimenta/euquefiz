"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Settings, Bell, Shield, Loader2, Home, Save, Mail, Phone, MapPin, UserCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { clientProfileAPI } from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    sexo: "",
    endereco: ""
  })

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Você precisa estar logado para acessar esta página")
      router.push("/entrar")
    }
  }, [authLoading, isAuthenticated, router])

  // Atualizar formData quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        whatsapp: user.whatsapp || "",
        sexo: user.sexo || "",
        endereco: user.endereco || ""
      })
      setLoading(false)
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return
    
    try {
      setSaving(true)
      
      const response = await clientProfileAPI.updateProfile(formData)
      
      if (response.success || response.id) {
        // Atualizar usuário no contexto
        const updatedUser = {
          ...user,
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp,
          sexo: formData.sexo,
          endereco: formData.endereco
        }
        
        updateUserProfile(updatedUser)
        toast.success("Perfil atualizado com sucesso!")
      } else {
        throw new Error(response.error || "Erro ao atualizar perfil")
      }
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error(error.message || "Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não disponível"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando seus dados...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                <Home className="h-4 w-4 inline mr-1" />
                Home
              </Link>
              <span>/</span>
              <Link href="/conta" className="hover:text-primary transition-colors">
                Minha Conta
              </Link>
              <span>/</span>
              <span className="font-medium">Perfil</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações da conta */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Informações Pessoais</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="w-full p-3 border rounded-lg"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full p-3 border rounded-lg"
                          placeholder="seu@email.com"
                          disabled // Email geralmente não pode ser alterado
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                          className="w-full p-3 border rounded-lg"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sexo</label>
                        <select
                          value={formData.sexo}
                          onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                          className="w-full p-3 border rounded-lg"
                        >
                          <option value="">Selecione</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                          <option value="O">Outro</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Endereço Principal
                        </label>
                        <input
                          type="text"
                          value={formData.endereco}
                          onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                          className="w-full p-3 border rounded-lg"
                          placeholder="Rua, número, bairro, cidade"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="outline" onClick={() => setFormData({
                        nome: user.nome || "",
                        email: user.email || "",
                        whatsapp: user.whatsapp || "",
                        sexo: user.sexo || "",
                        endereco: user.endereco || ""
                      })}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{user.nome}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    
                    {/* <div className="mt-6 space-y-3 w-full">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Membro desde:</span>
                        <span className="font-medium">
                          {user.data_criacao ? formatDate(user.data_criacao) : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Última atualização:</span>
                        <span className="font-medium">
                          {user.data_atualizacao ? formatDate(user.data_atualizacao) : 'N/A'}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Preferências</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Notificações</p>
                          <p className="text-sm text-muted-foreground">E-mails e alertas</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Segurança</p>
                          <p className="text-sm text-muted-foreground">Senha e privacidade</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/conta/seguranca">
                          Acessar
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Configurações</p>
                          <p className="text-sm text-muted-foreground">Preferências da conta</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/conta/configuracoes">
                          Acessar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}