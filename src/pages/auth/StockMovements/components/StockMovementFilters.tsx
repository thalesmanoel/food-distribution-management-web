import {
  CalendarDays,
  ClipboardList,
  Filter,
  Package,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  stockMovementDirectionOptions,
  stockMovementOriginOptions,
  stockMovementTypeOptions,
} from "../types/stockMovement.constants";
import type { StockMovementFilterState } from "../types/stockMovement.types";

interface Props {
  filters: StockMovementFilterState;
  loading: boolean;
  onFilterChange: <TKey extends keyof StockMovementFilterState>(
    key: TKey,
    value: StockMovementFilterState[TKey]
  ) => void;
  onResetFilters: () => void;
}

export function StockMovementFilters({
  filters,
  loading,
  onFilterChange,
  onResetFilters,
}: Props) {
  return (
    <section className="stock-movement-filters" aria-label="Filtros">
      <div className="stock-movement-section-heading">
        <div>
          <span className="stock-movement-section-kicker">Filtros</span>
          <h2>Consulta operacional</h2>
        </div>

        <button
          className="stock-movement-icon-button"
          type="button"
          title="Limpar filtros"
          aria-label="Limpar filtros"
          disabled={loading}
          onClick={onResetFilters}
        >
          <X size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <div className="stock-movement-filter-grid">
        <label className="stock-movement-field">
          <span>Produto</span>
          <div className="stock-movement-input-shell">
            <Package size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              type="search"
              value={filters.product_id}
              placeholder="ID, SKU ou nome"
              disabled={loading}
              onChange={(event) => onFilterChange("product_id", event.target.value)}
            />
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Responsavel</span>
          <div className="stock-movement-input-shell">
            <UserRound size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              type="search"
              value={filters.responsible_user_id}
              placeholder="ID, nome ou e-mail"
              disabled={loading}
              onChange={(event) =>
                onFilterChange("responsible_user_id", event.target.value)
              }
            />
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Pedido</span>
          <div className="stock-movement-input-shell">
            <ClipboardList size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              type="search"
              value={filters.order_id}
              placeholder="ID ou codigo"
              disabled={loading}
              onChange={(event) => onFilterChange("order_id", event.target.value)}
            />
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Tipo</span>
          <div className="stock-movement-select-shell">
            <Filter size={17} strokeWidth={2.35} aria-hidden="true" />
            <select
              value={filters.type}
              disabled={loading}
              onChange={(event) =>
                onFilterChange(
                  "type",
                  event.target.value as StockMovementFilterState["type"]
                )
              }
            >
              <option value="">Todos</option>
              {stockMovementTypeOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Origem</span>
          <div className="stock-movement-select-shell">
            <Search size={17} strokeWidth={2.35} aria-hidden="true" />
            <select
              value={filters.origin}
              disabled={loading}
              onChange={(event) =>
                onFilterChange(
                  "origin",
                  event.target.value as StockMovementFilterState["origin"]
                )
              }
            >
              <option value="">Todas</option>
              {stockMovementOriginOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Entrada/Saida</span>
          <div className="stock-movement-select-shell">
            <Filter size={17} strokeWidth={2.35} aria-hidden="true" />
            <select
              value={filters.direction}
              disabled={loading}
              onChange={(event) =>
                onFilterChange(
                  "direction",
                  event.target.value as StockMovementFilterState["direction"]
                )
              }
            >
              <option value="">Todas</option>
              {stockMovementDirectionOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Inicio</span>
          <div className="stock-movement-input-shell">
            <CalendarDays size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              type="date"
              value={filters.period_start}
              disabled={loading}
              onChange={(event) => onFilterChange("period_start", event.target.value)}
            />
          </div>
        </label>

        <label className="stock-movement-field">
          <span>Fim</span>
          <div className="stock-movement-input-shell">
            <CalendarDays size={17} strokeWidth={2.35} aria-hidden="true" />
            <input
              type="date"
              value={filters.period_end}
              disabled={loading}
              onChange={(event) => onFilterChange("period_end", event.target.value)}
            />
          </div>
        </label>
      </div>
    </section>
  );
}
