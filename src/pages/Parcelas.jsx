import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import "../styles/tables.css";
import "../styles/forms.css";

export default function Parcelas() {
  const [parcelas, setParcelas] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [parcelasFiltradas, setParcelasFiltradas] = useState([]);

  const [selectEmprestimo, setSelectEmprestimo] = useState("");

  // CARREGAR LISTA
  async function load() {
    try {
      const p = await api.get("/parcelas");
      const e = await api.get("/emprestimos");

      setParcelas(p.data);
      setEmprestimos(e.data);
    } catch {
      Swal.fire("Erro", "Falha ao carregar parcelas", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // FILTRAR POR EMPRÉSTIMO
  useEffect(() => {
    if (!selectEmprestimo) {
      setParcelasFiltradas(parcelas);
      return;
    }

    setParcelasFiltradas(
      parcelas.filter((p) => p.emprestimo_id === selectEmprestimo)
    );
  }, [selectEmprestimo, parcelas]);


  // MARCAR COMO PAGO
  async function marcarPago(parcela) {
    Swal.fire({
      title: "Confirmar pagamento?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00ff88",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, confirmar"
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await api.put(`/parcelas/${parcela.id}`, {
            ...parcela,
            status: "pago",
            valor_pago: parcela.valor,
            data_pagamento: new Date().toISOString().split("T")[0],
            dias_atraso: 0
          });

          Swal.fire("OK!", "Pagamento registrado", "success");
          load();

        } catch (err) {
          Swal.fire("Erro", "Não foi possível atualizar", "error");
        }
      }
    });
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <Topbar />

        <h2>Parcelas</h2>

        <select
          className="busca-input"
          value={selectEmprestimo}
          onChange={(e) => setSelectEmprestimo(e.target.value)}
        >
          <option value="">TODOS os empréstimos</option>

          {emprestimos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id} — {e.valor_total}R$
            </option>
          ))}
        </select>

        <table className="tabela-neon">
          <thead>
            <tr>
              <th>#</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Atraso</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {parcelasFiltradas.map((p) => (
              <tr key={p.id}>
                <td>{p.numero}</td>
                <td>R$ {p.valor}</td>
                <td>{p.data_vencimento}</td>
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

                <td>{p.dias_atraso}</td>

                <td>
                  {p.status !== "pago" && (
                    <button
                      className="btn-editar"
                      onClick={() => marcarPago(p)}
                    >
                      Marcar pago
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
