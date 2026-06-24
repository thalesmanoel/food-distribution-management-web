import { StatCard } from "../../../components/StatCard/StatCard";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import "./Dashboard.css";
import { PackageCheck, ShoppingBag, TriangleAlert, Users } from "lucide-react";

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
              icon={ShoppingBag}
            />

            <StatCard
              title="Clientes Ativos"
              value="847"
              icon={Users}
            />

            <StatCard
              title="Produtos"
              value="356"
              icon={PackageCheck}
            />

            <StatCard
              title="Alertas"
              value="12"
              icon={TriangleAlert}
            />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
