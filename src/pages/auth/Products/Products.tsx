import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "../../../components/Button/Button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterOption,
} from "../../../components/DataTable/DataTable";
import { MainLayout } from "../../../layouts/MainLayout/MainLayout";
import "./Products.css";

interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  supplier_id: string;
  supplier: string;
}

type ProductSearchColumn = "sku" | "name" | "price" | "stockQuantity";

const PAGE_SIZE = 6;

const productFilterOptions: DataTableFilterOption<ProductSearchColumn>[] = [
  { label: "SKU", value: "sku" },
  { label: "Nome", value: "name" },
  { label: "Preço de venda", value: "price" },
  { label: "Estoque", value: "stockQuantity" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const productColumns: DataTableColumn<Product>[] = [
  { key: "sku", header: "SKU", accessor: "sku", minWidth: "9rem" },
  { key: "name", header: "Nome", accessor: "name", minWidth: "14rem" },
  {
    key: "price",
    header: "Preço de venda",
    accessor: (product) => currencyFormatter.format(product.price),
    minWidth: "10rem",
  },
  {
    key: "stockQuantity",
    header: "Estoque",
    accessor: (product) => (
      <span
        className={
          product.stockQuantity <= 10 ? "products-stock low" : "products-stock"
        }
      >
        {product.stockQuantity} un.
      </span>
    ),
    minWidth: "8rem",
  },
];

const initialProducts: Product[] = [
  {
    id: 1,
    sku: "TS-CAF-001",
    name: "Cafe Especial 500g",
    description: "Cafe torrado em graos.",
    price: 34.9,
    stockQuantity: 42,
    supplier_id: "7a3ecb0a-0f29-4af2-a989-9c0f250e1c01",
    supplier: "Fornecedor Serra Alta",
  },
  {
    id: 2,
    sku: "TS-PAN-104",
    name: "Pao de Queijo Congelado 1kg",
    description: "Produto congelado para assar.",
    price: 29.5,
    stockQuantity: 18,
    supplier_id: "29d07bc8-8df7-4659-85aa-44e1fc69e90a",
    supplier: "Laticinios Boa Vista",
  },
  {
    id: 3,
    sku: "TS-BOL-030",
    name: "Bolo de Cenoura",
    description: "Bolo familiar com cobertura.",
    price: 48,
    stockQuantity: 9,
    supplier_id: "cba03724-4205-4063-a24d-54ef7671df4e",
    supplier: "Confeitaria Parceira",
  },
  {
    id: 4,
    sku: "TS-SUC-220",
    name: "Suco Integral de Uva 1L",
    description: "Bebida integral sem adicao de acucar.",
    price: 22.75,
    stockQuantity: 36,
    supplier_id: "b9dfd35f-7b33-4f2d-9070-4b09d460ab28",
    supplier: "Vale Natural",
  },
  {
    id: 5,
    sku: "TS-MOL-015",
    name: "Molho Artesanal de Tomate",
    description: "Molho pronto para consumo.",
    price: 18.9,
    stockQuantity: 64,
    supplier_id: "77975c68-28d6-4276-a760-81a6549f4fb4",
    supplier: "Sabores da Horta",
  },
  {
    id: 6,
    sku: "TS-GEL-089",
    name: "Geleia de Morango 240g",
    description: "Geleia artesanal com frutas selecionadas.",
    price: 24.9,
    stockQuantity: 7,
    supplier_id: "3a981cc8-3eb4-467d-ad3a-4f248c6d9fb2",
    supplier: "Doces Raizes",
  },
  {
    id: 7,
    sku: "TS-QUE-410",
    name: "Queijo Minas Frescal",
    description: "Queijo fresco embalado a vacuo.",
    price: 32.4,
    stockQuantity: 25,
    supplier_id: "29d07bc8-8df7-4659-85aa-44e1fc69e90a",
    supplier: "Laticinios Boa Vista",
  },
  {
    id: 8,
    sku: "TS-TOR-502",
    name: "Torta Salgada Frango",
    description: "Torta pronta para eventos.",
    price: 67.8,
    stockQuantity: 12,
    supplier_id: "cba03724-4205-4063-a24d-54ef7671df4e",
    supplier: "Confeitaria Parceira",
  },
];

function getProductSearchValue(product: Product, column: ProductSearchColumn) {
  if (column === "price") {
    return `${product.price} ${currencyFormatter.format(product.price)}`;
  }

  if (column === "stockQuantity") {
    return String(product.stockQuantity);
  }

  return product[column];
}

export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ProductSearchColumn>("sku");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Produtos carregados para consulta."
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

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      getProductSearchValue(product, selectedColumn)
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch)
    );
  }, [normalizedSearch, products, selectedColumn]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleCurrentPage = Math.min(currentPage, pageCount);

  const paginatedProducts = useMemo(() => {
    const startIndex = (visibleCurrentPage - 1) * PAGE_SIZE;

    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, visibleCurrentPage]);

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

  function handleColumnChange(value: ProductSearchColumn) {
    setSelectedColumn(value);
    setCurrentPage(1);
    showSearchFeedback();
  }

  function handleCreateProduct() {
    setFeedbackMessage("Novo produto selecionado.");
  }

  function handleViewProduct(product: Product) {
    setFeedbackMessage(`Visualizando ${product.sku}.`);
  }

  function handleEditProduct(product: Product) {
    setFeedbackMessage(`Editando ${product.sku}.`);
  }

  function handleDeleteProduct(product: Product) {
    const shouldDelete = window.confirm(`Excluir o produto ${product.name}?`);

    if (!shouldDelete) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((currentProduct) => currentProduct.id !== product.id)
    );
    setFeedbackMessage(`${product.name} excluido da lista.`);
  }

  return (
    <MainLayout>
      <div className="products-page">
        <section className="products-hero" aria-labelledby="products-title">
          <div>
            <span className="products-eyebrow">
              <Package size={15} strokeWidth={2.35} aria-hidden="true" />
              Produtos
            </span>
            <h1 id="products-title">Produtos</h1>
            <p>{products.length} produtos cadastrados</p>
          </div>

          <div className="products-create-action">
            <Button type="button" onClick={handleCreateProduct}>
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
              Novo produto
            </Button>
          </div>
        </section>

        <div className="products-feedback" role="status">
          {feedbackMessage}
        </div>

        <DataTable<Product, ProductSearchColumn>
          columns={productColumns}
          data={paginatedProducts}
          getRowKey={(product) => product.id}
          loading={loading || isSearching}
          emptyMessage="Nenhum produto encontrado."
          filters={{
            searchValue,
            selectedColumn,
            options: productFilterOptions,
            searchPlaceholder: "Pesquisar produtos",
            isSearching,
            onSearchChange: handleSearchChange,
            onColumnChange: handleColumnChange,
          }}
          pagination={{
            currentPage: visibleCurrentPage,
            pageSize: PAGE_SIZE,
            totalItems: filteredProducts.length,
            onPageChange: setCurrentPage,
          }}
          actions={{
            onView: handleViewProduct,
            onEdit: handleEditProduct,
            onDelete: handleDeleteProduct,
          }}
        />
      </div>
    </MainLayout>
  );
}
