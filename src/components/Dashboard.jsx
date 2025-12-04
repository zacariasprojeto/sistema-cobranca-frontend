import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CardInfo from "../components/CardInfo";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <Topbar />

        <div className="cards">
          <CardInfo title="Total de Clientes" value="--" />
          <CardInfo title="Empréstimos Ativos" value="--" />
          <CardInfo title="Parcelas Hoje" value="--" />
          <CardInfo title="Atrasos" value="--" />
        </div>
      </div>
    </div>
  );
}
