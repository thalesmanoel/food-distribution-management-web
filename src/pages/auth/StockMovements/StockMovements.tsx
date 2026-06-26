import { useMemo, useState } from "react";
import { Activity, Download, RefreshCw } from "lucide-react";
import { Button } from "../../../components/Button/Button";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import { StockMovementDetailsDrawer } from "./components/StockMovementDetailsDrawer";
import { StockMovementFilters } from "./components/StockMovementFilters";
import { StockMovementSummaryCards } from "./components/StockMovementSummaryCards";
import { StockMovementTimeline } from "./components/StockMovementTimeline";
import { useStockMovements } from "./hooks/useStockMovements";
import type { StockMovement } from "./types/stockMovement.types";
import "./StockMovements.css";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function StockMovements() {
  const {
    filters,
    movements,
    summary,
    loading,
    error,
    lastUpdatedAt,
    updateFilter,
    resetFilters,
    refresh,
  } = useStockMovements();
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedMovement = useMemo<StockMovement | null>(() => {
    if (!selectedMovementId) {
      return null;
    }

    return (
      movements.find((movement) => movement.id === selectedMovementId) ?? null
    );
  }, [movements, selectedMovementId]);

  const selectedProductHistory = useMemo(() => {
    if (!selectedMovement) {
      return [];
    }

    return movements.filter(
      (movement) => movement.product_id === selectedMovement.product_id
    );
  }, [movements, selectedMovement]);

  function handleRefresh() {
    setActionMessage(null);
    refresh();
  }

  function handleExport() {
    if (movements.length === 0) {
      setActionMessage("Nao ha movimentacoes para exportar.");
      return;
    }

    const filename = `stock-movements-${new Date().toISOString().slice(0, 10)}.json`;
    downloadJson(filename, movements);
    setActionMessage(`${movements.length} movimentacoes exportadas.`);
  }

  function handleFilterChange<TKey extends keyof typeof filters>(
    key: TKey,
    value: (typeof filters)[TKey]
  ) {
    setActionMessage(null);
    updateFilter(key, value);
  }

  function handleResetFilters() {
    setActionMessage(null);
    resetFilters();
  }

  const lastUpdatedLabel = lastUpdatedAt
    ? dateTimeFormatter.format(lastUpdatedAt)
    : "Aguardando carga";
  const feedbackMessage =
    actionMessage ??
    (loading
      ? "Atualizando movimentacoes..."
      : error ?? `${movements.length} eventos sincronizados.`);

  return (
    <MainLayout>
      <div className="stock-movements-page">
        <section
          className="stock-movements-hero"
          aria-labelledby="stock-movements-title"
        >
          <div className="stock-movements-title-block">
            <nav className="stock-movements-breadcrumb" aria-label="Breadcrumb">
              <span>Operacao</span>
              <span>Estoque</span>
              <strong>Movimentacoes</strong>
            </nav>

            <span className="stock-movements-eyebrow">
              <Activity size={15} strokeWidth={2.35} aria-hidden="true" />
              Centro operacional
            </span>
            <h1 id="stock-movements-title">Movimentacoes de estoque</h1>
            <p>
              Rastreie entradas, saidas, reservas, ajustes e cancelamentos com
              impacto direto no saldo dos produtos.
            </p>
          </div>

          <div className="stock-movements-actions" aria-label="Acoes da tela">
            <button
              className="stock-movement-icon-button"
              type="button"
              title="Atualizar dados"
              aria-label="Atualizar dados"
              disabled={loading}
              onClick={handleRefresh}
            >
              <RefreshCw
                className={loading ? "stock-movement-spin" : undefined}
                size={18}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </button>

            <Button type="button" disabled={loading} onClick={handleExport}>
              <Download size={18} strokeWidth={2.45} aria-hidden="true" />
              Exportar
            </Button>
          </div>
        </section>

        <div className="stock-movements-feedback" role="status">
          <span>{feedbackMessage}</span>
          <strong>Ultima atualizacao: {lastUpdatedLabel}</strong>
        </div>

        <StockMovementSummaryCards summary={summary} loading={loading} />

        <StockMovementFilters
          filters={filters}
          loading={loading}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <StockMovementTimeline
          movements={movements}
          loading={loading}
          error={error}
          selectedMovementId={selectedMovementId ?? undefined}
          onSelectMovement={(movement) => setSelectedMovementId(movement.id)}
        />

        <StockMovementDetailsDrawer
          movement={selectedMovement}
          productHistory={selectedProductHistory}
          onClose={() => setSelectedMovementId(null)}
        />
      </div>
    </MainLayout>
  );
}
