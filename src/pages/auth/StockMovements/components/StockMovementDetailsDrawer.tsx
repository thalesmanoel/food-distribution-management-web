import { useEffect, type ReactNode } from "react";
import {
  ClipboardList,
  Clock,
  Database,
  FileText,
  Hash,
  Package,
  UserRound,
  X,
} from "lucide-react";
import {
  stockMovementDirectionLabels,
  stockMovementOriginLabels,
  stockMovementTypeLabels,
} from "../types/stockMovement.constants";
import type { StockMovement } from "../types/stockMovement.types";

interface Props {
  movement: StockMovement | null;
  productHistory: StockMovement[];
  onClose: () => void;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
});

function formatDate(value?: Date | null) {
  return value ? dateTimeFormatter.format(value) : "-";
}

function formatValue(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "-" : value;
}

function formatMetadata(metadata?: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return "-";
  }

  return JSON.stringify(metadata, null, 2);
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="stock-movement-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function StockMovementDetailsDrawer({
  movement,
  productHistory,
  onClose,
}: Props) {
  useEffect(() => {
    if (!movement) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movement, onClose]);

  if (!movement) {
    return null;
  }

  return (
    <div
      className="stock-movement-drawer-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="stock-movement-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-movement-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="stock-movement-drawer-header">
          <div>
            <span className="stock-movement-drawer-kicker">Detalhes</span>
            <h2 id="stock-movement-drawer-title">{movement.product.name}</h2>
            <p>{movement.product.sku}</p>
          </div>

          <button
            className="stock-movement-icon-button"
            type="button"
            title="Fechar detalhes"
            aria-label="Fechar detalhes"
            onClick={onClose}
          >
            <X size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </header>

        <div className="stock-movement-drawer-body">
          <section className="stock-movement-detail-section">
            <h3>
              <Package size={17} strokeWidth={2.35} aria-hidden="true" />
              Movimento
            </h3>
            <DetailRow label="product" value={movement.product.name} />
            <DetailRow label="product_id" value={movement.product_id} />
            <DetailRow label="quantity" value={movement.quantity} />
            <DetailRow
              label="type"
              value={`${movement.type} (${stockMovementTypeLabels[movement.type]})`}
            />
            <DetailRow
              label="direction"
              value={`${movement.direction} (${
                stockMovementDirectionLabels[movement.direction]
              })`}
            />
            <DetailRow
              label="origin"
              value={`${movement.origin} (${
                stockMovementOriginLabels[movement.origin]
              })`}
            />
            <DetailRow
              label="previous_balance"
              value={movement.previous_balance}
            />
            <DetailRow
              label="resulting_balance"
              value={movement.resulting_balance}
            />
            <DetailRow label="occurred_at" value={formatDate(movement.occurred_at)} />
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <ClipboardList size={17} strokeWidth={2.35} aria-hidden="true" />
              Pedido relacionado
            </h3>
            <DetailRow label="order" value={movement.order?.code ?? "-"} />
            <DetailRow label="order_id" value={formatValue(movement.order_id)} />
            <DetailRow
              label="customer_name"
              value={formatValue(movement.order?.customer_name)}
            />
            <DetailRow label="status" value={formatValue(movement.order?.status)} />
            <DetailRow
              label="orderItem"
              value={movement.orderItem ? movement.orderItem.id : "-"}
            />
            <DetailRow
              label="order_item_id"
              value={formatValue(movement.order_item_id)}
            />
            <DetailRow
              label="orderItem.quantity"
              value={formatValue(movement.orderItem?.quantity)}
            />
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <UserRound size={17} strokeWidth={2.35} aria-hidden="true" />
              Responsavel
            </h3>
            <DetailRow
              label="responsibleUser"
              value={movement.responsibleUser?.name ?? "-"}
            />
            <DetailRow
              label="responsible_user_id"
              value={formatValue(movement.responsible_user_id)}
            />
            <DetailRow
              label="email"
              value={formatValue(movement.responsibleUser?.email)}
            />
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <FileText size={17} strokeWidth={2.35} aria-hidden="true" />
              Observacoes
            </h3>
            <DetailRow
              label="source_reference_id"
              value={formatValue(movement.source_reference_id)}
            />
            <DetailRow
              label="operation_key"
              value={formatValue(movement.operation_key)}
            />
            <DetailRow label="notes" value={formatValue(movement.notes)} />
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <Database size={17} strokeWidth={2.35} aria-hidden="true" />
              Metadata
            </h3>
            <pre className="stock-movement-metadata">
              {formatMetadata(movement.metadata)}
            </pre>
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <Hash size={17} strokeWidth={2.35} aria-hidden="true" />
              IDs tecnicos
            </h3>
            <DetailRow label="id" value={movement.id} />
            <DetailRow label="created_at" value={formatDate(movement.created_at)} />
            <DetailRow label="updated_at" value={formatDate(movement.updated_at)} />
            <DetailRow label="deleted_at" value={formatDate(movement.deleted_at)} />
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <Clock size={17} strokeWidth={2.35} aria-hidden="true" />
              Historico do saldo
            </h3>
            <div className="stock-movement-drawer-balance">
              <span>{movement.previous_balance}</span>
              <strong>-&gt;</strong>
              <span>{movement.resulting_balance}</span>
            </div>
          </section>

          <section className="stock-movement-detail-section">
            <h3>
              <Clock size={17} strokeWidth={2.35} aria-hidden="true" />
              Historico do produto
            </h3>
            <ol className="stock-movement-product-history">
              {productHistory.map((historyItem) => (
                <li key={historyItem.id}>
                  <span>{formatDate(historyItem.occurred_at)}</span>
                  <strong>
                    {historyItem.previous_balance} -&gt;{" "}
                    {historyItem.resulting_balance}
                  </strong>
                  <small>
                    {stockMovementTypeLabels[historyItem.type]} de{" "}
                    {historyItem.quantity} un.
                  </small>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  );
}
