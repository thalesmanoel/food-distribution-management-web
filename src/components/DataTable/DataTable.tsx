import { useId, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import "./DataTable.css";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  minWidth?: string;
}

export interface DataTablePagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface DataTableActionConfig<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export interface DataTableFilterOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export interface DataTableFilterConfig<TValue extends string = string> {
  searchValue: string;
  selectedColumn: TValue;
  options: DataTableFilterOption<TValue>[];
  onSearchChange: (value: string) => void;
  onColumnChange: (value: TValue) => void;
  searchPlaceholder?: string;
  isSearching?: boolean;
}

interface DataTableProps<T, TFilter extends string = string> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T, index: number) => string | number;
  pagination: DataTablePagination;
  actions?: DataTableActionConfig<T>;
  filters?: DataTableFilterConfig<TFilter>;
  loading?: boolean;
  emptyMessage?: string;
}

function getPaginationPages(currentPage: number, pageCount: number) {
  const visiblePageCount = Math.min(5, pageCount);
  const firstPage = Math.max(
    1,
    Math.min(currentPage - 2, pageCount - visiblePageCount + 1)
  );

  return Array.from({ length: visiblePageCount }, (_, index) => firstPage + index);
}

function renderCellValue<T>(item: T, column: DataTableColumn<T>) {
  const value =
    typeof column.accessor === "function"
      ? column.accessor(item)
      : item[column.accessor];

  if (value === null || value === undefined || value === "") {
    return <span className="data-table-muted">-</span>;
  }

  return value as ReactNode;
}

export function DataTable<T, TFilter extends string = string>({
  columns,
  data,
  getRowKey,
  pagination,
  actions,
  filters,
  loading = false,
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T, TFilter>) {
  const searchInputId = useId();
  const selectInputId = useId();
  const hasActions = Boolean(actions?.onView || actions?.onEdit || actions?.onDelete);
  const pageCount = Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize));
  const firstItem =
    pagination.totalItems === 0
      ? 0
      : (pagination.currentPage - 1) * pagination.pageSize + 1;
  const lastItem = Math.min(
    pagination.currentPage * pagination.pageSize,
    pagination.totalItems
  );
  const selectedFilterLabel = filters?.options.find(
    (option) => option.value === filters.selectedColumn
  )?.label;
  const columnCount = columns.length + (hasActions ? 1 : 0);
  const paginationPages = getPaginationPages(pagination.currentPage, pageCount);

  return (
    <section className="data-table" aria-busy={loading}>
      {filters && (
        <div className="data-table-toolbar">
          <div className="data-table-search-group">
            <label className="data-table-sr-only" htmlFor={searchInputId}>
              Pesquisar
            </label>
            <Search size={18} strokeWidth={2.35} aria-hidden="true" />
            <input
              id={searchInputId}
              type="search"
              value={filters.searchValue}
              onChange={(event) => filters.onSearchChange(event.target.value)}
              placeholder={filters.searchPlaceholder ?? "Pesquisar"}
            />
          </div>

          <div className="data-table-filter-group">
            <label htmlFor={selectInputId}>Filtrar por</label>
            <select
              id={selectInputId}
              value={filters.selectedColumn}
              onChange={(event) => filters.onColumnChange(event.target.value as TFilter)}
            >
              {filters.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedFilterLabel && (
            <span className="data-table-filter-indicator">
              {filters.isSearching && (
                <LoaderCircle
                  className="data-table-spinner"
                  size={15}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              )}
              Coluna: {selectedFilterLabel}
            </span>
          )}
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table-table">
          <thead>
            <tr>
              {columns.map((column) => {
                const isActiveFilter = column.key === filters?.selectedColumn;

                return (
                  <th
                    className={isActiveFilter ? "data-table-active-column" : undefined}
                    style={{ minWidth: column.minWidth }}
                    scope="col"
                    key={column.key}
                  >
                    <span>
                      {column.header}
                      {isActiveFilter && (
                        <span
                          className="data-table-filter-mark"
                          aria-label="Coluna filtrada"
                        />
                      )}
                    </span>
                  </th>
                );
              })}

              {hasActions && (
                <th className="data-table-actions-header" scope="col">
                  Ações
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="data-table-state" colSpan={columnCount}>
                  <LoaderCircle
                    className="data-table-spinner"
                    size={22}
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                  <span>Carregando registros...</span>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td className="data-table-state" colSpan={columnCount}>
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((item, index) => (
                <tr key={getRowKey(item, index)}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      <span className="data-table-cell-content">
                        {renderCellValue(item, column)}
                      </span>
                    </td>
                  ))}

                  {hasActions && (
                    <td className="data-table-actions">
                      {actions?.onView && (
                        <button
                          className="data-table-action-button view"
                          type="button"
                          title="Visualizar"
                          aria-label="Visualizar registro"
                          onClick={() => actions.onView?.(item)}
                        >
                          <Eye size={17} strokeWidth={2.35} aria-hidden="true" />
                        </button>
                      )}

                      {actions?.onEdit && (
                        <button
                          className="data-table-action-button edit"
                          type="button"
                          title="Editar"
                          aria-label="Editar registro"
                          onClick={() => actions.onEdit?.(item)}
                        >
                          <Pencil size={17} strokeWidth={2.35} aria-hidden="true" />
                        </button>
                      )}

                      {actions?.onDelete && (
                        <button
                          className="data-table-action-button delete"
                          type="button"
                          title="Excluir"
                          aria-label="Excluir registro"
                          onClick={() => actions.onDelete?.(item)}
                        >
                          <Trash2 size={17} strokeWidth={2.35} aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="data-table-pagination" aria-label="Paginação">
        <span>
          {firstItem}-{lastItem} de {pagination.totalItems}
        </span>

        <div className="data-table-pagination-controls">
          <button
            type="button"
            aria-label="Página anterior"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
          >
            <ChevronLeft size={17} strokeWidth={2.4} aria-hidden="true" />
          </button>

          {paginationPages.map((page) => (
            <button
              className={page === pagination.currentPage ? "active" : undefined}
              type="button"
              aria-current={page === pagination.currentPage ? "page" : undefined}
              onClick={() => pagination.onPageChange(page)}
              disabled={loading}
              key={page}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            aria-label="Próxima página"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pageCount || loading}
          >
            <ChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
