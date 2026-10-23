"use client";

import { useState } from "react";
import type { TableQueryState, UseTableOptions } from "@/types/table";

export function useTable<
  TFilters extends object = Record<string, string | undefined>,
>({ pageSize = 10, initialFilters }: UseTableOptions<TFilters> = {}) {
  const [state, setState] = useState<TableQueryState<TFilters>>(() => ({
    page: 1,
    search: "",
    filters: initialFilters ?? {},
  }));

  function setPage(page: number) {
    const nextPage = Math.max(1, page);
    setState((previous) =>
      previous.page === nextPage ? previous : { ...previous, page: nextPage },
    );
  }

  function setSearch(search: string) {
    setState((previous) =>
      previous.search === search ? previous : { ...previous, search, page: 1 },
    );
  }

  function setFilters(changedValues: Partial<TFilters>) {
    const changes = Object.entries(changedValues);
    if (changes.length === 0) return;

    setState((previous) => {
      const isUnchanged = changes.every(
        ([name, value]) => previous.filters[name as keyof TFilters] === value,
      );
      if (isUnchanged) return previous;

      return {
        ...previous,
        page: 1,
        filters: { ...previous.filters, ...changedValues },
      };
    });
  }

  return {
    page: state.page,
    pageSize,
    offset: (state.page - 1) * pageSize,
    search: state.search,
    filters: state.filters,
    setPage,
    setSearch,
    setFilters,
  };
}
