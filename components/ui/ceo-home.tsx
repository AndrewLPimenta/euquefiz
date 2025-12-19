import * as React from "react";
import { TestimonialSlider } from "@/components/ui/testimonial-slider-1";

const reviews = [
  {
    id: 1,
    name: "Danielle",
    affiliation: "@euquefiz_bydani",
    quote:
      "Você já teve vontade no coração que era hora de criar algo seu?",
    imageSrc:
      "/ceo-placeholder-photo.png",
    thumbnailSrc:
      "/placeholder.svg",
  },
  {
    id: 2,
    name: "Danielle",
    affiliation: "@euquefiz_bydani",
    quote:
      "A euquefiz nasceu exatamente assim.",
    imageSrc:
      "/ceo-placeholder-photo.png",
    thumbnailSrc:
      "/placeholder.svg",
  },
  {
    id: 3,
    name: "Danielle",
    affiliation: "@euquefiz_bydani",
    quote:
      "Da vontade de colocar minhas mãos em algo",
    imageSrc:
      "/ceo-placeholder-photo.png",
    thumbnailSrc:
      "/placeholder.svg",
  },
   {
     id: 4,
     name: "Danielle",
     affiliation: "@euquefiz_bydani",
     quote:
       "Que representasse cuidado, afeto e exclusividade..",
     imageSrc:
       "/ceo-placeholder-photo.png",
     thumbnailSrc:
       "/placeholder.svg",
   },
   {
     id: 5,
     name: "Danielle",
     affiliation: "@euquefiz_bydani",
     quote:
       "Essa marca é a extensão da minha história, e hoje eu começo a dividi-la com você.",
     imageSrc:
       "/placeholder.sv",
     thumbnailSrc:
       "ceo-placeholder.png",
   },
];

export default function CeoHome() {
  return (
    <div className="w-full flex justify-center">
      <div className=" origin-top">
        <TestimonialSlider reviews={reviews} />
      </div>
    </div>
  );
}