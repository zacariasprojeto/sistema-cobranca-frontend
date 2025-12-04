import "./../styles/sidebar.css";
import { FaHome, FaUsers, FaMoneyBill, FaList, FaClock, FaCog } from "react-icons/fa";
import { useAuth } from "../authContext";

export default function Sidebar() {
  const { user } = useAuth();

  // Ler permissões do Supabase
  const isAdmin =
    user?.user_metadata?.role === "admin" ||
    user?.user_metadata?.permissoes?.admin === true;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">💸 Cobranças</div>

      <nav>
        <a href="/dashboard"><FaHome /> Dashboard</a>
        <a href="/clientes"><FaUsers /> Clientes</a>
        <a href="/emprestimos"><FaMoneyBill /> Empréstimos</a>
        <a href="/parcelas"><FaList /> Parcelas</a>
        <a href="/atrasados"><FaClock /> Atrasados</a>

        {/* 🔥 SOMENTE ADMIN ENXERGA ISSO */}
        {isAdmin && (
          <a href="/usuarios"><FaCog /> Usuários</a>
        )}
      </nav>
    </aside>
  );
}
