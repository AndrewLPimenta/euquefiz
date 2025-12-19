"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Heart, Sparkles, Home } from "lucide-react"
import WhatsAppButton from "@/components/whatsapp"
import { useState } from "react"
import { HeroSection } from "@/components/ui/hero-section-2"
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import FeatureAccordionSection from "@/components/ui/feature-accordion-section"
import * as React from "react";
import CeoHome from "@/components/ui/ceo-home"
import ProvaSocial from "@/components/ui/social-prova"

export default function HomePage() {

  const [buttonColor, setButtonColor] = useState('#25D366');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <WhatsAppButton
        message="Olá, Danielle!"
        buttonColor={'#25D366'}
        buttonText=""
        position="bottom-right"
      />
      <main className="flex-1">

        <HeroSection
          logo={{
            alt: "Minha Logo",
            lightUrl: "/logo-hero-claro.png",
            darkUrl: "/logo-hero-escuro.png"
          }}

          slogan="Arte que transforma espaços"
          title={
            <>
              Produtos
              <br />
              <span className="text-primary">Únicos</span> pra você
            </>
          }
          subtitle="Descubra peças exclusivas feitas sob medida. Cada item conta uma história e traz personalidade."
          callToAction={{
            text: "Ver Produtos",
            href: "/produtos"
          }}

          backgroundImage="/placeholder.svg"
          className="min-h-screen"
        />
        <div className="flex min-h-screen w-full flex-col justify-center">
          <ShuffleHero />
        </div>

        <div className="flex min-h-screen w-full flex-col justify-center px-4">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Garantimos a
            <span className="text-primary"> você:</span>
          </h2>
          <FeatureAccordionSection />
        </div>
        <div className="flex min-h-screen w-full flex-col justify-center px-4">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            <span className="text-primary">Nossos</span> Clientes.
          </h1>
          <ProvaSocial
          />
        </div>
        <div className="flex h-55 w-full flex-col justify-center px-4">
        </div>

        <div className="flex min-h-screen w-full flex-col justify-center px-4">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            <span className="text-primary">CEO</span> 
          </h1>
          <CeoHome />
        </div>
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Feito pra você</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cada item é especial, feito com atenção aos mínimos detalhes.
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
                      Produtos exclusivos que tornam cada experiência única e especial.
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
                    <h3 className="text-xl font-semibold">Sinta-se em casa</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cada peça foi cuidadosamente projetada para proporcionar conforto e estilo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {/* <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Produtos em Destaque</h2>
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
                  Ver mais
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section> */}

        <section className="py-24 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(64,224,208,0.1),transparent_50%)] -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(250,128,114,0.1),transparent_50%)] -z-10" />
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-balance">
                Ficou com alguma duvida?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Entre em contato e esclarecemos todas elas.
              </p>
              <Button asChild size="lg" className="text-base group transition-all duration-300 hover:scale-105">
                <Link href="/contato">
                  Entrar em contato
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
