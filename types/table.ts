import type { TableColumnsType } from "antd";
import type { FilterField, TableAction, TableSearch } from "@/types/table-toolbar";

export type TableProps<T extends object> = {
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
  filterFields?: FilterField[];
  actions?: TableAction[];
};
