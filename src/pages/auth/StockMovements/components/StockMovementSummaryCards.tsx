import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardCheck,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import type { StockMovementSummary } from "../types/stockMovement.types";

interface SummaryCardConfig {
  title: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone: "neutral" | "entry" | "exit" | "inventory" | "warning" | "danger";
}

interface Props {
  summary: StockMovementSummary;
  loading: boolean;
}

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function StockMovementSummaryCards({ summary, loading }: Props) {
  const cards: SummaryCardConfig[] = [
    {
      title: "Movimentacoes do dia",
      value: summary.movementsToday,
      detail: "eventos operacionais",
      icon: Activity,
      tone: "neutral",
    },
    {
      title: "Total de entradas",
      value: summary.totalEntries,
      detail: "unidades adicionadas",
      icon: ArrowDownToLine,
      tone: "entry",
    },
    {
      title: "Total de saidas",
      value: summary.totalExits,
      detail: "unidades removidas",
      icon: ArrowUpFromLine,
      tone: "exit",
    },
    {
      title: "Produtos impactados",
      value: summary.impactedProducts,
      detail: "SKUs com historico",
      icon: Boxes,
      tone: "inventory",
    },
    {
      title: "Ajustes realizados",
      value: summary.adjustments,
      detail: "ajustes e inventario",
      icon: SlidersHorizontal,
      tone: "warning",
    },
    {
      title: "Reservas",
      value: summary.reservations,
      detail: "itens comprometidos",
      icon: ClipboardCheck,
      tone: "neutral",
    },
    {
      title: "Cancelamentos",
      value: summary.cancellations,
      detail: "saldos restaurados",
      icon: RotateCcw,
      tone: "danger",
    },
  ];

  return (
    <section
      className="stock-movements-summary"
      aria-busy={loading}
      aria-label="Indicadores de movimentacoes"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className={`stock-movement-summary-card ${card.tone}`}
            key={card.title}
          >
            <div className="stock-movement-summary-card-top">
              <span>{card.title}</span>
              <span className="stock-movement-summary-card-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={2.35} />
              </span>
            </div>

            <strong>{loading ? "..." : numberFormatter.format(card.value)}</strong>
            <small>{card.detail}</small>
          </article>
        );
      })}
    </section>
  );
}
