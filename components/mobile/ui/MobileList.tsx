"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileListFilters from "@/components/mobile/ui/MobileListFilters";
import type { MobileListProps } from "@/types/mobile-list";

export default function MobileList<
  T,
  TFilters extends object = Record<string, unknown>,
>({
  items,
  rowKey,
  renderItem,
  search,
  filters,
  loading = false,
  loadingMore = false,
  error = false,
  onRetry,
  hasMore = false,
  onLoadMore,
  resetSignal,
  emptyText = "No records found.",
  skeletonRows = 5,
}: MobileListProps<T, TFilters>) {
  const [searchForm] = Form.useForm<{ search?: string }>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (resetSignal === undefined) return;
    searchForm.setFieldValue("search", "");
  }, [resetSignal, searchForm]);

  const activeFilterCount = filters
    ? Object.values(filters.values).filter(Boolean).length
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {(search || filters) && (
        <div className="flex items-center gap-2">
          {search && (
            <div className="min-w-0 flex-1">
              <Form
                form={searchForm}
                layout="vertical"
                className="[&_.ant-form-item]:mb-0"
              >
                <Input
                  name="search"
                  placeholder={search.placeholder}
                  allowClear
                  ariaLabel={search.placeholder}
                  prefix={<LuSearch size={18} aria-hidden="true" />}
                  onChange={(event) => search.onChange(event.target.value)}
                />
              </Form>
            </div>
          )}

          {filters && search && (
            <MobileIconButton
              variant="secondary"
              label={
                activeFilterCount > 0
                  ? `Filters, ${activeFilterCount} active`
                  : "Filters"
              }
              onClick={() => setFiltersOpen(true)}
              className="relative"
            >
              <LuSlidersHorizontal size={20} aria-hidden="true" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
                  {activeFilterCount}
                </span>
              )}
            </MobileIconButton>
          )}

          {filters && !search && (
            <Button
              variant="secondary"
              fullWidth
              className="min-h-11! gap-2 font-semibold"
              onClick={() => setFiltersOpen(true)}
            >
              <LuSlidersHorizontal size={18} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3" aria-hidden="true">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg border border-border bg-background"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-border bg-background p-6 text-center">
          <p className="text-sm text-gray">Unable to load data.</p>
          {onRetry && (
            <Button
              variant="secondary"
              className="mt-3 h-10! font-semibold"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-border bg-background p-6 text-center text-sm text-gray">
          {emptyText}
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={rowKey(item)}>{renderItem(item, index)}</li>
          ))}
        </ul>
      )}

      {hasMore && items.length > 0 && onLoadMore && (
        <Button
          variant="secondary"
          fullWidth
          className="min-h-11! font-semibold"
          loading={loadingMore}
          onClick={onLoadMore}
        >
          Load more
        </Button>
      )}

      {filters && (
        <MobileListFilters
          open={filtersOpen}
          fields={filters.fields}
          values={filters.values}
          onApply={(values) => filters.onApply(values as Partial<TFilters>)}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
