"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Form } from "antd";
import { LuListFilter } from "react-icons/lu";
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
  const initialValues = useMemo(
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
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      className="shrink-0"
      onValuesChange={onValuesChange}
      onFinish={() => {}}
    >
      {((showSearch && (search || filterFields.length > 0)) ||
        actions.length > 0) && (
        <div className="flex flex-wrap items-end gap-3">
          {showSearch && search && (
            <div className="min-w-0 grow basis-full sm:basis-0">
              <Input
                name="search"
                label={search.label}
                placeholder={search.placeholder || "Search records"}
                allowClear
              />
            </div>
          )}
          {showSearch && filterFields.length > 0 && (
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
          {actions.map(
            (action) =>
              action?.showButton && (
                <Button
                  key={action.label}
                  variant={action.variant}
                  disabled={action.disabled}
                  loading={action.loading}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ),
          )}
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
