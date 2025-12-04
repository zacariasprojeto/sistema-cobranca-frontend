// src/pages/Dashboard.jsx
import './dashboard.css';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CardInfo from '../components/CardInfo';

export default function Dashboard() {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Topbar />

        <div className="cards">
          <CardInfo title="Clientes" value="128" />
          <CardInfo title="Empréstimos Ativos" value="37" />
          <CardInfo title="Parcelas Receber Hoje" value="12" />
          <CardInfo title="Atrasados" value="5" />
        </div>
      </div>
    </div>
  );
}
