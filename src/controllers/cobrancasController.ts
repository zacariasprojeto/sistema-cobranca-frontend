import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { enviarMensagem } from "../services/whatsappService";

// 🔧 Converte número para formato WhatsApp válido
function formatarNumero(numero: string): string {
  if (!numero) return "";
  numero = numero.replace(/\D/g, ""); // remove tudo que não é número

  // se tiver 10 ou 11 dígitos, adiciona DDI 55
  if (numero.length === 10 || numero.length === 11) {
    numero = "55" + numero;
  }

  return numero + "@c.us";
}

// ==========================================================
// COBRANÇA MANUAL
// ==========================================================
export async function cobrancaManual(req: any, res: Response) {
  try {
    const cliente_id = req.params.cliente_id;

    const { data: cliente, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", cliente_id)
      .single();

    if (error || !cliente) return res.status(404).json({ error: "Cliente não encontrado" });

    const numeroFormatado = formatarNumero(cliente.telefone);

    const texto = `Olá ${cliente.nome}, você possui parcelas em atraso. Por favor, regularize sua situação.`;

    await enviarMensagem(numeroFormatado, texto);

    await supabase.from("historico_envios").insert({
      cliente_id,
      tipo: "cobranca",
      via: "whatsapp",
      status: "enviado",
      mensagem: texto
    });

    return res.json({ message: "Cobrança enviada via WhatsApp." });

  } catch (e) {
    console.error("Erro na cobrança manual:", e);
    return res.status(500).json({ error: "Erro ao enviar cobrança manual." });
  }
}

// ==========================================================
// COBRANÇA AUTOMÁTICA (cron job)
// ==========================================================
export async function cobrancaAutomatica(req: Request, res: Response) {
  try {
    const { data: parcelas } = await supabase
      .from("parcelas")
      .select("*, clientes(*), emprestimos(*)")
      .lt("vencimento", new Date().toISOString())
      .eq("pago", false);

    if (!parcelas || parcelas.length === 0) {
      return res.json({ message: "Nenhuma cobrança encontrada." });
    }

    for (const p of parcelas) {
      const cliente = p.clientes;

      if (!cliente) continue;

      const numeroFormatado = formatarNumero(cliente.telefone);

      const texto = `
⚠️ ATENÇÃO, ${cliente.nome}

Sua parcela número ${p.numero} está em atraso.

Valor: R$ ${p.valor}
Vencimento: ${p.vencimento}

Por favor regularize o pagamento.
      `;

      await enviarMensagem(numeroFormatado, texto);

      await supabase.from("historico_envios").insert({
        cliente_id: cliente.id,
        parcela_id: p.id,
        tipo: "cobranca_automatica",
        via: "whatsapp",
        status: "enviado",
        mensagem: texto
      });
    }

    return res.json({ message: "Cobranças automáticas enviadas." });

  } catch (e) {
    console.error("Erro na cobrança automática:", e);
    return res.status(500).json({ error: "Erro ao enviar cobranças automáticas." });
  }
}
