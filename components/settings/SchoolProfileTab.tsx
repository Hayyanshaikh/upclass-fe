"use client";

import { useEffect } from "react";
import { Divider, Form } from "antd";
import { LuGraduationCap } from "react-icons/lu";

import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";

import MultiSelect from "../ui/MultiSelect";
import {
  DATE_FORMAT_OPTIONS,
  DAYS_OPTIONS,
  EDUCATION_SYSTEM_OPTIONS,
} from "@/constants/settings";
import PhotoUpload from "../ui/PhotoUpload";
import Loader from "../ui/Loader";
import { useSchoolProfileSettings } from "@/hooks/useSchoolProfileSettings";
import type { SettingsTabProps } from "@/types/settings";

export default function SchoolProfileTab({
  registerTab,
  schoolId,
  onSave,
  isSaving,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  const { isFetching } = useSchoolProfileSettings({
    form,
    registerTab,
    schoolId,
  });

  useEffect(() => {
    if (isFetching || window.location.hash !== "#workingDays") return;

    const timer = window.setTimeout(() => {
      const field = document.getElementById("workingDays");
      field?.focus();
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [isFetching]);

  return (
    <Form form={form} layout="vertical">
      <SectionCard className="h-[75vh]! overflow-auto! min-h-full rounded-tl-none!">
        {isFetching ? (
          <Loader />
        ) : (
          <>
            <SectionTitle
              icon={LuGraduationCap}
              action={
                <Button variant="primary" loading={isSaving} onClick={onSave}>
                  Save
                </Button>
              }
            >
              School profile
            </SectionTitle>

            <div className="flex flex-col gap-5 sm:flex-row">
              <Form.Item name="logo" className="mb-0!">
                <PhotoUpload maxSizeMB={1} alt="School Logo" />
              </Form.Item>

              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-3 flex-1">
                <Input
                  name="schoolName"
                  label="School name"
                  isRequird
                  placeholder="School name"
                />

                <Input name="shortCode" label="Short code" placeholder="SCH" />

                <Select
                  name="schoolType"
                  label="School type"
                  options={[
                    { label: "Private", value: "PRIVATE" },
                    { label: "Government", value: "GOVERNMENT" },
                  ]}
                />

                <Select
                  name="educationSystem"
                  label="Education system"
                  options={EDUCATION_SYSTEM_OPTIONS}
                />

                <Input
                  name="email"
                  label="Official email"
                  type="email"
                  placeholder="school@example.com"
                />
                <Input
                  name="phone"
                  label="Phone number"
                  type="tel"
                  placeholder="0300-0000000"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Input
                name="establishedYear"
                label="Established year"
                type="number"
                placeholder="e.g. 2010"
              />
              <div className="md:col-span-2">
                <Input
                  name="address"
                  label="Address"
                  placeholder="Enter school address"
                />
              </div>
            </div>

            <div className="mt-4">
              <TextArea
                name="description"
                label="School description"
                rows={3}
                placeholder="About your school"
              />
            </div>

            <Divider />

            {/* Administration Details */}
            <div className="mt-6">
              <h3 className="mb-4 font-semibold">Administration details</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  name="principalName"
                  label="Principal name"
                  placeholder="Principal name"
                />

                <Input
                  name="vicePrincipalName"
                  label="Vice principal name"
                  placeholder="Vice principal name"
                />

                <Input
                  name="adminContact"
                  label="Admin contact"
                  type="tel"
                  placeholder="0300-0000000"
                />

                <Input
                  name="ownerName"
                  label="Owner name"
                  placeholder="Owner name"
                />
              </div>
            </div>

            <Divider />
            {/* System Settings */}
            <div className="mt-6">
              <h3 className="mb-4 font-semibold">School settings</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <Select
                  name="dateFormat"
                  label="Date format"
                  options={DATE_FORMAT_OPTIONS}
                />

                <Input
                  name="feeDueDate"
                  label="Fee due date"
                  type="number"
                  placeholder="e.g. 10"
                />

                <MultiSelect
                  label="Working Days"
                  name="workingDays"
                  placeholder="Select working days"
                  options={DAYS_OPTIONS}
                />

                <Input
                  name="openingTime"
                  label="School opening time"
                  type="time"
                />

                <Input
                  name="closingTime"
                  label="School closing time"
                  type="time"
                />
              </div>
            </div>

          </>
        )}
      </SectionCard>
    </Form>
  );
}
