import PDFDocument from "pdfkit";
import fs from "fs";

export function gerarPDFHistorico(cliente: any, emprestimos: any[], parcelas: any[]) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const path = `./pdfs/historico-${cliente.id}.pdf`;
    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(20).text("Histórico do Cliente", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Nome: ${cliente.nome}`);
    doc.text(`Telefone: ${cliente.telefone}`);
    doc.text(`Email: ${cliente.email}`);
    doc.moveDown();

    doc.text("Empréstimos:");
    emprestimos.forEach((e) => {
      doc.text(`- Empréstimo: R$ ${e.valor_total} - Status: ${e.status}`);
    });

    doc.moveDown();
    doc.text("Parcelas:");
    parcelas.forEach((p) => {
      doc.text(
        `Parcela ${p.numero} | Valor: R$ ${p.valor_original} | Venc: ${p.vencimento} | Pago: ${p.pago}`
      );
    });

    doc.end();

    resolve(path);
  });
}
