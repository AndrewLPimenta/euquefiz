import { Testimonials } from "@/components/ui/testimonials"

const testimonials = [
  {
    image: "/placeholder-user.jpg",
    text: "Gostei muito da experiência de compra. Tudo chegou certinho, bem embalado e com ótima qualidade.",
    name: "Mariana Alves",
    username: "@mariana.alves",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Produtos lindos e bem feitos. Dá pra ver o cuidado em cada detalhe, com certeza comprarei novamente.",
    name: "Lucas Pereira",
    username: "@lucas.pereira",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "A loja tem uma variedade incrível. Sempre encontro algo diferente e que combina comigo.",
    name: "Fernanda Rocha",
    username: "@fernanda.rocha",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Entrega rápida e atendimento muito atencioso. Me senti segura durante toda a compra.",
    name: "Rafael Costa",
    username: "@rafael.costa",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Comprei para presentear e foi um sucesso. Produto bonito, bem acabado e de ótima qualidade.",
    name: "Juliana Martins",
    username: "@juliana.martins",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Experiência excelente do começo ao fim. Site fácil de usar e produtos exatamente como descritos.",
    name: "Thiago Nunes",
    username: "@thiago.nunes",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Gostei muito do cuidado com a embalagem e dos detalhes. Dá pra sentir o carinho em cada pedido.",
    name: "Camila Oliveira",
    username: "@camila.oliveira",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Loja confiável, produtos bem feitos e ótima comunicação. Recomendo sem medo.",
    name: "Bruno Santos",
    username: "@bruno.santos",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Tudo chegou dentro do prazo e superou minhas expectativas. Qualidade excelente.",
    name: "Aline Freitas",
    username: "@aline.freitas",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Adorei a proposta da loja. Produtos únicos e uma experiência de compra muito agradável.",
    name: "Pedro Lima",
    username: "@pedro.lima",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Já comprei mais de uma vez e sempre fico satisfeita. Tudo muito bem feito.",
    name: "Natália Ribeiro",
    username: "@natalia.ribeiro",
    social: "https://instagram.com/"
  },
  {
    image: "/placeholder-user.jpg",
    text: "Excelente custo-benefício. Dá pra perceber a qualidade logo ao receber o produto.",
    name: "Diego Araújo",
    username: "@diego.araujo",
    social: "https://instagram.com/"
  }
];

export default function ProvaSocial() {
  return (
        <div className="flex flex-col justify-center px-4">
      <Testimonials testimonials={testimonials} />
    </div>
  )
}