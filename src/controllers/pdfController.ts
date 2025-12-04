import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { supabase } from "../config/supabase";

export async function gerarPDF(req: Request, res: Response) {
  const cliente_id = req.params.id;

  const cliente = await supabase.from("clientes").select("*").eq("id", cliente_id).single();
  const emprestimos = await supabase.from("emprestimos").select("*").eq("cliente_id", cliente_id);
  const parcelas = await supabase.from("parcelas").select("*");

  if (cliente.error) return res.status(400).json(cliente.error);

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Histórico Financeiro", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Cliente: ${cliente.data.nome}`);
  doc.text(`Telefone: ${cliente.data.telefone}`);

  doc.moveDown();
  doc.text("Empréstimos:");

  emprestimos.data.forEach((e) => {
    doc.moveDown();
    doc.text(`Valor: R$ ${e.valor_total}`);
    doc.text(`Parcelas: ${e.qtd_parcelas}`);
    doc.text(`Juros/dia: ${e.juros_dia}%`);
    doc.text(`Início: ${e.data_inicio}`);

    doc.moveDown();
    doc.text("Parcelas:");

    parcelas.data
      .filter((p) => p.emprestimo_id === e.id)
      .forEach((p) => {
        doc.text(`Parcela #${p.numero} | Valor: R$ ${p.valor} | Status: ${p.status}`);
      });
  });

  doc.end();
}
