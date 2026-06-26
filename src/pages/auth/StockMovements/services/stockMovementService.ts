import { stockMovementMockDTOs } from "../mocks/stockMovements.mock";
import type {
  AppBaseEntity,
  AppBaseEntityDTO,
  Order,
  OrderDTO,
  OrderItem,
  OrderItemDTO,
  Product,
  ProductDTO,
  StockMovement,
  StockMovementDTO,
  StockMovementListParamsDTO,
  StockMovementListResponseDTO,
  User,
  UserDTO,
} from "../types/stockMovement.types";

function delay() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 420);
  });
}

function parseDate(value?: string | null) {
  return value ? new Date(value) : undefined;
}

function mapBaseEntity(dto: AppBaseEntityDTO): AppBaseEntity {
  return {
    id: dto.id,
    created_at: parseDate(dto.created_at),
    updated_at: parseDate(dto.updated_at),
    deleted_at: dto.deleted_at ? new Date(dto.deleted_at) : null,
  };
}

function mapProductDTOToModel(dto: ProductDTO): Product {
  return {
    ...mapBaseEntity(dto),
    sku: dto.sku,
    name: dto.name,
    description: dto.description,
  };
}

function mapOrderDTOToModel(dto: OrderDTO): Order {
  return {
    ...mapBaseEntity(dto),
    code: dto.code,
    customer_name: dto.customer_name,
    status: dto.status,
  };
}

function mapOrderItemDTOToModel(dto: OrderItemDTO): OrderItem {
  return {
    ...mapBaseEntity(dto),
    product_id: dto.product_id,
    quantity: dto.quantity,
    unit_price: dto.unit_price,
  };
}

function mapUserDTOToModel(dto: UserDTO): User {
  return {
    ...mapBaseEntity(dto),
    name: dto.name,
    email: dto.email,
  };
}

export function mapStockMovementDTOToModel(
  dto: StockMovementDTO
): StockMovement {
  return {
    ...mapBaseEntity(dto),
    product: mapProductDTOToModel(dto.product),
    product_id: dto.product_id,
    quantity: dto.quantity,
    type: dto.type,
    direction: dto.direction,
    origin: dto.origin,
    previous_balance: dto.previous_balance,
    resulting_balance: dto.resulting_balance,
    order: dto.order ? mapOrderDTOToModel(dto.order) : dto.order ?? null,
    order_id: dto.order_id,
    orderItem: dto.orderItem ? mapOrderItemDTOToModel(dto.orderItem) : dto.orderItem ?? null,
    order_item_id: dto.order_item_id,
    responsibleUser: dto.responsibleUser
      ? mapUserDTOToModel(dto.responsibleUser)
      : dto.responsibleUser ?? null,
    responsible_user_id: dto.responsible_user_id,
    source_reference_id: dto.source_reference_id,
    operation_key: dto.operation_key,
    notes: dto.notes,
    metadata: dto.metadata,
    occurred_at: new Date(dto.occurred_at),
  };
}

function normalize(value?: string | null) {
  return (value ?? "").trim().toLocaleLowerCase("pt-BR");
}

function includesSearch(source: Array<string | null | undefined>, search: string) {
  const normalizedSearch = normalize(search);

  if (!normalizedSearch) {
    return true;
  }

  return source.some((value) => normalize(value).includes(normalizedSearch));
}

function getStartOfDay(value: string) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getEndOfDay(value: string) {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function matchesFilters(
  movement: StockMovementDTO,
  params: StockMovementListParamsDTO
) {
  if (
    params.product_id &&
    !includesSearch(
      [movement.product_id, movement.product.sku, movement.product.name],
      params.product_id
    )
  ) {
    return false;
  }

  if (
    params.responsible_user_id &&
    !includesSearch(
      [
        movement.responsible_user_id,
        movement.responsibleUser?.name,
        movement.responsibleUser?.email,
      ],
      params.responsible_user_id
    )
  ) {
    return false;
  }

  if (
    params.order_id &&
    !includesSearch([movement.order_id, movement.order?.code], params.order_id)
  ) {
    return false;
  }

  if (params.type && movement.type !== params.type) {
    return false;
  }

  if (params.origin && movement.origin !== params.origin) {
    return false;
  }

  if (params.direction && movement.direction !== params.direction) {
    return false;
  }

  const movementTime = new Date(movement.occurred_at).getTime();

  if (params.period_start && movementTime < getStartOfDay(params.period_start)) {
    return false;
  }

  if (params.period_end && movementTime > getEndOfDay(params.period_end)) {
    return false;
  }

  return true;
}

export const stockMovementService = {
  async list(
    params: StockMovementListParamsDTO = {}
  ): Promise<StockMovementListResponseDTO> {
    await delay();

    const data = stockMovementMockDTOs
      .filter((movement) => matchesFilters(movement, params))
      .sort(
        (currentMovement, nextMovement) =>
          new Date(nextMovement.occurred_at).getTime() -
          new Date(currentMovement.occurred_at).getTime()
      );

    return {
      data,
      total: data.length,
    };
  },
};
