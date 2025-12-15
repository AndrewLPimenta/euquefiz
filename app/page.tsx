"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Heart, Sparkles, Home } from "lucide-react"
import WhatsAppButton from "@/components/whatsapp" 
import { useState } from "react"

export default function HomePage() {

  const [buttonColor, setButtonColor] = useState('#25D366');
  

  const featuredProducts = [
    {
      name: "Necessaire",
      category: "Organização",
      description: "Organize seus itens com estilo e praticidade",
    },
    {
      name: "Cachepô Decorativo",
      category: "Decoração",
      description: "Traga vida e cor para seus ambientes",
    },
    {
      name: "Kit Lavabo",
      category: "Banheiro",
      description: "Elegância e funcionalidade para seu lavabo",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
 <WhatsAppButton
        phoneNumber="1-212-736-5000"
        message="Olá, gostaria de mais informações!"
        buttonColor={'#25D366'}
        buttonText="Fale conosco"
        position="bottom-right"
      />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background -z-10" />
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold tracking-tight text-balance leading-tight">
                Produtos artesanais para sua{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  casa dos sonhos
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                Cada peça é cuidadosamente criada para transformar sua casa em um lar ainda mais acolhedor e especial
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-base group transition-all duration-300 hover:scale-105">
                  <Link href="/produtos">
                    Ver Coleção
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Link href="/sobre">Nossa História</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Feito à Mão</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cada peça é confeccionada artesanalmente com atenção aos mínimos detalhes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Sparkles className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold">Design Único</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Produtos exclusivos que tornam cada ambiente da sua casa especial
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Home className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Para Sua Casa</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      De decoração a organização, tudo para deixar seu lar mais bonito
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Produtos em Destaque</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
                Conheça alguns dos nossos favoritos para transformar sua casa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4 p-8">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <div className="text-4xl">📸</div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Fotos e vídeos do produto</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-primary font-semibold mb-2">{product.category}</p>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Link href="/produtos">
                  Ver Toda Coleção
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(64,224,208,0.1),transparent_50%)] -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(250,128,114,0.1),transparent_50%)] -z-10" />
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-balance">
                Pronto para transformar sua casa?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Entre em contato e descubra como nossos produtos podem deixar seu lar ainda mais especial
              </p>
              <Button asChild size="lg" className="text-base group transition-all duration-300 hover:scale-105">
                <Link href="/contato">
                  Fale Conosco
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
