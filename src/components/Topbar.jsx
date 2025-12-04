import "./../styles/topbar.css";
import { useAuth } from "../authContext";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="topbar">
      <h2>Painel de Controle</h2>

      <button className="logout-btn" onClick={logout}>
        Sair
      </button>
    </header>
  );
}
