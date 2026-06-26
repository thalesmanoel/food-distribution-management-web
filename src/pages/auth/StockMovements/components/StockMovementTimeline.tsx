import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Clock,
  Database,
  LoaderCircle,
  Package,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import {
  stockMovementDirectionLabels,
  stockMovementOriginLabels,
  stockMovementTypeLabels,
} from "../types/stockMovement.constants";
import {
  StockMovementDirection,
  type StockMovement,
} from "../types/stockMovement.types";

interface Props {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
  selectedMovementId?: string;
  onSelectMovement: (movement: StockMovement) => void;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function getQuantityLabel(movement: StockMovement) {
  const signal = movement.direction === StockMovementDirection.IN ? "+" : "-";

  return `${signal}${movement.quantity} un.`;
}

export function StockMovementTimeline({
  movements,
  loading,
  error,
  selectedMovementId,
  onSelectMovement,
}: Props) {
  if (error) {
    return (
      <section className="stock-movement-timeline-panel" role="alert">
        <div className="stock-movement-state danger">
          <TriangleAlert size={24} strokeWidth={2.35} aria-hidden="true" />
          <strong>{error}</strong>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        className="stock-movement-timeline-panel"
        aria-busy="true"
        aria-label="Carregando movimentacoes"
      >
        <div className="stock-movement-section-heading">
          <div>
            <span className="stock-movement-section-kicker">Timeline</span>
            <h2>Eventos recentes</h2>
          </div>
          <LoaderCircle
            className="stock-movement-spin"
            size={20}
            strokeWidth={2.35}
            aria-hidden="true"
          />
        </div>

        <div className="stock-movement-skeleton-list">
          {["first", "second", "third"].map((item) => (
            <div className="stock-movement-skeleton-card" key={item} />
          ))}
        </div>
      </section>
    );
  }

  if (movements.length === 0) {
    return (
      <section className="stock-movement-timeline-panel">
        <div className="stock-movement-section-heading">
          <div>
            <span className="stock-movement-section-kicker">Timeline</span>
            <h2>Eventos recentes</h2>
          </div>
        </div>

        <div className="stock-movement-state">
          <Database size={24} strokeWidth={2.35} aria-hidden="true" />
          <strong>Nenhuma movimentacao encontrada.</strong>
        </div>
      </section>
    );
  }

  return (
    <section className="stock-movement-timeline-panel">
      <div className="stock-movement-section-heading">
        <div>
          <span className="stock-movement-section-kicker">Timeline</span>
          <h2>Eventos recentes</h2>
        </div>
        <span className="stock-movement-result-count">
          {movements.length} eventos
        </span>
      </div>

      <ol className="stock-movement-timeline" aria-label="Timeline operacional">
        {movements.map((movement) => {
          const isEntry = movement.direction === StockMovementDirection.IN;
          const DirectionIcon = isEntry ? ArrowDownToLine : ArrowUpFromLine;

          return (
            <li className={isEntry ? "entry" : "exit"} key={movement.id}>
              <span className="stock-movement-timeline-node" aria-hidden="true">
                <DirectionIcon size={18} strokeWidth={2.45} />
              </span>

              <button
                className={`stock-movement-event-card ${
                  selectedMovementId === movement.id ? "selected" : ""
                }`}
                type="button"
                onClick={() => onSelectMovement(movement)}
              >
                <div className="stock-movement-event-main">
                  <div>
                    <span className="stock-movement-event-product">
                      <Package size={17} strokeWidth={2.35} aria-hidden="true" />
                      {movement.product.name}
                    </span>
                    <strong>{movement.product.sku}</strong>
                  </div>

                  <span
                    className={`stock-movement-quantity ${
                      isEntry ? "entry" : "exit"
                    }`}
                  >
                    {getQuantityLabel(movement)}
                  </span>
                </div>

                <div className="stock-movement-event-badges">
                  <span className={`stock-movement-badge ${isEntry ? "entry" : "exit"}`}>
                    {stockMovementDirectionLabels[movement.direction]}
                  </span>
                  <span className="stock-movement-badge">
                    {stockMovementTypeLabels[movement.type]}
                  </span>
                  <span className="stock-movement-badge muted">
                    {stockMovementOriginLabels[movement.origin]}
                  </span>
                </div>

                <div className="stock-movement-balance">
                  <span>Estoque</span>
                  <strong>
                    {movement.previous_balance} -&gt; {movement.resulting_balance}
                  </strong>
                </div>

                <div className="stock-movement-event-meta">
                  <span>
                    <Clock size={15} strokeWidth={2.35} aria-hidden="true" />
                    {dateTimeFormatter.format(movement.occurred_at)}
                  </span>
                  <span>
                    <UserRound size={15} strokeWidth={2.35} aria-hidden="true" />
                    {movement.responsibleUser?.name ?? "Sem responsavel"}
                  </span>
                  {movement.order && (
                    <span>
                      <ClipboardList
                        size={15}
                        strokeWidth={2.35}
                        aria-hidden="true"
                      />
                      {movement.order.code}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
