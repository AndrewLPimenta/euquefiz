"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardData {
  image: string;
  title: string;
  description: string;
}

interface GroupData {
  cards: CardData[];
  button: {
    label: string;
    link: string;
  };
}

const Card = ({
  image,
  children,
}: {
  image?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-[350px] h-[400px] bg-background rounded-2xl border border-text/90 shadow overflow-hidden">
      {image && (
        <div className="h-72 overflow-hidden m-2 rounded-xl">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-4 py-2 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

const StackedCardsGroup = ({ group }: { group: GroupData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-120px" });

  return (
    <div
      className="
flex flex-col items-center justify-center w-full flex-2 px-10 mt-10
      "
    >
      <div
        className="
flex flex-col gap-7
      "
      >

        <div
          ref={ref}
          className=" 
             scale-[0.6] sm:scale-100"
        >
          <div className="relative w-[350px] h-[400px]">
            {group.cards.slice(0, 3).map((card, index) => {
              /** POSIÇÃO */
              const x =
                index === 1 ? -140 : index === 2 ? 140 : 0;
              const rotate =
                index === 1 ? -5 : index === 2 ? 5 : 0;

              /** PROFUNDIDADE */
              const zIndex =
                index === 0 ? 30 : index === 1 ? 20 : 10;

              /** ALINHAMENTO DO TEXTO */
              const textAlign =
                index === 0
                  ? "text-center"
                  : index === 1
                    ? "text-left"
                    : "text-right ";

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{ zIndex }}
                  initial={{ x: 0, rotate: 0 }}
                  animate={{
                    x: isInView ? x : 0,
                    rotate: isInView ? rotate : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                  }}
                >
                  <Card image={card.image}>
                    <div
                      className={cn(
                        "flex flex-col gap-2",
                        index === 0 && "items-center text-center",
                        index === 1 && "items-start text-left",
                        index === 2 && "items-end text-right"
                      )}
                    >
                      <h3 className="font-semibold">
                        {card.title}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </Card>

                </motion.div>
              );
            })}
          </div>
        </div>
       <motion.div initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 mt-9 text-center">
          <Link
            href={group.button.link}
              className="
    group inline-flex items-center gap-3
    rounded-full bg-primary
    px-6 py-3 text-sm font-bold
    text-primary-foreground
    transition-all
    hover:scale-105 hover:shadow-lg

  ">

  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

          
            {group.button.label}
          </Link>
</motion.div>

      </div>
    </div>
  );
};

const StackedCardsInteraction = ({
  groups,
}: {
  groups: GroupData[];
}) => {
  return (
    <div className="flex flex-col gap-24">
      {groups.map((group, index) => (
        <StackedCardsGroup key={index} group={group} />
      ))}
    </div>
  );
};

export { StackedCardsInteraction };
