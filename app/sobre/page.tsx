import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Sparkles, Users, Award } from "lucide-react"

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: "Amor pelo que fazemos",
      description: "Cada produto é feito com dedicação e carinho, pensando em levar alegria para nossos clientes.",
    },
    {
      icon: Sparkles,
      title: "Criatividade",
      description: "Buscamos sempre inovar e criar peças únicas que se destacam pela originalidade.",
    },
    {
      icon: Users,
      title: "Compromisso com o cliente",
      description: "A satisfação dos nossos clientes é nossa maior prioridade e motivação.",
    },
    {
      icon: Award,
      title: "Qualidade",
      description: "Utilizamos apenas materiais de primeira qualidade em todos os nossos produtos.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Sobre a Euquefiz</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Conheça a história por trás de cada produto artesanal
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A Euquefiz nasceu do amor pelo artesanato e do desejo de criar peças únicas e especiais. Cada produto
                  é pensado nos mínimos detalhes, feito à mão com muito carinho e dedicação.
                </p>
                <p>
                  Começamos pequenos, criando itens para amigos e família, e logo percebemos que havia uma demanda por
                  produtos artesanais de qualidade, que fugissem do comum e trouxessem personalidade para cada ambiente.
                </p>
                <p>
                  Hoje, a Euquefiz oferece uma variedade de produtos que vão desde organizadores práticos até peças
                  decorativas sofisticadas. Nosso compromisso é sempre entregar produtos que superem as expectativas e
                  levem um pouco de arte e funcionalidade para a vida de nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="py-8 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
              <img
                src="/placeholder.svg?height=600&width=1400"
                alt="Processo artesanal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Nossos Valores</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">O que nos guia em cada criação</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-2 text-center">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-balance">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Criar produtos artesanais únicos e de alta qualidade que tragam beleza, organização e personalidade para a
              vida de nossos clientes. Cada peça é feita com amor e atenção aos detalhes, valorizando o trabalho manual
              e a criatividade.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
