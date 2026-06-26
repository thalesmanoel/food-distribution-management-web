import { useCallback, useEffect, useMemo, useState } from "react";
import { stockMovementService } from "../services/stockMovementService";
import { mapStockMovementDTOToModel } from "../services/stockMovementService";
import {
  StockMovementType,
  type StockMovement,
  type StockMovementFilterState,
  type StockMovementListParamsDTO,
  type StockMovementSummary,
} from "../types/stockMovement.types";

export const initialStockMovementFilters: StockMovementFilterState = {
  product_id: "",
  responsible_user_id: "",
  order_id: "",
  type: "",
  origin: "",
  direction: "",
  period_start: "",
  period_end: "",
};

function toListParams(
  filters: StockMovementFilterState
): StockMovementListParamsDTO {
  return {
    product_id: filters.product_id || undefined,
    responsible_user_id: filters.responsible_user_id || undefined,
    order_id: filters.order_id || undefined,
    type: filters.type || undefined,
    origin: filters.origin || undefined,
    direction: filters.direction || undefined,
    period_start: filters.period_start || undefined,
    period_end: filters.period_end || undefined,
  };
}

function isSameDay(date: Date, referenceDate: Date) {
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
}

function calculateSummary(movements: StockMovement[]): StockMovementSummary {
  const today = new Date();
  const impactedProductIds = new Set<string>();

  return movements.reduce<StockMovementSummary>(
    (summary, movement) => {
      impactedProductIds.add(movement.product_id);

      if (isSameDay(movement.occurred_at, today)) {
        summary.movementsToday += 1;
      }

      if (movement.direction === "in") {
        summary.totalEntries += movement.quantity;
      }

      if (movement.direction === "out") {
        summary.totalExits += movement.quantity;
      }

      if (movement.type === StockMovementType.ADJUSTMENT) {
        summary.adjustments += 1;
      }

      if (movement.type === StockMovementType.RESERVATION) {
        summary.reservations += 1;
      }

      if (movement.type === StockMovementType.CANCELLATION) {
        summary.cancellations += 1;
      }

      summary.impactedProducts = impactedProductIds.size;

      return summary;
    },
    {
      movementsToday: 0,
      totalEntries: 0,
      totalExits: 0,
      impactedProducts: 0,
      adjustments: 0,
      reservations: 0,
      cancellations: 0,
    }
  );
}

export function useStockMovements() {
  const [filters, setFilters] = useState<StockMovementFilterState>(
    initialStockMovementFilters
  );
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const fetchMovements = useCallback(async (nextFilters: StockMovementFilterState) => {
    setLoading(true);

    try {
      const response = await stockMovementService.list(toListParams(nextFilters));
      setMovements(response.data.map(mapStockMovementDTOToModel));
      setError(null);
      setLastUpdatedAt(new Date());
    } catch {
      setError("Nao foi possivel carregar as movimentacoes de estoque.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMovements(filters);
  }, [fetchMovements, filters]);

  const summary = useMemo(() => calculateSummary(movements), [movements]);

  const updateFilter = useCallback(
    <TKey extends keyof StockMovementFilterState>(
      key: TKey,
      value: StockMovementFilterState[TKey]
    ) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialStockMovementFilters);
  }, []);

  const refresh = useCallback(() => {
    void fetchMovements(filters);
  }, [fetchMovements, filters]);

  return {
    filters,
    movements,
    summary,
    loading,
    error,
    lastUpdatedAt,
    updateFilter,
    resetFilters,
    refresh,
  };
}
