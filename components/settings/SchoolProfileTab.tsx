"use client";

import { Form } from "antd";
import { LuGraduationCap } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";

export default function SchoolProfileTab() {
  return <SectionCard className="h-auto! min-h-full">
    <SectionTitle icon={LuGraduationCap}>School profile</SectionTitle>
    <Form.Item name="logo" className="mb-0!"><ImageUpload /></Form.Item>
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <Input name="schoolName" label="School name" isRequird placeholder="[School Name]" />
      <Input name="shortCode" label="Short code" placeholder="[SCH]" />
      <Input name="phone" label="Phone" type="tel" placeholder="[0300-0000000]" />
      <Input name="email" label="Email" type="email" />
      <Input name="website" label="Website" type="url" placeholder="[https://...]" />
      <Select name="timeZone" label="Time zone" options={[{ label: "Asia/Karachi", value: "Asia/Karachi" }, { label: "UTC", value: "UTC" }]} />
    </div>
    <div className="mt-4"><TextArea name="address" label="Address" rows={2} /></div>
  </SectionCard>;
}
