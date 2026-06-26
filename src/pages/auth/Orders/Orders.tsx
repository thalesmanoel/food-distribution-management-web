import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "../../../components/Button/Button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterOption,
} from "../../../components/DataTable/DataTable";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import "./Orders.css";

type StatusOrder = "PENDING" | "PREPARING" | "COMPLETED" | "CANCELED";

interface Order {
  id: string;
  total: number;
  status: StatusOrder;
  customer_id: string;
  customer: string;
  user_id: string;
}

type OrderSearchColumn = "id" | "status" | "customer" | "total";

const PAGE_SIZE = 6;

const orderFilterOptions: DataTableFilterOption<OrderSearchColumn>[] = [
  { label: "Nº do pedido", value: "id" },
  { label: "Status", value: "status" },
  { label: "Cliente", value: "customer" },
  { label: "Total", value: "total" },
];

const statusLabels: Record<StatusOrder, string> = {
  PENDING: "Pendente",
  PREPARING: "Em preparo",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const orderColumns: DataTableColumn<Order>[] = [
  { key: "id", header: "Nº do pedido", accessor: "id", minWidth: "10rem" },
  {
    key: "status",
    header: "Status",
    accessor: (order) => (
      <span className={`orders-status ${order.status.toLowerCase()}`}>
        {statusLabels[order.status]}
      </span>
    ),
    minWidth: "10rem",
  },
  { key: "customer", header: "Cliente", accessor: "customer", minWidth: "14rem" },
  {
    key: "total",
    header: "Total",
    accessor: (order) => currencyFormatter.format(order.total),
    minWidth: "9rem",
  },
];

const initialOrders: Order[] = [
  {
    id: "PED-1001",
    total: 284.5,
    status: "PENDING",
    customer_id: "0d1b4085-b840-46e2-9420-68f8c6475e5b",
    customer: "Mercado Bom Gosto",
    user_id: "f8fd5e1d-a6a5-4bc0-8e10-6cdb8840a1ef",
  },
  {
    id: "PED-1002",
    total: 152.7,
    status: "PREPARING",
    customer_id: "2e9a818e-6881-4ce0-ac58-40a3402a4d6f",
    customer: "Padaria Santa Mesa",
    user_id: "f8fd5e1d-a6a5-4bc0-8e10-6cdb8840a1ef",
  },
  {
    id: "PED-1003",
    total: 940,
    status: "COMPLETED",
    customer_id: "e5789660-9400-42a7-9105-f50e61da387d",
    customer: "Restaurante Villa Verde",
    user_id: "e1a51db7-0985-437c-8ce9-4c8a33f12360",
  },
  {
    id: "PED-1004",
    total: 318.35,
    status: "PENDING",
    customer_id: "9c77af75-2ca2-4b0d-88ac-8355a06a7b35",
    customer: "Emporio Norte Sul",
    user_id: "e1a51db7-0985-437c-8ce9-4c8a33f12360",
  },
  {
    id: "PED-1005",
    total: 76.8,
    status: "CANCELED",
    customer_id: "ac536af4-6524-4519-b08f-07de18a96284",
    customer: "Cafe Central",
    user_id: "f8fd5e1d-a6a5-4bc0-8e10-6cdb8840a1ef",
  },
  {
    id: "PED-1006",
    total: 512.2,
    status: "PREPARING",
    customer_id: "b7ab965a-5297-4e26-b2d6-e96e760155b2",
    customer: "Hotel Boa Estadia",
    user_id: "e1a51db7-0985-437c-8ce9-4c8a33f12360",
  },
  {
    id: "PED-1007",
    total: 1230.9,
    status: "COMPLETED",
    customer_id: "3ad29f54-9132-4890-ad75-c4f15439ae94",
    customer: "Distribuidora Alvorada",
    user_id: "f8fd5e1d-a6a5-4bc0-8e10-6cdb8840a1ef",
  },
  {
    id: "PED-1008",
    total: 205.4,
    status: "PENDING",
    customer_id: "cb5d79be-0fe5-4538-a73f-3a29e5db4027",
    customer: "Bistro Dona Maria",
    user_id: "e1a51db7-0985-437c-8ce9-4c8a33f12360",
  },
];

function getOrderSearchValue(order: Order, column: OrderSearchColumn) {
  if (column === "status") {
    return `${order.status} ${statusLabels[order.status]}`;
  }

  if (column === "total") {
    return `${order.total} ${currencyFormatter.format(order.total)}`;
  }

  return order[column];
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<OrderSearchColumn>("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Pedidos carregados para consulta."
  );
  const searchFeedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setLoading(false), 450);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (searchFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(searchFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const normalizedSearch = searchValue.trim().toLocaleLowerCase("pt-BR");

  const filteredOrders = useMemo(() => {
    if (!normalizedSearch) {
      return orders;
    }

    return orders.filter((order) =>
      getOrderSearchValue(order, selectedColumn)
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch)
    );
  }, [normalizedSearch, orders, selectedColumn]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleCurrentPage = Math.min(currentPage, pageCount);

  const paginatedOrders = useMemo(() => {
    const startIndex = (visibleCurrentPage - 1) * PAGE_SIZE;

    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredOrders, visibleCurrentPage]);

  function showSearchFeedback() {
    if (loading) {
      return;
    }

    if (searchFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(searchFeedbackTimeoutRef.current);
    }

    setIsSearching(true);
    searchFeedbackTimeoutRef.current = window.setTimeout(() => {
      setIsSearching(false);
      searchFeedbackTimeoutRef.current = null;
    }, 220);
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
    showSearchFeedback();
  }

  function handleColumnChange(value: OrderSearchColumn) {
    setSelectedColumn(value);
    setCurrentPage(1);
    showSearchFeedback();
  }

  function handleCreateOrder() {
    setFeedbackMessage("Novo pedido selecionado.");
  }

  function handleViewOrder(order: Order) {
    setFeedbackMessage(`Visualizando ${order.id}.`);
  }

  function handleEditOrder(order: Order) {
    setFeedbackMessage(`Editando ${order.id}.`);
  }

  function handleDeleteOrder(order: Order) {
    const shouldDelete = window.confirm(`Excluir o pedido ${order.id}?`);

    if (!shouldDelete) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((currentOrder) => currentOrder.id !== order.id)
    );
    setFeedbackMessage(`${order.id} excluido da lista.`);
  }

  return (
    <MainLayout>
      <div className="orders-page">
        <section className="orders-hero" aria-labelledby="orders-title">
          <div>
            <span className="orders-eyebrow">
              <ClipboardList size={15} strokeWidth={2.35} aria-hidden="true" />
              Pedidos
            </span>
            <h1 id="orders-title">Pedidos</h1>
            <p>{orders.length} pedidos cadastrados</p>
          </div>

          <div className="orders-create-action">
            <Button type="button" onClick={handleCreateOrder}>
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
              Novo pedido
            </Button>
          </div>
        </section>

        <div className="orders-feedback" role="status">
          {feedbackMessage}
        </div>

        <DataTable<Order, OrderSearchColumn>
          columns={orderColumns}
          data={paginatedOrders}
          getRowKey={(order) => order.id}
          loading={loading || isSearching}
          emptyMessage="Nenhum pedido encontrado."
          filters={{
            searchValue,
            selectedColumn,
            options: orderFilterOptions,
            searchPlaceholder: "Pesquisar pedidos",
            isSearching,
            onSearchChange: handleSearchChange,
            onColumnChange: handleColumnChange,
          }}
          pagination={{
            currentPage: visibleCurrentPage,
            pageSize: PAGE_SIZE,
            totalItems: filteredOrders.length,
            onPageChange: setCurrentPage,
          }}
          actions={{
            onView: handleViewOrder,
            onEdit: handleEditOrder,
            onDelete: handleDeleteOrder,
          }}
        />
      </div>
    </MainLayout>
  );
}
