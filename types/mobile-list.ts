import type { ReactNode } from "react";
import type { SelectOption } from "@/types/select";

export type MobileListSearch = {
  placeholder: string;
  onChange: (value: string) => void;
};

export type MobileListFilterField = {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
};

export type MobileListFiltersConfig<
  TFilters extends object = Record<string, unknown>,
> = {
  fields: MobileListFilterField[];
  values: Partial<TFilters>;
  onApply: (changedValues: Partial<TFilters>) => void;
};

export type MobileListProps<
  T,
  TFilters extends object = Record<string, unknown>,
> = {
  items: T[];
  rowKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  search?: MobileListSearch;
  filters?: MobileListFiltersConfig<TFilters>;
  loading?: boolean;
  loadingMore?: boolean;
  error?: boolean;
  onRetry?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** Increment to clear the search input (e.g. after a delete). */
  resetSignal?: number;
  emptyText?: string;
  skeletonRows?: number;
};
