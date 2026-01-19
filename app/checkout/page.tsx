"use client";

import { useCart } from "@/contexts/cart-context";
import { useState } from "react";
import { ordersAPI, ecommerceHelpers } from "@/lib/api";

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [endereco, setEndereco] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [observacoes, setObservacoes] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const frete = subtotal > 200 ? 0 : 15;
  const total = subtotal + frete;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!endereco) {
      setError("Endereço é obrigatório");
      return;
    }

    if (cart.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    try {
      setLoading(true);

      const res = await ordersAPI.createOrder({
        items: cart.map(item => ({
          produto_id: item.productId,
          quantidade: item.quantity,
        })),
        endereco_entrega: endereco,
        metodo_pagamento: metodoPagamento,
        observacoes,
      });

      if (res.success) {
        setSuccessMsg(`Pedido criado com sucesso! ID: ${res.data.pedido.id}`);
        // ✅ Evita erro de carrinho vazio
        await clearCart();
      } else {
        setError(res.error || "Erro ao criar pedido");
      }
    } catch (err: any) {
      setError(err.message || "Erro interno ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Processando pedido...</p>;
  if (cart.length === 0)
    return <p>Seu carrinho está vazio. Adicione produtos antes do checkout.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Teste</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Itens do carrinho</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>{ecommerceHelpers.formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{ecommerceHelpers.formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete:</span>
          <span>{ecommerceHelpers.formatPrice(frete)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{ecommerceHelpers.formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Endereço de entrega</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Método de pagamento</label>
          <select
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="pix">PIX</option>
            <option value="cartao">Cartão de crédito</option>
            <option value="boleto">Boleto</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ex: Deixar na portaria"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Finalizar Pedido
        </button>
      </form>
    </div>
  );
}
