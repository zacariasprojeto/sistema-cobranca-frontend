import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Swal from "sweetalert2";
import "../styles/tables.css";

export default function Historico() {
  const [clientes, setClientes] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");

  async function load() {
    try {
      const c = await api.get("/clientes");
      const e = await api.get("/emprestimos");
      const p = await api.get("/parcelas");

      setClientes(c.data);
      setEmprestimos(e.data);
      setParcelas(p.data);

    } catch (err) {
      Swal.fire("Erro", "Falha ao carregar histórico", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const emprestimosCliente = emprestimos.filter(
    (e) => e.cliente_id === clienteSelecionado
  );

  const parcelasCliente = parcelas.filter(
    (p) => emprestimosCliente.some((e) => e.id === p.emprestimo_id)
  );

  function gerarPDF() {
    if (!clienteSelecionado)
      return Swal.fire("Erro", "Selecione um cliente", "error");

    const url = `https://sistema-cobrancas-backend.onrender.com/pdf/${clienteSelecionado}`;
    window.open(url, "_blank");
  }

  function enviarWhatsapp() {
    const cli = clientes.find((c) => c.id === clienteSelecionado);
    if (!cli?.telefone)
      return Swal.fire("Erro", "Cliente não possui telefone cadastrado", "error");

    const totalDivida = parcelasCliente
      .filter((p) => p.status !== "pago")
      .reduce((t, p) => t + Number(p.valor), 0)
      .toFixed(2);

    const msg =
      `Olá ${cli.nome}, segue seu histórico financeiro:\n\n` +
      `Total pendente: R$ ${totalDivida}\n\n` +
      `Clique aqui para visualizar o PDF completo:\n` +
      `https://sistema-cobrancas-backend.onrender.com/pdf/${cli.id}`;

    window.open(`https://wa.me/55${cli.telefone}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <Topbar />

        <h2>Histórico do Cliente</h2>

        <select
          className="busca-input"
          value={clienteSelecionado}
          onChange={(e) => setClienteSelecionado(e.target.value)}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        {clienteSelecionado !== "" && (
          <>
            <button className="btn-editar" onClick={gerarPDF}>
              📄 Gerar PDF
            </button>

            <button className="btn-excluir" onClick={enviarWhatsapp}>
              💬 Enviar WhatsApp
            </button>

            <h3 style={{ marginTop: 20 }}>Empréstimos</h3>

            <table className="tabela-neon">
              <thead>
                <tr>
                  <th>Valor</th>
                  <th>Parcelas</th>
                  <th>Juros/Dia</th>
                  <th>Início</th>
                </tr>
              </thead>

              <tbody>
                {emprestimosCliente.map((e) => (
                  <tr key={e.id}>
                    <td>R$ {e.valor_total}</td>
                    <td>{e.qtd_parcelas}</td>
                    <td>{e.juros_dia}%</td>
                    <td>{e.data_inicio}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: 20 }}>Parcelas</h3>

            <table className="tabela-neon">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Vencimento</th>
                  <th>Pagamento</th>
                </tr>
              </thead>

              <tbody>
                {parcelasCliente.map((p) => (
                  <tr key={p.id}>
                    <td>{p.numero}</td>
                    <td>R$ {p.valor}</td>

                    <td
                      style={{
                        color:
                          p.status === "pago"
                            ? "#00ff88"
                            : p.status === "atrasado"
                            ? "red"
                            : "yellow"
                      }}
                    >
                      {p.status}
                    </td>

                    <td>{p.data_vencimento}</td>
                    <td>{p.data_pagamento || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
