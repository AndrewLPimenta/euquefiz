import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";

const SectionProducts = () => {
  return (
    <StackedCardsInteraction
      groups={[
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Modelos de Sandália",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "Modelos de Sandália",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "Modelos de Sandália",
            },
          ],
          button: {
            label: "Sandálias",
            link: "/produtos/sandalias",
          },
        },
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Bolsa",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "Bolsa",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "Bolsa",
            },
          ],
          button: {
            label: "Bolsas",
            link: "/produtos/bolsas",
          },
        },
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Lembrancinhas",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "lembrancinhas",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "lembrancinhas",
            },
          ],
          button: {
            label: "Lembrancinhas",
            link: "/produtos/lembrancas",
          },
        },
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Espirito Santo",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "Espirito Santo",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "Espirito Santo",
            },
          ],
          button: {
            label: "Cristianismo",
            link: "/produtos/cristianismo",
          },
        },
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Organizadores",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "Organizadores",

            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "Organizadores",

            },
          ],
          button: {
            label: "Organização",
            link: "/produtos/organizacao",
          },
        },
        {
          cards: [
            {
              image: "/placeholder.svg",
              title: "Modelo 1",
              description: "Itens para casa",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 2",
              description: "Itens para casa",
            },
            {
              image: "/placeholder.svg",
              title: "Modelo 3",
              description: "Itens para casa",
            },
          ],
          button: {
            label: "Ver tudo para casa",
            link: "/produtos/casa",
          },
        },
      ]}
    />
  );
};

export { SectionProducts };
