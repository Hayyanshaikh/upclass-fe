"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LuPlus, LuSave, LuTrash2, LuX } from "react-icons/lu";
import {
  useClassesControllerCreate,
  useClassesControllerUpdate,
} from "@/app/api/endpoints";
import {
  CreateClassDtoStatus,
  type CreateClassDto,
  type UpdateClassDto,
} from "@/app/api/schemas";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { ROUTE_NAMES } from "@/constants/routes";
import { classSectionFormDefaults } from "@/constants/classes";
import { useAcademicYearDropdown } from "@/hooks/useAcademicYearDropdown";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import type { ClassFormProps, ClassFormValues } from "@/types/classes";
import { toOptions } from "@/utils/enum-options";

const statusOptions = toOptions(CreateClassDtoStatus);

export default function ClassForm({ schoolClass, onSaved }: ClassFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<ClassFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: sectionOptions, isLoading: isSectionsLoading } =
    useSectionDropdown();
  const { options: academicYearOptions, isLoading: isAcademicYearsLoading } =
    useAcademicYearDropdown(form);
  const { mutateAsync: createClass, isPending: isCreating } =
    useClassesControllerCreate();
  const { mutateAsync: updateClass, isPending: isUpdating } =
    useClassesControllerUpdate();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!schoolClass) return;
    form.setFieldsValue({
      name: schoolClass.name,
      academicYearId: schoolClass.academicYearId,
      status: schoolClass.status,
      sections: schoolClass.sections.map((section) => ({
        sectionId: section.sectionId,
        teacherId: section.teacherId,
        room: section.room ?? "",
        capacity: section.capacity ?? "",
      })),
    });
  }, [form, schoolClass]);

  useEffect(() => {
    if (schoolClass) return;
    return () => form.resetFields();
  }, [form, schoolClass]);

  async function handleSubmit(values: ClassFormValues) {
    if (isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);

    const commonData = {
      name: values.name.trim(),
      academicYearId: values.academicYearId,
      status: values.status,
      sections: values.sections.map((section) => ({
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
        await onSaved?.();

        setSubmitSuccess("Class updated successfully.");
        return;
      }

      const data: CreateClassDto = commonData;
      const response = await createClass({ data });

      setSuccessRedirect(
        ROUTE_NAMES.editClass.replace(
          ":id",
          encodeURIComponent(response.data.id),
        ),
      );
      setSubmitSuccess("Class added successfully.");
    } catch (error) {
      const body = isAxiosError(error)
        ? (error.response?.data as
            | { message?: string; data?: { errors?: string[] } }
            | undefined)
        : undefined;

      const message =
        body?.data?.errors?.[0] ??
        body?.message ??
        (error instanceof Error ? error.message : undefined);

      if (isAxiosError(error) && error.response?.status === 409) {
        const lowerMessage = message?.toLowerCase();

        const field = lowerMessage?.includes("name")
          ? "name"
          : lowerMessage?.includes("academic")
            ? "academicYearId"
            : undefined;

        if (field) {
          form.setFields([
            { name: field, errors: [message ?? "Already exists."] },
          ]);
          form.scrollToField(field, { focus: true });
        }
      }

      setSubmitError(
        message ?? `Unable to ${schoolClass ? "update" : "add"} class.`,
      );
    }
  }

  function closeSuccessDialog() {
    setSubmitSuccess(null);
    if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={schoolClass ? schoolClass.name : "Add class"}
        compactMobile
        breadcrumbs={[
          { title: "Classes", href: ROUTE_NAMES.classListing },
          { title: schoolClass ? "Edit class" : "Add class" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => {
                if (!schoolClass) form.resetFields();
                router.push(ROUTE_NAMES.classListing);
              }}
            >
              <LuX size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cancel</span>
            </Button>
            <Button
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              loading={isPending}
              onClick={() => form.submit()}
            >
              <LuSave size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">
                {schoolClass ? "Update class" : "Add class"}
              </span>
            </Button>
          </div>
        }
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: CreateClassDtoStatus.ACTIVE,
          sections: [{ ...classSectionFormDefaults }],
        }}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        requiredMark={false}
        className="flex flex-col gap-6"
      >
        <ErrorDialog
          open={submitError !== null}
          message={submitError ?? ""}
          onClose={() => setSubmitError(null)}
        />
        <SuccessDialog
          open={submitSuccess !== null}
          message={submitSuccess ?? ""}
          onClose={closeSuccessDialog}
        />
        <SectionCard title="Class details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          </div>
        </SectionCard>
        <SectionCard autoHeight>
          <Form.List name="sections">
            {(fields, { add, remove }) => {
              function addSection() {
                const index = fields.length;

                add({ ...classSectionFormDefaults });
                setTimeout(() =>
                  form.getFieldInstance(["sections", index, "sectionId"])?.focus(),
                );
              }

              return (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-extrabold text-dark">
                      Sections
                    </h2>
                    <Button onClick={addSection}>
                      <LuPlus size={18} aria-hidden="true" />
                      Add Section
                    </Button>
                  </div>
                  {fields.map((field, index) => (
                    <fieldset
                      key={field.key}
                      className="flex items-end gap-3"
                    >
                      <legend className="sr-only">
                        Section row {index + 1}
                      </legend>
                      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Select
                          name={[field.name, "sectionId"]}
                          label="Section"
                          placeholder="Select section"
                          options={sectionOptions}
                          loading={isSectionsLoading}
                          isRequird
                        />
                        <Select
                          name={[field.name, "teacherId"]}
                          label="Class teacher"
                          placeholder="Select class teacher"
                          options={teacherOptions}
                          isRequird
                        />
                        <Input
                          name={[field.name, "room"]}
                          label="Classroom"
                          placeholder="Enter classroom, e.g. Room 12"
                          rules={[
                            {
                              whitespace: true,
                              message: "Enter classroom.",
                            },
                          ]}
                        />
                        <Input
                          name={[field.name, "capacity"]}
                          label="Student capacity"
                          type="number"
                          placeholder="Enter student capacity"
                          rules={[
                            {
                              pattern: /^[1-9]\d*$/,
                              message: "Enter a positive whole number.",
                            },
                          ]}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          variant="text"
                          danger
                          className="shrink-0"
                          onClick={() => remove(field.name)}
                        >
                          <LuTrash2 aria-hidden="true" />
                          <span className="sr-only">
                            Remove section row {index + 1}
                          </span>
                        </Button>
                      )}
                    </fieldset>
                  ))}
                </div>
              );
            }}
          </Form.List>
        </SectionCard>
      </Form>
    </div>
  );
}
