import makeWASocket, { fetchLatestBaileysVersion, useMultiFileAuthState } from "baileys";
import { setWhatsAppClient } from "../services/whatsappService";

export async function startWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      printQRInTerminal: true,
      auth: state
    });

    // Salva credenciais
    sock.ev.on("creds.update", saveCreds);

    // Atualiza conexão
    sock.ev.on("connection.update", (update) => {
      if (update.connection === "open") {
        console.log("📲 WhatsApp conectado com sucesso!");

        // 🔥 AQUI É A MÁGICA:
        setWhatsAppClient(sock); 
        console.log("🔗 Cliente WhatsApp conectado ao backend!");
      }

      if (update.connection === "close") {
        console.log("❌ WhatsApp desconectado, tentando reconectar...");
        startWhatsApp();
      }
    });

    return sock;

  } catch (e) {
    console.error("Erro ao iniciar WhatsApp:", e);
  }
}
