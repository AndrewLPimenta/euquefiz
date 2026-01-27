// app/conta/alterar-senha/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Key,
  RefreshCw,
  ShieldCheck
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountLayout from "@/components/account/account-layout"
import { clientProfileAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
    
    let isValid = true
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Senha atual é obrigatória"
      isValid = false
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Nova senha é obrigatória"
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "A senha deve ter no mínimo 8 caracteres"
      isValid = false
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmação da senha é obrigatória"
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, text: "", color: "" }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const levels = [
      { text: "Muito fraca", color: "text-red-500" },
      { text: "Fraca", color: "text-orange-500" },
      { text: "Média", color: "text-yellow-500" },
      { text: "Forte", color: "text-green-500" },
      { text: "Muito forte", color: "text-emerald-500" }
    ]
    
    return {
      score,
      text: levels[score].text,
      color: levels[score].color
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      
      const response = await clientProfileAPI.changePassword(
        formData.currentPassword,
        formData.newPassword
      )
      
      if (response.success) {
        toast.success("Senha alterada com sucesso!")
        router.push("/conta?tab=seguranca")
      } else {
        throw new Error(response.error || "Erro ao alterar senha")
      }
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error)
      
      if (error.message.includes("senha atual incorreta")) {
        setErrors(prev => ({
          ...prev,
          currentPassword: "Senha atual incorreta"
        }))
        toast.error("Senha atual incorreta")
      } else {
        toast.error(error.message || "Erro ao alterar senha")
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = checkPasswordStrength(formData.newPassword)

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="seguranca"
              title="Alterar Senha"
              description="Atualize sua senha de acesso"
            >
              <Skeleton className="h-64 rounded-lg" />
            </AccountLayout>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <AccountLayout 
            activeTab="seguranca"
            title="Alterar Senha"
            description="Mantenha sua conta segura com uma senha forte"
          >
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Cabeçalho */}
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Segurança da Conta</h3>
                        <p className="text-sm text-gray-500">
                          Altere sua senha regularmente para manter sua conta segura
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Senha Atual */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Senha Atual
                          </div>
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => {
                              setFormData({...formData, currentPassword: e.target.value})
                              setErrors({...errors, currentPassword: ""})
                            }}
                            placeholder="Digite sua senha atual"
                            className={errors.currentPassword ? "border-red-500" : ""}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      {/* Nova Senha */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Nova Senha
                          </div>
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => {
                              setFormData({...formData, newPassword: e.target.value})
                              setErrors({...errors, newPassword: ""})
                            }}
                            placeholder="Digite a nova senha"
                            className={errors.newPassword ? "border-red-500" : ""}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        
                        {/* Força da senha */}
                        {formData.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">Força da senha:</span>
                              <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                {passwordStrength.text}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength.score === 0 ? "w-0" :
                                  passwordStrength.score === 1 ? "w-1/4 bg-red-500" :
                                  passwordStrength.score === 2 ? "w-1/2 bg-orange-500" :
                                  passwordStrength.score === 3 ? "w-3/4 bg-yellow-500" :
                                  "w-full bg-green-500"
                                }`}
                              />
                            </div>
                          </div>
                        )}
                        
                        {errors.newPassword && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      {/* Confirmar Nova Senha */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Confirmar Nova Senha
                          </div>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData({...formData, confirmPassword: e.target.value})
                              setErrors({...errors, confirmPassword: ""})
                            }}
                            placeholder="Digite novamente a nova senha"
                            className={errors.confirmPassword ? "border-red-500" : ""}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Dicas de segurança */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Dicas para uma senha segura:
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              Use pelo menos 8 caracteres
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              Combine letras maiúsculas e minúsculas
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              Inclua números e caracteres especiais
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              Não use informações pessoais
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Separator />

                      {/* Botões */}
                      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          className="order-2 sm:order-1"
                        >
                          <Link href="/conta?tab=seguranca">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                          </Link>
                        </Button>
                        
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-primary hover:bg-primary/90 order-1 sm:order-2"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Alterando...
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Alterar Senha
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccountLayout>
        </div>
      </main>

      <Footer />
    </div>
  )
}