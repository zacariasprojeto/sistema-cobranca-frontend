import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { enviarMensagem } from "../services/whatsappService";

export async function cobrancaManual(req: any, res: Response) {
  const cliente_id = req.params.cliente_id;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", cliente_id)
    .single();

  if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

  const texto = `Olá ${cliente.nome}, você possui parcelas em atraso. Por favor regularize sua situação.`;

  await enviarMensagem(cliente.telefone, texto);

  await supabase.from("historico_envios").insert({
    cliente_id,
    tipo: "cobranca",
    via: "whatsapp",
    status: "enviado",
    mensagem: texto
  });

  res.json({ message: "Cobrança enviada via WhatsApp." });
}

export async function cobrancaAutomatica(req: Request, res: Response) {

  const { data: parcelas } = await supabase
    .from("parcelas")
    .select("*, clientes(*), emprestimos(*)")
    .lt("vencimento", new Date().toISOString())
    .eq("pago", false);

  if (!parcelas) return res.json({ message: "Nenhuma cobrança encontrada." });

  for (const p of parcelas) {
    const texto = `
⚠️ ATENÇÃO, ${p.clientes.nome}

Sua parcela número ${p.numero} está em atraso.

Valor original: R$ ${p.valor_original}
Atraso: ${p.atraso_dias} dias
Valor com juros: R$ ${p.valor_com_juros}

Por favor regularize o pagamento.
`;

    await enviarMensagem(p.clientes.telefone, texto);

    await supabase.from("historico_envios").insert({
      cliente_id: p.cliente_id,
      parcela_id: p.id,
      tipo: "cobranca_automatica",
      via: "whatsapp",
      status: "enviado",
      mensagem: texto
    });
  }

  res.json({ message: "Cobranças automáticas enviadas." });
}
