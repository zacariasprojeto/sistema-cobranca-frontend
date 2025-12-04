import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Swal from "sweetalert2";
import "../styles/tables.css";
import "../styles/forms.css";
import Modal from "../components/Modal";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    endereco: ""
  });

  // 🔥 Carrega clientes ao abrir
  async function carregarClientes() {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (error) {
      Swal.fire("Erro", "Falha ao carregar clientes", "error");
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // 🔥 Abrir modal para novo cliente
  function novoCliente() {
    setEditando(null);
    setForm({ nome: "", telefone: "", cpf: "", endereco: "" });
    setModalOpen(true);
  }

  // 🔥 Abrir modal para editar
  function editarCliente(cliente) {
    setEditando(cliente.id);
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      endereco: cliente.endereco,
    });
    setModalOpen(true);
  }

  // 🔥 Salvar (cadastro ou edição)
  async function salvarCliente() {
    try {
      if (editando) {
        await api.put(`/clientes/${editando}`, form);
        Swal.fire("Sucesso", "Cliente atualizado!", "success");
      } else {
        await api.post("/clientes", form);
        Swal.fire("Sucesso", "Cliente cadastrado!", "success");
      }

      setModalOpen(false);
      carregarClientes();

    } catch (error) {
      Swal.fire("Erro", "Falha ao salvar cliente", "error");
    }
  }

  // 🔥 Excluir cliente
  async function excluirCliente(id) {
    Swal.fire({
      title: "Excluir cliente?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff88",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/clientes/${id}`);
          Swal.fire("Excluído!", "Cliente removido.", "success");
          carregarClientes();
        } catch {
          Swal.fire("Erro", "Não foi possível excluir", "error");
        }
      }
    });
  }

  // 🔎 Filtrar clientes
  const listaFiltrada = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Topbar />

        <div className="header-page">
          <h2>Clientes</h2>
          <button className="btn-add" onClick={novoCliente}>+ Novo Cliente</button>
        </div>

        <input
          className="busca-input"
          placeholder="Buscar cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <table className="tabela-neon">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {listaFiltrada.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.telefone}</td>
                <td>{c.cpf}</td>
                <td>{c.endereco}</td>
                <td>
                  <button className="btn-editar" onClick={() => editarCliente(c)}>Editar</button>
                  <button className="btn-excluir" onClick={() => excluirCliente(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h3 className="modal-title">{editando ? "Editar Cliente" : "Novo Cliente"}</h3>

          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />

          <input
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />

          <input
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />

          <button className="btn-salvar" onClick={salvarCliente}>
            Salvar
          </button>
        </Modal>

      </div>
    </div>
  );
}
