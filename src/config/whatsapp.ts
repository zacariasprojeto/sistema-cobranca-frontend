import makeWASocket, { fetchLatestBaileysVersion, useMultiFileAuthState } from "baileys";

export async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("📲 WhatsApp conectado com sucesso!");
    }
    if (update.connection === "close") {
      console.log("❌ WhatsApp desconectado, tentando reconectar...");
      startWhatsApp();
    }
  });

  return sock;
}
