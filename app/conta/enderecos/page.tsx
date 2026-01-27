// app/conta/enderecos/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  Star,
  User,
  Map,
  Navigation,
  Phone,
  Building,
  Globe,
  X,
  Save,
  ArrowLeft
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountLayout from "@/components/account/account-layout"
import { addressAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { checkoutAPI } from "@/lib/api"

interface Address {
  id: string
  tipo: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  principal: boolean
  nome?: string
  telefone?: string
  ponto_referencia?: string
}

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export default function AddressesPage() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const [formData, setFormData] = useState({
    tipo: "casa",
    nome: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    ponto_referencia: "",
    principal: false
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses()
    }
  }, [isAuthenticated])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const addressesData = await addressAPI.getMyAddresses()
      setAddresses(addressesData)
    } catch (error) {
      console.error("Erro ao carregar endereços:", error)
      toast.error("Erro ao carregar endereços")
    } finally {
      setLoading(false)
    }
  }

  const handleCepChange = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '')
    setFormData({...formData, cep})
    
    if (cleanCEP.length === 8) {
      try {
        const { success, data } = await checkoutAPI.getAddressByCEP(cleanCEP)
        if (success && data) {
          setFormData(prev => ({
            ...prev,
            rua: data.rua || "",
            bairro: data.bairro || "",
            cidade: data.localidade || data.cidade || "",
            estado: data.uf || data.estado || ""
          }))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        await addressAPI.updateAddress(editingAddress.id, formData)
        toast.success("Endereço atualizado com sucesso!")
      } else {
        await addressAPI.createAddress(formData)
        toast.success("Endereço adicionado com sucesso!")
      }
      
      await loadAddresses()
      resetForm()
    } catch (error: any) {
      console.error("Erro ao salvar endereço:", error)
      toast.error(error.message || "Erro ao salvar endereço")
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      tipo: address.tipo || "casa",
      nome: address.nome || "",
      rua: address.rua,
      numero: address.numero,
      complemento: address.complemento || "",
      bairro: address.bairro,
      cidade: address.cidade,
      estado: address.estado,
      cep: address.cep,
      telefone: address.telefone || "",
      ponto_referencia: address.ponto_referencia || "",
      principal: address.principal || false
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return
    
    try {
      await addressAPI.deleteAddress(id)
      toast.success("Endereço excluído com sucesso!")
      await loadAddresses()
    } catch (error: any) {
      console.error("Erro ao excluir endereço:", error)
      toast.error(error.message || "Erro ao excluir endereço")
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await addressAPI.setDefaultAddress(id)
      toast.success("Endereço definido como principal!")
      await loadAddresses()
    } catch (error: any) {
      console.error("Erro ao definir endereço principal:", error)
      toast.error(error.message || "Erro ao definir endereço principal")
    }
  }

  const resetForm = () => {
    setFormData({
      tipo: "casa",
      nome: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      ponto_referencia: "",
      principal: false
    })
    setEditingAddress(null)
    setIsAdding(false)
  }

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'casa': return <Home className="h-4 w-4" />
      case 'trabalho': return <Briefcase className="h-4 w-4" />
      case 'familia': return <User className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch(tipo) {
      case 'casa': return 'Casa'
      case 'trabalho': return 'Trabalho'
      case 'familia': return 'Família'
      default: return 'Outro'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <AccountLayout 
              activeTab="enderecos"
              title="Meus Endereços"
              description="Gerencie seus endereços de entrega"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
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
            activeTab="enderecos"
            title="Meus Endereços"
            description="Gerencie seus endereços de entrega"
          >
            <div className="space-y-6">
              {/* Botão para adicionar */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    Endereços de Entrega
                  </h2>
                  <p className="text-gray-500">
                    {addresses.length} endereço{addresses.length !== 1 ? 's' : ''} cadastrado{addresses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <Button
                  onClick={() => setIsAdding(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Endereço
                </Button>
              </div>

              {/* Formulário de endereço */}
              {(isAdding || editingAddress) && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <CardTitle>
                        {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetForm}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipo">Tipo de Endereço</Label>
                          <Select
                            value={formData.tipo}
                            onValueChange={(value) => setFormData({...formData, tipo: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casa">🏠 Casa</SelectItem>
                              <SelectItem value="trabalho">💼 Trabalho</SelectItem>
                              <SelectItem value="familia">👨‍👩‍👧 Família</SelectItem>
                              <SelectItem value="outro">📍 Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome do Endereço (opcional)</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            placeholder="Ex: Casa, Trabalho, Família"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          placeholder="00000-000"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rua">Rua</Label>
                          <Input
                            id="rua"
                            value={formData.rua}
                            onChange={(e) => setFormData({...formData, rua: e.target.value})}
                            placeholder="Nome da rua"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="numero">Número</Label>
                          <Input
                            id="numero"
                            value={formData.numero}
                            onChange={(e) => setFormData({...formData, numero: e.target.value})}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento (opcional)</Label>
                        <Input
                          id="complemento"
                          value={formData.complemento}
                          onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                          placeholder="Apto, bloco, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bairro">Bairro</Label>
                          <Input
                            id="bairro"
                            value={formData.bairro}
                            onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                            placeholder="Nome do bairro"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={formData.cidade}
                            onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                            placeholder="Nome da cidade"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Select
                            value={formData.estado}
                            onValueChange={(value) => setFormData({...formData, estado: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {estados.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  {estado}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone para contato</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ponto_referencia">Ponto de referência (opcional)</Label>
                          <Input
                            id="ponto_referencia"
                            value={formData.ponto_referencia}
                            onChange={(e) => setFormData({...formData, ponto_referencia: e.target.value})}
                            placeholder="Próximo ao mercado, etc."
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="principal"
                          checked={formData.principal}
                          onChange={(e) => setFormData({...formData, principal: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="principal">
                          Definir como endereço principal
                        </Label>
                      </div>

                      <Separator />

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          {editingAddress ? "Atualizar Endereço" : "Salvar Endereço"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Lista de endereços */}
              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                        <MapPin className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Nenhum endereço cadastrado</h3>
                      <p className="text-gray-500 mb-6">
                        Adicione seus endereços de entrega para facilitar suas compras
                      </p>
                      <Button onClick={() => setIsAdding(true)}>
                        <Plus className="mr-2 h-5 w-5" />
                        Adicionar Primeiro Endereço
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addresses.map((address) => (
                    <Card 
                      key={address.id} 
                      className={address.principal ? "border-primary border-2" : ""}
                    >
                      <CardContent className="p-6">
                        {/* Cabeçalho do cartão */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(address.tipo)}
                            <span className="font-semibold">
                              {getTipoLabel(address.tipo)}
                              {address.nome && `: ${address.nome}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {address.principal && (
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                                <Star className="h-3 w-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Endereço */}
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            {address.rua}, {address.numero}
                            {address.complemento && `, ${address.complemento}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.bairro}, {address.cidade} - {address.estado}
                          </p>
                          <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                          
                          {address.telefone && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {address.telefone}
                            </p>
                          )}
                          
                          {address.ponto_referencia && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Navigation className="h-3 w-3" />
                              {address.ponto_referencia}
                            </p>
                          )}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        {/* Ações */}
                        <div className="flex justify-between">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(address)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(address.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                          
                          {!address.principal && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Principal
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Dicas */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Dicas importantes</h3>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>• O endereço principal será usado por padrão em suas compras</li>
                        <li>• Mantenha seus endereços atualizados para garantir entregas corretas</li>
                        <li>• Você pode ter vários endereços para diferentes situações</li>
                        <li>• Verifique sempre o CEP para garantir que a entrega seja possível</li>
                      </ul>
                    </div>
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