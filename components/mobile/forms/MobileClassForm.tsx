"use client";

import { useEffect, useMemo, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileClassSectionForm from "@/components/mobile/forms/MobileClassSectionForm";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAcademicYearDropdown } from "@/hooks/useAcademicYearDropdown";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { toOptions } from "@/utils/enum-options";
import type {
  ClassDto,
  CreateClassDto,
  UpdateClassDto,
} from "@/app/api/schemas";
import { CreateClassDtoStatus } from "@/app/api/schemas";
import {
  useClassesControllerCreate,
  useClassesControllerUpdate,
} from "@/app/api/endpoints";
import type { ClassSectionFormValues } from "@/types/classes";

const statusOptions = toOptions(CreateClassDtoStatus);

type ClassDetailsValues = {
  name: string;
  academicYearId: string;
  status: CreateClassDtoStatus;
};

type MobileClassFormProps = {
  open: boolean;
  schoolClass?: ClassDto;
  onClose: () => void;
  onSaved: (message: string) => void;
  onDelete?: () => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data as
    | { message?: string; data?: { errors?: string[] } }
    | undefined;

  return body?.data?.errors?.[0] ?? body?.message ?? fallback;
}

export default function MobileClassForm({
  open,
  schoolClass,
  onClose,
  onSaved,
  onDelete,
}: MobileClassFormProps) {
  const [form] = Form.useForm<ClassDetailsValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sections, setSections] = useState<ClassSectionFormValues[]>([]);
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: sectionOptions, isLoading: isSectionsLoading } =
    useSectionDropdown();
  const {
    options: academicYearOptions,
    isLoading: isAcademicYearsLoading,
    selectedValue: activeAcademicYearId,
  } = useAcademicYearDropdown(form);
  const { mutateAsync: createClass, isPending: isCreating } =
    useClassesControllerCreate();
  const { mutateAsync: updateClass, isPending: isUpdating } =
    useClassesControllerUpdate();
  const isPending = isCreating || isUpdating;

  const sectionNames = useMemo(
    () =>
      Object.fromEntries(
        sectionOptions.map((option) => [option.value, option.label]),
      ),
    [sectionOptions],
  );

  const teacherNames = useMemo(
    () =>
      Object.fromEntries(
        teacherOptions.map((option) => [option.value, option.label]),
      ),
    [teacherOptions],
  );

  useEffect(() => {
    if (!open) {
      setSectionFormOpen(false);
      return;
    }

    setSubmitError(null);
    setSectionFormOpen(false);

    if (schoolClass) {
      form.setFieldsValue({
        name: schoolClass.name,
        academicYearId: schoolClass.academicYearId,
        status: schoolClass.status,
      });
      setSections(
        schoolClass.sections.map((section) => ({
          sectionId: section.sectionId,
          teacherId: section.teacherId,
          room: section.room ?? "",
          capacity: section.capacity ?? "",
        })),
      );
      return;
    }

    form.resetFields();
    form.setFieldsValue({ status: CreateClassDtoStatus.ACTIVE });
    setSections([]);
  }, [open, schoolClass, form]);

  useEffect(() => {
    if (!open || !activeAcademicYearId) return;
    form.setFieldValue(
      "academicYearId",
      schoolClass ? schoolClass.academicYearId : activeAcademicYearId,
    );
  }, [open, schoolClass, activeAcademicYearId, form]);

  function handleAddSection(values: ClassSectionFormValues) {
    setSections((previous) => [...previous, values]);
    setSectionFormOpen(false);
  }

  function removeSection(index: number) {
    setSections((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSubmit(values: ClassDetailsValues) {
    if (isPending) return;

    if (sections.length === 0) {
      setSubmitError("Add at least one section.");
      return;
    }

    setSubmitError(null);

    const commonData = {
      name: values.name.trim(),
      academicYearId: values.academicYearId,
      status: values.status,
      sections: sections.map((section) => ({
        sectionId: section.sectionId,
        teacherId: section.teacherId,
        room: section.room?.trim() || undefined,
        capacity:
          section.capacity === "" || section.capacity == null
            ? undefined
            : Number(section.capacity),
      })),
    };

    try {
      if (schoolClass) {
        const data: UpdateClassDto = commonData;
        await updateClass({ id: schoolClass.id, data });
        onSaved("Class updated successfully.");
        return;
      }

      const data: CreateClassDto = commonData;
      await createClass({ data });
      onSaved("Class added successfully.");
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          `Unable to ${schoolClass ? "update" : "add"} class.`,
        ),
      );
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title={schoolClass ? "Edit class" : "Add class"}
        closeLabel="Close"
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: CreateClassDtoStatus.ACTIVE }}
          onFinish={(values) => void handleSubmit(values)}
          onValuesChange={() => setSubmitError(null)}
          scrollToFirstError
          requiredMark={false}
          className="mt-4 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Input
              name="name"
              label="Class name"
              placeholder="Enter class name"
              isRequird
              rules={[{ whitespace: true, message: "Enter class name." }]}
            />
            <Select
              name="academicYearId"
              label="Academic year"
              placeholder="Select academic year"
              options={academicYearOptions}
              loading={isAcademicYearsLoading}
              isRequird
            />
            <Select
              name="status"
              label="Status"
              placeholder="Select status"
              options={statusOptions}
              showSearch={false}
              isRequird
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-dark">Sections</h3>
                <Button onClick={() => setSectionFormOpen(true)}>
                  <LuPlus size={18} aria-hidden="true" />
                  Add section
                </Button>
              </div>

              {sections.length === 0 ? (
                <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                  No sections added yet.
                </p>
              ) : (
                <ul role="list" className="flex flex-col gap-2">
                  {sections.map((section, index) => {
                    const sectionName =
                      sectionNames[section.sectionId] ?? "Section";
                    const teacherName = teacherNames[section.teacherId];
                    const capacity =
                      section.capacity === "" || section.capacity == null
                        ? undefined
                        : section.capacity;

                    return (
                      <li
                        key={`${section.sectionId}-${index}`}
                        className="flex items-start gap-2 rounded-lg border border-border bg-background p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-dark">
                            {sectionName}
                          </p>
                          {teacherName && (
                            <p className="mt-0.5 truncate text-xs text-gray">
                              {teacherName}
                            </p>
                          )}
                          <p className="mt-0.5 truncate text-xs text-gray">
                            {section.room?.trim() || "No room"}
                            {capacity !== undefined
                              ? ` · ${capacity} students`
                              : ""}
                          </p>
                        </div>
                        <IconButton
                          variant="danger"
                          label={`Remove ${sectionName}`}
                          onClick={() => removeSection(index)}
                        >
                          <LuTrash2 size={18} aria-hidden="true" />
                        </IconButton>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
              >
                {submitError}
              </p>
            )}
          </div>

          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            {schoolClass && onDelete && (
              <IconButton
                label="Delete class"
                variant="danger"
                onClick={onDelete}
              >
                <LuTrash2 size={18} aria-hidden="true" />
              </IconButton>
            )}
            <Button
              fullWidth
              variant="secondary"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button fullWidth type="submit" loading={isPending}>
              Save
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileClassSectionForm
        open={sectionFormOpen}
        onClose={() => setSectionFormOpen(false)}
        onAdd={handleAddSection}
      />
    </>
  );
}
