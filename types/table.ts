import type { TableColumnsType } from "antd";
import type { ReactNode } from "react";
import type { FilterField, TableAction, TableSearch } from "@/types/table-toolbar";

export type TableProps<
  T extends object,
  TFilters extends object = Record<string, unknown>,
> = {
  columns: TableColumnsType<T>;
  data: T[];
  rowKey?: string;
  pageSize?: number;
  current?: number;
  total?: number;
  loading?: boolean;
  className?: string;
  scrollX?: number | "max-content";
  onPageChange?: (page: number) => void;
  search?: TableSearch;
  searchValue?: string;
  showSearch?: boolean;
  filterFields?: FilterField[];
  filterValues?: Partial<TFilters>;
  onFilterValuesChange?: (changedValues: Partial<TFilters>) => void;
  actions?: TableAction[];
  header?: ReactNode;
  beforeTable?: ReactNode;
  interactive?: boolean;
  pagination?: boolean;
  autoHeight?: boolean;
  summary?: (data: readonly T[]) => ReactNode;
};

export type TablePaginationFooterProps = {
  count: number;
  start: number;
  rowCount: number;
  activePage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export type UseTableOptions<TFilters extends object> = {
  pageSize?: number;
  initialFilters?: Partial<TFilters>;
  debounceMs?: number;
};

export type TableQueryState<TFilters extends object> = {
  page: number;
  search: string;
  filters: Partial<TFilters>;
};
