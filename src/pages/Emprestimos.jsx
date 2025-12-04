import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import "../styles/tables.css";
import "../styles/forms.css";

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    valor_total: "",
    qtd_parcelas: "",
    juros_dia: "",
    data_inicio: "",
  });

  // 🔥 Carregar dados
  async function carregarEmprestimos() {
    try {
      const res = await api.get("/emprestimos");
      setEmprestimos(res.data);
    } catch {
      Swal.fire("Erro", "Falha ao carregar empréstimos", "error");
    }
  }

  async function carregarClientes() {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch {
      Swal.fire("Erro", "Não foi possível carregar clientes", "error");
    }
  }

  useEffect(() => {
    carregarClientes();
    carregarEmprestimos();
  }, []);

  // 🔥 Abrir modal para novo empréstimo
  function novoEmprestimo() {
    setEditando(null);
    setForm({
      cliente_id: "",
      valor_total: "",
      qtd_parcelas: "",
      juros_dia: "",
      data_inicio: "",
    });
    setModalOpen(true);
  }

  // 🔥 Editar empréstimo
  function editarEmprestimo(item) {
    setEditando(item.id);
    setForm({
      cliente_id: item.cliente_id,
      valor_total: item.valor_total,
      qtd_parcelas: item.qtd_parcelas,
      juros_dia: item.juros_dia,
      data_inicio: item.data_inicio,
    });
    setModalOpen(true);
  }

  // 🔥 Salvar empréstimo
  async function salvar() {
    try {
      if (!form.cliente_id) return Swal.fire("Erro", "Selecione um cliente", "error");

      if (editando) {
        await api.put(`/emprestimos/${editando}`, form);
        Swal.fire("Atualizado", "Empréstimo atualizado com sucesso", "success");
      } else {
        await api.post("/emprestimos", form);
        Swal.fire("Criado", "Empréstimo criado com sucesso!", "success");
      }

      setModalOpen(false);
      carregarEmprestimos();
    } catch (err) {
      Swal.fire("Erro", "Falha ao salvar empréstimo", "error");
    }
  }

  // 🔥 Excluir
  async function excluirEmprestimo(id) {
    Swal.fire({
      title: "Excluir empréstimo?",
      text: "Isto remove todas as parcelas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff88",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir"
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(`/emprestimos/${id}`);
        carregarEmprestimos();
        Swal.fire("Excluído!", "O empréstimo foi removido.", "success");
      }
    });
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Topbar />

        <div className="header-page">
          <h2>Empréstimos</h2>
          <button className="btn-add" onClick={novoEmprestimo}>+ Novo Empréstimo</button>
        </div>

        <table className="tabela-neon">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Valor Total</th>
              <th>Parcelas</th>
              <th>Juros/Dia</th>
              <th>Data Início</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {emprestimos.map((e) => (
              <tr key={e.id}>
                <td>{clientes.find(c => c.id === e.cliente_id)?.nome}</td>
                <td>R$ {e.valor_total}</td>
                <td>{e.qtd_parcelas}</td>
                <td>{e.juros_dia}%</td>
                <td>{e.data_inicio}</td>

                <td>
                  <button className="btn-editar" onClick={() => editarEmprestimo(e)}>Editar</button>
                  <button className="btn-excluir" onClick={() => excluirEmprestimo(e.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h3 className="modal-title">{editando ? "Editar Empréstimo" : "Novo Empréstimo"}</h3>

          <select
            value={form.cliente_id}
            onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <input
            placeholder="Valor total"
            type="number"
            value={form.valor_total}
            onChange={(e) => setForm({ ...form, valor_total: e.target.value })}
          />

          <input
            placeholder="Quantidade de parcelas"
            type="number"
            value={form.qtd_parcelas}
            onChange={(e) => setForm({ ...form, qtd_parcelas: e.target.value })}
          />

          <input
            placeholder="Juros por dia (%)"
            type="number"
            value={form.juros_dia}
            onChange={(e) => setForm({ ...form, juros_dia: e.target.value })}
          />

          <input
            placeholder="Data de início"
            type="date"
            value={form.data_inicio}
            onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
          />

          <button className="btn-salvar" onClick={salvar}>Salvar</button>
        </Modal>

      </div>
    </div>
  );
}
