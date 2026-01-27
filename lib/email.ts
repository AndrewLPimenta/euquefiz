// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  customerName: string
) {
  try {
    await resend.emails.send({
      from: 'Loja <vendas@seudominio.com>',
      to,
      subject: `Pedido #${orderNumber} Confirmado!`,
      html: `
        <h1>Obrigado pela compra, ${customerName}!</h1>
        <p>Seu pedido #${orderNumber} foi recebido.</p>
        <p>Acompanhe seu pedido em: https://seusite.com/conta/meuspedidos</p>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}