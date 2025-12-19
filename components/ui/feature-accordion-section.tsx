"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function FeatureAccordionSection() {

const features = [
  {
    id: "item-1",
    title: "Compromisso com qualidade",
    count: 24,
    image: "/placeholder.jpg",
    description:
      "Selecionamos e produzimos cada item com cuidado, priorizando bons materiais, acabamento e durabilidade em todos os produtos.",
  },
  {
    id: "item-2",
    title: "Atenção aos detalhes em cada peça",
    count: 12,
    image: "/placeholder.jpg",
    description:
      "Nada é feito no automático. Cada detalhe é pensado para entregar um produto bonito, funcional e bem finalizado.",
  },
  {
    id: "item-3",
    title: "Produtos feitos para o dia a dia",
    count: 18,
    image: "/placeholder.jpg",
    description:
      "Criamos itens pensados para uso real, que se encaixam facilmente na rotina e no cotidiano.",
  },
  {
    id: "item-4",
    title: "Equilíbrio entre estética e funcionalidade",
    count: 30,
    image: "/placeholder.jpg",
    description:
      "Nossos produtos unem beleza e utilidade, para que cada escolha faça sentido tanto visualmente quanto no uso.",
  },
  {
    id: "item-5",
    title: "Transparência em cada escolha",
    count: 15,
    image: "/placeholder.jpg",
    description:
      "O que você vê é o que recebe. Prezamos por descrições claras, fotos reais e uma experiência sem surpresas.",
  },
  {
    id: "item-6",
    title: "Cuidado em toda a experiência",
    count: 22,
    image: "/placeholder.jpg",
    description:
      "Do primeiro contato até o produto em mãos, buscamos oferecer um processo simples, seguro e agradável.",
  },
];



  return (
    <div className="flex w-full max-w-xl mx-auto rounded-xl border border-border bg-card/20 text-card-foreground shadow-sm p-4">
      <Accordion type="single" collapsible className="w-full">
        {features.map((feature) => (
          <AccordionItem
            key={feature.id}
            value={feature.id}
            className="border-b border-border last:border-b-0"
          >
            <AccordionTrigger className="flex items-center gap-3 py-3 text-left hover:no-underline">
              <Image
                src={feature.image}
                alt={feature.title}
                width={28}
                height={28}
                className="rounded-md border border-border"
              />

              <span className="flex-1 font-medium text-foreground">
                {feature.title}
              </span>

              <span className="text-xs text-muted-foreground">
                ({feature.count})
              </span>
            </AccordionTrigger>

            <AccordionContent className="px-2 pb-4 pt-2 space-y-3">
              <div className="w-full flex justify-center">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md object-cover border border-border"
                />
              </div>

              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {feature.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
