// lib/api/public.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.15.7:3001/api"

async function fetchPublicAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro ${response.status} em ${endpoint}:`, errorText);
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// API pública - apenas GETs
export const publicAPI = {
  // Produtos
  getProducts: () => fetchPublicAPI("/products"),
  getProductById: (id: string) => fetchPublicAPI(`/products/${id}`),
  
  // Categorias
  getCategories: () => fetchPublicAPI("/categories"),
  getCategoryBySlug: (slug: string) => fetchPublicAPI(`/categories/slug/${slug}`),
  getCategoryById: (id: string) => fetchPublicAPI(`/categories/${id}`),
};