import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Swal from "sweetalert2";
import "../styles/tables.css";

export default function Atrasados() {
  const [parcelas, setParcelas] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [clientes, setClientes] = useState([]);

  async function load() {
    try {
      const p = await api.get("/parcelas");
      const e = await api.get("/emprestimos");
      const c = await api.get("/clientes");

      setParcelas(p.data);
      setEmprestimos(e.data);
      setClientes(c.data);

    } catch (err) {
      Swal.fire("Erro", "Falha ao carregar atrasados", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Função para calcular os atrasos
  function calcularAtrasos() {
    const hoje = new Date();

    return parcelas
      .filter((p) => p.status !== "pago")
      .map((p) => {
        const venc = new Date(p.data_vencimento);
        let diasAtraso = Math.floor((hoje - venc) / (1000 * 60 * 60 * 24));

        if (diasAtraso < 0) diasAtraso = 0;

        // juros do empréstimo
        const emp = emprestimos.find((e) => e.id === p.emprestimo_id);
        const juros = emp?.juros_dia || 0;

        const valorJuros = (p.valor * juros / 100) * diasAtraso;
        const total = p.valor + valorJuros;

        return {
          ...p,
          nome_cliente: clientes.find(c => c.id === emp?.cliente_id)?.nome,
          valor_com_juros: total.toFixed(2),
          dias_atraso: diasAtraso,
          juros_dia: juros
        };
      })
      .filter((p) => p.dias_atraso > 0);
  }

  const atrasados = calcularAtrasos();

  // Registrar pagamento
  async function marcarPago(parcela) {
    Swal.fire({
      title: "Confirmar pagamento?",
      text: `Total: R$ ${parcela.valor_com_juros}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00ff88",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, confirmar"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.put(`/parcelas/${parcela.id}`, {
            status: "pago",
            valor_pago: parcela.valor_com_juros,
            data_pagamento: new Date().toISOString().split("T")[0],
            dias_atraso: 0
          });

          Swal.fire("OK!", "Pagamento registrado com sucesso", "success");
          load();

        } catch {
          Swal.fire("Erro", "Falha ao registrar pagamento", "error");
        }
      }
    });
  }

  // WHATSAPP 🔥
  function enviarWhatsapp(parcela) {
    const msg =
      `Olá ${parcela.nome_cliente},\n\n` +
      `Você possui uma parcela atrasada.\n\n` +
      `Valor original: R$ ${parcela.valor}\n` +
      `Dias de atraso: ${parcela.dias_atraso}\n` +
      `Juros ao dia: ${parcela.juros_dia}%\n` +
      `Total atualizado: R$ ${parcela.valor_com_juros}\n\n` +
      `Por favor realize o pagamento o quanto antes.`;

    const telefone = clientes.find(c => c.id === emprestimos.find(e => e.id === parcela.emprestimo_id)?.cliente_id)?.telefone;

    window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <Topbar />

        <h2>Parcelas Atrasadas</h2>

        <table className="tabela-neon">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Juros/dia</th>
              <th>Dias atraso</th>
              <th>Total Atualizado</th>
              <th>Vencimento</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {atrasados.map((p) => (
              <tr key={p.id}>
                <td>{p.nome_cliente}</td>
                <td>R$ {p.valor}</td>
                <td>{p.juros_dia}%</td>
                <td style={{ color: "red" }}>{p.dias_atraso}</td>
                <td style={{ color: "#00ff88" }}>R$ {p.valor_com_juros}</td>
                <td>{p.data_vencimento}</td>

                <td>
                  <button className="btn-editar" onClick={() => enviarWhatsapp(p)}>
                    Enviar cobrança
                  </button>

                  <button className="btn-excluir" onClick={() => marcarPago(p)}>
                    Marcar pago
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
