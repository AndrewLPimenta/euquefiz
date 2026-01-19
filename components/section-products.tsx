"use client"

import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";
import { useEffect, useState } from "react";
import { categoriesAPI, productsAPI } from '@/lib/api';

interface Card {
  image: string
  title: string
  description: string
}

const SectionProducts = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategoriesWithProducts() {
      try {
        setLoading(true);
        console.log("📦 Carregando categorias e produtos...");

        // 1. Busca todas as categorias
        const categoriesResponse = await categoriesAPI.getAll();
        const categories = categoriesResponse.data || categoriesResponse || [];

        console.log(`✅ Categorias encontradas: ${categories.length}`);

        // 2. Para cada categoria, busca produtos reais
        const groupsPromises = categories.slice(0, 6).map(async (category: any) => {
          try {
            console.log(`🔍 Buscando produtos da categoria: ${category.nome}`);

            const productsResponse = await productsAPI.getByCategory(category.slug);
            const productsData = productsResponse.data || [];

            const realProducts = productsData.slice(0, 3);

            let cards: Card[] = []

            if (realProducts.length > 0) {
              cards = realProducts.map((product: any) => ({
                image: product.produto_midias?.[0]?.url || "/placeholder.svg",
                title: product.nome,
                description: (product.descricao?.substring(0, 50) + "...") || "Produto exclusivo",
              }));
            }

            while (cards.length < 3) {
              cards.push({
                image: "/placeholder.svg",
                title: "Novo Modelo",
                description: "Em breve",
              });
            }

            return {
              cards,
              button: {
                label: category.nome,
                link: `/category/${category.slug}`,
              },
            };
          } catch (err) {
            console.error(`❌ Erro ao carregar produtos da categoria ${category.nome}:`, err);

            const cards: Card[] = [
              { image: "/placeholder.svg", title: "Modelos Exclusivos", description: "Coleção especial" },
              { image: "/placeholder.svg", title: "Edição Limitada", description: "Feito à mão" },
              { image: "/placeholder.svg", title: "Lançamento", description: "Novidades em breve" },
            ];

            return {
              cards,
              button: {
                label: category.nome,
                link: `/category/${category.slug}`,
              },
            };
          }
        });


        // 3. Aguarda todas as promises
        const groupsData = await Promise.all(groupsPromises);
        setGroups(groupsData);

        console.log(`🎉 Grupos carregados: ${groupsData.length}`);

      } catch (err) {
        console.error("❌ Erro geral ao carregar:", err);
        setError("Não foi possível carregar os dados");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategoriesWithProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar produtos</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-600">Nenhum produto disponível</p>
      </div>
    );
  }

  return <StackedCardsInteraction groups={groups} />;
};

export { SectionProducts };