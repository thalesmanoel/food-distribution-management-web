export const StockMovementDirection = {
  IN: "in",
  OUT: "out",
} as const;

export type StockMovementDirection =
  (typeof StockMovementDirection)[keyof typeof StockMovementDirection];

export const StockMovementOrigin = {
  ORDER: "order",
  PURCHASE: "purchase",
  MANUAL_ADJUSTMENT: "manual_adjustment",
  RETURN: "return",
  CANCELLATION: "cancellation",
  INVENTORY: "inventory",
  OTHER: "other",
} as const;

export type StockMovementOrigin =
  (typeof StockMovementOrigin)[keyof typeof StockMovementOrigin];

export const StockMovementType = {
  ENTRY: "entry",
  EXIT: "exit",
  ADJUSTMENT: "adjustment",
  RESERVATION: "reservation",
  SEPARATION: "separation",
  CANCELLATION: "cancellation",
  RETURN: "return",
  WRITE_OFF: "write_off",
  OTHER: "other",
} as const;

export type StockMovementType =
  (typeof StockMovementType)[keyof typeof StockMovementType];

export type ISODateString = string;

export interface AppBaseEntity {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface AppBaseEntityDTO {
  id: string;
  created_at?: ISODateString;
  updated_at?: ISODateString;
  deleted_at?: ISODateString | null;
}

export interface Product extends AppBaseEntity {
  sku: string;
  name: string;
  description?: string | null;
}

export interface ProductDTO extends AppBaseEntityDTO {
  sku: string;
  name: string;
  description?: string | null;
}

export interface Order extends AppBaseEntity {
  code: string;
  customer_name?: string | null;
  status?: string | null;
}

export interface OrderDTO extends AppBaseEntityDTO {
  code: string;
  customer_name?: string | null;
  status?: string | null;
}

export interface OrderItem extends AppBaseEntity {
  product_id: string;
  quantity: number;
  unit_price?: number | null;
}

export interface OrderItemDTO extends AppBaseEntityDTO {
  product_id: string;
  quantity: number;
  unit_price?: number | null;
}

export interface User extends AppBaseEntity {
  name: string;
  email?: string | null;
}

export interface UserDTO extends AppBaseEntityDTO {
  name: string;
  email?: string | null;
}

export interface StockMovement extends AppBaseEntity {
  product: Product;
  product_id: string;
  quantity: number;
  type: StockMovementType;
  direction: StockMovementDirection;
  origin: StockMovementOrigin;
  previous_balance: number;
  resulting_balance: number;
  order?: Order | null;
  order_id?: string | null;
  orderItem?: OrderItem | null;
  order_item_id?: string | null;
  responsibleUser?: User | null;
  responsible_user_id?: string | null;
  source_reference_id?: string | null;
  operation_key?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  occurred_at: Date;
}

export interface StockMovementDTO extends AppBaseEntityDTO {
  product: ProductDTO;
  product_id: string;
  quantity: number;
  type: StockMovementType;
  direction: StockMovementDirection;
  origin: StockMovementOrigin;
  previous_balance: number;
  resulting_balance: number;
  order?: OrderDTO | null;
  order_id?: string | null;
  orderItem?: OrderItemDTO | null;
  order_item_id?: string | null;
  responsibleUser?: UserDTO | null;
  responsible_user_id?: string | null;
  source_reference_id?: string | null;
  operation_key?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  occurred_at: ISODateString;
}

export interface StockMovementListParamsDTO {
  product_id?: string;
  responsible_user_id?: string;
  order_id?: string;
  type?: StockMovementType;
  origin?: StockMovementOrigin;
  direction?: StockMovementDirection;
  period_start?: ISODateString;
  period_end?: ISODateString;
}

export interface StockMovementListResponseDTO {
  data: StockMovementDTO[];
  total: number;
}

export interface StockMovementFilterState {
  product_id: string;
  responsible_user_id: string;
  order_id: string;
  type: StockMovementType | "";
  origin: StockMovementOrigin | "";
  direction: StockMovementDirection | "";
  period_start: string;
  period_end: string;
}

export interface StockMovementSummary {
  movementsToday: number;
  totalEntries: number;
  totalExits: number;
  impactedProducts: number;
  adjustments: number;
  reservations: number;
  cancellations: number;
}

export interface StockMovementFacetOption {
  label: string;
  value: string;
}
