"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Instagram, Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"
import WhatsAppButton from "@/components/whatsapp" 

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica de envio do formulário
    console.log("Formulário enviado:", formData)
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" })
  }


  const [buttonColor, setButtonColor] = useState('#25D366')


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Whatsapp",
      value: "(19) 99778-5025",
      link: "https://w.app/vbp4tr",
    },
    {
      icon: Mail,
      title: "E-mail",
      value: "dani.franca002@gmail.com",
      link: "inserir link aqui animal",
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@euquefiz_bydani",
      link: "https://www.instagram.com/euquefiz_bydani/",
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Campinas, SP",
      link: "https://maps.app.goo.gl/zSWqb8y1ew3L2QMP8",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Entre em Contato</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Estamos aqui para responder suas dúvidas e ajudar você a encontrar o produto perfeito
            </p>
          </div>
        </section>

        {/* Contact Section */}

        <section className="py-16 px-4">
          <WhatsAppButton

        message="Olá, gostaria de mais informações!"
        buttonColor={'#25D366'}
        buttonText=""
        position="bottom-right"
      />

          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Conte-nos sobre o que você procura..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar Mensagem
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Informações de Contato</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Fique à vontade para entrar em contato através de qualquer um dos nossos canais. Estamos ansiosos
                    para ouvir você!
                  </p>

                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <a
                            href={info.link}
                            className="flex items-center gap-4 hover:text-primary transition-colors"
                            target={info.link.startsWith("http") ? "_blank" : undefined}
                            rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <info.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">{info.title}</p>
                              <p className="font-medium">{info.value}</p>
                            </div>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="border-2 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Horário de Atendimento</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span className="font-medium text-foreground">-- às --</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Sábado:</span>
                        <span className="font-medium text-foreground">-- às --</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Domingo:</span>
                        <span className="font-medium text-foreground">-- às --</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes</h2>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Vocês fazem produtos personalizados?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sim! Adoramos criar peças personalizadas. Entre em contato para discutirmos suas ideias e
                    necessidades.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Qual o prazo de entrega?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    O prazo varia de acordo com o produto e a quantidade. Em média, leva de 7 a 15 dias úteis.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Posso escolher outras cores além das mostradas?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Com certeza! Trabalhamos com diversas cores e estampas. Consulte-nos sobre as opções disponíveis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
