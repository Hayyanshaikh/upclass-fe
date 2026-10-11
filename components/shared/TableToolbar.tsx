"use client";

import { useId, useState } from "react";
import { Form } from "antd";
import { LuListFilter } from "react-icons/lu";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { TableToolbarProps } from "@/types/table-toolbar";

export default function TableToolbar({
  search,
  filterFields = [],
  actions = [],
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = useState(true);
  const filterId = useId();

  return (
    <Form className="shrink-0" onFinish={() => {}}>
      <div className="flex flex-wrap items-end gap-3">
        {search && (
          <div className="min-w-0 grow basis-full sm:basis-0">
            <Input
              name="search"
              placeholder={search.placeholder || "Search records"}
              allowClear
              onChange={(event) => search.onChange(event.target.value)}
            />
          </div>
        )}
        {filterFields.length > 0 && (
          <Button
            variant={showFilters ? "primary" : "secondary"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <LuListFilter size={18} aria-hidden="true" />
            <span className="sr-only">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </Button>
        )}
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            disabled={action.disabled}
            loading={action.loading}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {filterFields.length > 0 && (
        <div id={filterId} hidden={!showFilters} className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {filterFields.map((field) => (
              <Select
                key={field.name}
                name={field.name}
                options={field.options}
                placeholder={field.placeholder || "Any"}
                allowClear
                onChange={field.onChange}
              />
            ))}
          </div>
        </div>
      )}
    </Form>
  );
}
