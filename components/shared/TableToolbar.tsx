"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Form } from "antd";
import { LuListFilter, LuSearch } from "react-icons/lu";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import type { TableToolbarProps } from "@/types/table-toolbar";

export default function TableToolbar({
  search,
  searchValue,
  showSearch = true,
  filterFields = [],
  filterValues,
  onValuesChange,
  actions = [],
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [form] = Form.useForm();
  const filterId = useId();
  const formValues = useMemo(
    () => ({
      ...Object.fromEntries(
        filterFields
          .filter((field) => "value" in field)
          .map((field) => [field.name, field.value]),
      ),
      ...filterValues,
      ...(searchValue !== undefined ? { search: searchValue } : {}),
    }),
    [filterFields, filterValues, searchValue],
  );

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [form, formValues]);

  const hasTopRow = Boolean(
    (showSearch && (search || filterFields.length > 0)) || actions.length > 0,
  );
  const compactMobile = Boolean(
    showSearch && search && actions.length > 0 && actions.every((action) => action.icon),
  );

  return (
    <Form
      form={form}
      initialValues={formValues}
      className="shrink-0"
      onValuesChange={onValuesChange}
      onFinish={() => {}}
    >
      {hasTopRow && (
        <div className={`flex items-end gap-3 ${compactMobile ? "flex-nowrap gap-2 sm:flex-wrap sm:gap-3" : "flex-wrap"}`}>
          {showSearch && search && (
            <div className={compactMobile ? "min-w-0 flex-1 sm:grow sm:basis-0" : "min-w-0 grow basis-full sm:basis-0"}>
              <Input
                name="search"
                label={search.label}
                placeholder={search.placeholder || "Search records"}
                ariaLabel={search.placeholder || "Search records"}
                prefix={<LuSearch size={16} aria-hidden="true" />}
                allowClear
              />
            </div>
          )}
          {showSearch && filterFields.length > 0 && (
            <Button
              variant={showFilters ? "primary" : "secondary"}
              className={compactMobile ? "size-11! shrink-0 p-0! sm:h-11! sm:w-auto! sm:px-4!" : ""}
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
              className={action.icon ? "size-11! shrink-0 p-0! sm:h-11! sm:w-auto! sm:px-4!" : ""}
              onClick={action.onClick}
            >
              {action.icon}
              <span className={action.icon ? "sr-only sm:not-sr-only" : ""}>
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      )}
      {filterFields.length > 0 && (
        <div
          id={filterId}
          hidden={showSearch && !showFilters}
          className={showSearch || actions.length > 0 ? "mt-4" : ""}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {filterFields.map((field) =>
              field.type === "date" ? (
                <DatePicker
                  key={field.name}
                  name={field.name}
                  pastOnly={field.pastOnly}
                />
              ) : (
                <Select
                  key={field.name}
                  name={field.name}
                  options={field.options}
                  placeholder={field.placeholder || "Any"}
                  allowClear={field.allowClear ?? true}
                />
              ),
            )}
          </div>
        </div>
      )}
    </Form>
  );
}
