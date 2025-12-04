let sock: any;

// Define o cliente do WhatsApp (Baileys)
export function setWhatsAppClient(client: any) {
  sock = client;
  console.log("🔥 WhatsApp conectado ao backend!");
}

// Converte número para formato válido do WhatsApp
function formatarNumero(numero: string): string {
  numero = numero.replace(/\D/g, ""); // remove tudo que não é número

  // Se não tiver DDI, adiciona 55
  if (!numero.startsWith("55")) {
    numero = "55" + numero;
  }

  return numero + "@c.us";
}

// Enviar mensagem
export async function enviarMensagem(numero: string, texto: string) {
  try {
    if (!sock) {
      console.log("❌ WhatsApp não está inicializado!");
      return false;
    }

    const jid = formatarNumero(numero);

    console.log("📤 Enviando para:", jid);

    await sock.sendMessage(jid, { text: texto });

    console.log("✅ Mensagem enviada com sucesso!");

    return true;

  } catch (e) {
    console.error("🔥 ERRO AO ENVIAR MENSAGEM:", e);
    return false;
  }
}
