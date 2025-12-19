"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">

      {/* Texto */}
      <div className="order-1 md:order-2">
        <span className="block mb-4 text-xs md:text-sm text-primary font-medium uppercase tracking-wider">
          Feito para Você
        </span>

        <h3 className="text-4xl md:text-6xl font-semibold text-foreground leading-tight">
          Experiência que refletem quem você é.
        </h3>

        <p className="text-base md:text-lg text-muted-foreground my-4 md:my-6 leading-relaxed">
          Independente do seu estilo ou necessidade, nossa variedade garante que você
          encontre exatamente o que procura.
        </p>

        <Link href="/produtos">
          <button
            className={cn(
              "bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md",
              "transition-all hover:bg-primary/90 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Ver coleções
          </button>
        </Link>
      </div>


      <div className="order-2 md:order-1">
        <ShuffleGrid />
      </div>

    </section>

  );
};

const squareData = [

  {
    id: 1,
    src: "./placeholder.svg",
  },
  {
    id: 2,
    src: "./placeholder.svg",
  },
  {
    id: 3,
    src: "./placeholder.svg",
  },
  {
    id: 4,
    src: "./placeholder.svg",
  },
  {
    id: 5,
    src: "./placeholder.svg",
  },
  {
    id: 6,
    src: "./placeholder.svg",
  },
  {
    id: 7,
    src: "./placeholder.svg",
  },
  {
    id: 8,
    src: "./placeholder.svg",
  },
  {
    id: 9,
    src: "./placeholder.svg",
  },
  {
    id: 10,
    src: "./placeholder.svg",
  },
  {
    id: 11,
    src: "./placeholder.svg",
  },
  {
    id: 12,
    src: "./placeholder.svg",
  },
  {
    id: 13,
    src: "./placeholder.svg",
  },
  {
    id: 14,
    src: "./placeholder.svg",
  },
  {
    id: 15,
    src: "./placeholder.svg",
  },
  {
    id: 16,
    src: "./placeholder.svg",
  },

];

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Componente separado para o grid
const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<JSX.Element[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Inicializar apenas no cliente
  useEffect(() => {
    setIsClient(true);
    const generateSquares = () => {
      return shuffle(squareData).map((sq) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring" }}
          className="w-full h-full rounded-md overflow-hidden bg-muted "
          style={{
            backgroundImage: `url(${sq.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ));
    };

    setSquares(generateSquares());
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    const generateSquares = () => {
      return shuffle(squareData).map((sq) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring" }}
          className="w-full h-full rounded-md overflow-hidden bg-muted border border-primary/10"
          style={{
            backgroundImage: `url(${sq.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ));
    };

    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  if (!isClient) {
    return (
      <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-full rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares}
    </div>
  );
};

export default ShuffleGrid;