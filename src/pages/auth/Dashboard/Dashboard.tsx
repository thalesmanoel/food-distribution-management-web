import { StatCard } from "../../../components/StatCard/StatCard";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import "./Dashboard.css";

export function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard-page">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <div>
            <span className="dashboard-eyebrow">Resumo operacional</span>
            <h1 id="dashboard-title">Bom dia, Thales</h1>
            <p>Aqui está o resumo do sistema hoje.</p>
          </div>

          <span className="dashboard-status">Sistema ativo</span>
        </section>

        <section className="stats-section" aria-label="Indicadores principais">
          <div className="stats-grid">
            <StatCard
              title="Total de Pedidos"
              value="1.240"
            />

            <StatCard
              title="Clientes Ativos"
              value="847"
            />

            <StatCard
              title="Produtos"
              value="356"
            />

            <StatCard
              title="Alertas"
              value="12"
            />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
