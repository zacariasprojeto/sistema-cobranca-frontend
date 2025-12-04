let sock: any;

export function setWhatsAppClient(client: any) {
  sock = client;
}

export async function enviarMensagem(numero: string, texto: string) {
  if (!sock) return;

  const jid = numero.replace(/\D/g, "") + "@s.whatsapp.net";
  await sock.sendMessage(jid, { text: texto });

  return true;
}
