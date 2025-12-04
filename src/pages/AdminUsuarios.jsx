import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { api } from "../api";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import "../styles/tables.css";
import "../styles/forms.css";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    email: "",
    senha: "",
    nome: "",
    telefone: "",
    role: "user",
    permissoes: {
      ver_clientes: true,
      editar_dados: true,
      ver_parcelas: true,
      admin: false
    }
  });

  async function load() {
    try {
      const res = await api.get("/auth/users");
      setUsuarios(res.data);
    } catch {
      Swal.fire("Erro", "Falha ao carregar usuários", "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function novoUsuario() {
    setEditando(null);
    setForm({
      email: "",
      senha: "",
      nome: "",
      telefone: "",
      role: "user",
      permissoes: {
        ver_clientes: true,
        editar_dados: true,
        ver_parcelas: true,
        admin: false
      }
    });
    setModalOpen(true);
  }

  function editarUsuario(u) {
    setEditando(u.id);
    setForm({
      email: u.email,
      senha: "",
      nome: u.user_metadata?.nome || "",
      telefone: u.user_metadata?.telefone || "",
      role: u.user_metadata?.role || "user",
      permissoes: u.user_metadata?.permissoes || {}
    });
    setModalOpen(true);
  }

  async function salvarUsuario() {
    try {
      if (editando) {
        await api.put(`/auth/users/${editando}`, form);
        Swal.fire("OK", "Usuário atualizado!", "success");
      } else {
        await api.post("/auth/register", form);
        Swal.fire("OK", "Usuário criado!", "success");
      }

      setModalOpen(false);
      load();
    } catch {
      Swal.fire("Erro", "Falha ao salvar usuário", "error");
    }
  }

  async function excluirUsuario(id) {
    Swal.fire({
      title: "Excluir usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff88",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.delete(`/auth/users/${id}`);
          Swal.fire("OK", "Usuário removido", "success");
          load();
        } catch {
          Swal.fire("Erro", "Falha ao excluir usuário", "error");
        }
      }
    });
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <Topbar />

        <div className="header-page">
          <h2>Administração de Usuários</h2>
          <button className="btn-add" onClick={novoUsuario}>+ Novo Usuário</button>
        </div>

        <table className="tabela-neon">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Role</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.user_metadata?.nome}</td>
                <td>{u.user_metadata?.telefone}</td>
                <td>{u.user_metadata?.role}</td>

                <td>
                  <button className="btn-editar" onClick={() => editarUsuario(u)}>
                    Editar
                  </button>

                  <button className="btn-excluir" onClick={() => excluirUsuario(u.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h3>{editando ? "Editar Usuário" : "Novo Usuário"}</h3>

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {!editando && (
            <input
              placeholder="Senha"
              type="password"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
            />
          )}

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

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>

          <h4>Permissões:</h4>

          {Object.keys(form.permissoes).map((key) => (
            <label key={key} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="checkbox"
                checked={form.permissoes[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    permissoes: {
                      ...form.permissoes,
                      [key]: e.target.checked
                    }
                  })
                }
              />
              &nbsp; {key}
            </label>
          ))}

          <button className="btn-salvar" onClick={salvarUsuario}>
            Salvar
          </button>
        </Modal>
      </div>
    </div>
  );
}
