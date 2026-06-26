import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "../../../components/Button/Button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterOption,
} from "../../../components/DataTable/DataTable";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import "./Customers.css";

interface Customer {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  phone: string;
  address: string;
  description?: string;
}

type CustomerSearchColumn =
  | "name"
  | "email"
  | "cnpj"
  | "phone"
  | "address";

const PAGE_SIZE = 6;

const customerFilterOptions: DataTableFilterOption<CustomerSearchColumn>[] = [
  { label: "Nome", value: "name" },
  { label: "E-mail", value: "email" },
  { label: "CNPJ", value: "cnpj" },
  { label: "Telefone", value: "phone" },
  { label: "Endereço", value: "address" },
];

const customerColumns: DataTableColumn<Customer>[] = [
  { key: "name", header: "Nome", accessor: "name", minWidth: "12rem" },
  { key: "email", header: "E-mail", accessor: "email", minWidth: "14rem" },
  { key: "cnpj", header: "CNPJ", accessor: "cnpj", minWidth: "10rem" },
  { key: "phone", header: "Telefone", accessor: "phone", minWidth: "9rem" },
  { key: "address", header: "Endereço", accessor: "address", minWidth: "16rem" },
];

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Mercado Bom Gosto",
    email: "compras@mercadobomgosto.com.br",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 98452-1187",
    address: "Rua das Palmeiras, 284 - Sao Paulo, SP",
  },
  {
    id: 2,
    name: "Padaria Santa Mesa",
    email: "contato@padariasantamesa.com.br",
    cnpj: "23.456.789/0001-01",
    phone: "(19) 99741-3208",
    address: "Avenida Brasil, 1180 - Campinas, SP",
  },
  {
    id: 3,
    name: "Restaurante Villa Verde",
    email: "financeiro@villaverde.com.br",
    cnpj: "34.567.890/0001-12",
    phone: "(21) 98873-4501",
    address: "Rua Jardim Botanico, 612 - Rio de Janeiro, RJ",
  },
  {
    id: 4,
    name: "Emporio Norte Sul",
    email: "pedidos@emporionortesul.com.br",
    cnpj: "45.678.901/0001-23",
    phone: "(31) 97566-0021",
    address: "Rua dos Guajajaras, 95 - Belo Horizonte, MG",
  },
  {
    id: 5,
    name: "Cafe Central",
    email: "adm@cafecentral.com.br",
    cnpj: "56.789.012/0001-34",
    phone: "(41) 99120-4400",
    address: "Rua XV de Novembro, 420 - Curitiba, PR",
  },
  {
    id: 6,
    name: "Hotel Boa Estadia",
    email: "suprimentos@boaestadia.com.br",
    cnpj: "67.890.123/0001-45",
    phone: "(48) 99880-1144",
    address: "Avenida Beira Mar Norte, 780 - Florianopolis, SC",
  },
  {
    id: 7,
    name: "Distribuidora Alvorada",
    email: "compras@alvoradadistribuidora.com.br",
    cnpj: "78.901.234/0001-56",
    phone: "(51) 97654-2188",
    address: "Avenida Farrapos, 1500 - Porto Alegre, RS",
  },
  {
    id: 8,
    name: "Bistro Dona Maria",
    email: "dona.maria@bistro.com.br",
    cnpj: "89.012.345/0001-67",
    phone: "(62) 99870-3030",
    address: "Rua 9, 142 - Goiania, GO",
  },
  {
    id: 9,
    name: "Lanchonete Ponto Certo",
    email: "ponto.certo@clientes.com.br",
    cnpj: "90.123.456/0001-78",
    phone: "(85) 98712-6540",
    address: "Avenida Santos Dumont, 2020 - Fortaleza, CE",
  },
  {
    id: 10,
    name: "Confeitaria Flor de Acucar",
    email: "pedidos@flordeacucar.com.br",
    cnpj: "01.234.567/0001-89",
    phone: "(81) 98234-7655",
    address: "Rua da Aurora, 510 - Recife, PE",
  },
  {
    id: 11,
    name: "Quitanda Raizes",
    email: "contato@quitandaraizes.com.br",
    cnpj: "11.222.333/0001-44",
    phone: "(71) 99750-8112",
    address: "Rua Chile, 75 - Salvador, BA",
  },
  {
    id: 12,
    name: "Buffet Sabor Fino",
    email: "eventos@saborfino.com.br",
    cnpj: "22.333.444/0001-55",
    phone: "(61) 98622-9090",
    address: "SCS Quadra 2, Bloco C - Brasilia, DF",
  },
];

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<CustomerSearchColumn>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Clientes carregados para consulta."
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

  const filteredCustomers = useMemo(() => {
    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) =>
      customer[selectedColumn].toLocaleLowerCase("pt-BR").includes(normalizedSearch)
    );
  }, [customers, normalizedSearch, selectedColumn]);

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const visibleCurrentPage = Math.min(currentPage, pageCount);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (visibleCurrentPage - 1) * PAGE_SIZE;

    return filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCustomers, visibleCurrentPage]);

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

  function handleColumnChange(value: CustomerSearchColumn) {
    setSelectedColumn(value);
    setCurrentPage(1);
    showSearchFeedback();
  }

  function handleCreateCustomer() {
    setFeedbackMessage("Novo cadastro selecionado.");
  }

  function handleViewCustomer(customer: Customer) {
    setFeedbackMessage(`Visualizando ${customer.name}.`);
  }

  function handleEditCustomer(customer: Customer) {
    setFeedbackMessage(`Editando ${customer.name}.`);
  }

  function handleDeleteCustomer(customer: Customer) {
    const shouldDelete = window.confirm(`Excluir o cliente ${customer.name}?`);

    if (!shouldDelete) {
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.filter((currentCustomer) => currentCustomer.id !== customer.id)
    );
    setFeedbackMessage(`${customer.name} excluido da lista.`);
  }

  return (
    <MainLayout>
      <div className="customers-page">
        <section className="customers-hero" aria-labelledby="customers-title">
          <div>
            <span className="customers-eyebrow">
              <Users size={15} strokeWidth={2.35} aria-hidden="true" />
              Clientes
            </span>
            <h1 id="customers-title">Clientes</h1>
            <p>{customers.length} clientes cadastrados</p>
          </div>

          <div className="customers-create-action">
            <Button type="button" onClick={handleCreateCustomer}>
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
              Novo cliente
            </Button>
          </div>
        </section>

        <div className="customers-feedback" role="status">
          {feedbackMessage}
        </div>

        <DataTable<Customer, CustomerSearchColumn>
          columns={customerColumns}
          data={paginatedCustomers}
          getRowKey={(customer) => customer.id}
          loading={loading || isSearching}
          emptyMessage="Nenhum cliente encontrado."
          filters={{
            searchValue,
            selectedColumn,
            options: customerFilterOptions,
            searchPlaceholder: "Pesquisar clientes",
            isSearching,
            onSearchChange: handleSearchChange,
            onColumnChange: handleColumnChange,
          }}
          pagination={{
            currentPage: visibleCurrentPage,
            pageSize: PAGE_SIZE,
            totalItems: filteredCustomers.length,
            onPageChange: setCurrentPage,
          }}
          actions={{
            onView: handleViewCustomer,
            onEdit: handleEditCustomer,
            onDelete: handleDeleteCustomer,
          }}
        />
      </div>
    </MainLayout>
  );
}
