import {
  StockMovementDirection,
  StockMovementOrigin,
  StockMovementType,
  type StockMovementDirection as StockMovementDirectionValue,
  type StockMovementOrigin as StockMovementOriginValue,
  type StockMovementType as StockMovementTypeValue,
} from "./stockMovement.types";

export const stockMovementDirectionLabels: Record<
  StockMovementDirectionValue,
  string
> = {
  [StockMovementDirection.IN]: "Entrada",
  [StockMovementDirection.OUT]: "Saida",
};

export const stockMovementOriginLabels: Record<StockMovementOriginValue, string> = {
  [StockMovementOrigin.ORDER]: "Pedido",
  [StockMovementOrigin.PURCHASE]: "Compra",
  [StockMovementOrigin.MANUAL_ADJUSTMENT]: "Ajuste manual",
  [StockMovementOrigin.RETURN]: "Devolucao",
  [StockMovementOrigin.CANCELLATION]: "Cancelamento",
  [StockMovementOrigin.INVENTORY]: "Inventario",
  [StockMovementOrigin.OTHER]: "Outro",
};

export const stockMovementTypeLabels: Record<StockMovementTypeValue, string> = {
  [StockMovementType.ENTRY]: "Entrada",
  [StockMovementType.EXIT]: "Saida",
  [StockMovementType.ADJUSTMENT]: "Ajuste",
  [StockMovementType.RESERVATION]: "Reserva",
  [StockMovementType.SEPARATION]: "Separacao",
  [StockMovementType.CANCELLATION]: "Cancelamento",
  [StockMovementType.RETURN]: "Devolucao",
  [StockMovementType.WRITE_OFF]: "Baixa",
  [StockMovementType.OTHER]: "Outro",
};

export const stockMovementDirectionOptions = Object.values(StockMovementDirection).map(
  (value) => ({
    label: stockMovementDirectionLabels[value],
    value,
  })
);

export const stockMovementOriginOptions = Object.values(StockMovementOrigin).map(
  (value) => ({
    label: stockMovementOriginLabels[value],
    value,
  })
);

export const stockMovementTypeOptions = Object.values(StockMovementType).map(
  (value) => ({
    label: stockMovementTypeLabels[value],
    value,
  })
);
