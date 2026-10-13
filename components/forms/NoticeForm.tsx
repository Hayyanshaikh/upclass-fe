"use client";

import { Form } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import FileUpload from "@/components/ui/FileUpload";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import NoticePreview from "@/components/notices/NoticePreview";
import { noticeCategoryOptions } from "@/constants/notices";
import {
  noticeAudienceOptions,
  noticeChannelOptions,
  noticeClassOptions,
  noticeFormDefaults,
  noticePublishOptions,
} from "@/constants/notice-form";
import type { NoticeFormProps, NoticeFormValues } from "@/types/notice";

export default function NoticeForm({ notice }: NoticeFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<NoticeFormValues>();
  const initialValues: NoticeFormValues = notice
    ? {
        title: notice.title,
        category: notice.category,
        body: notice.body,
        audience: Object.fromEntries(
          noticeAudienceOptions.map((audience) => [
            audience,
            notice.audience.includes("Everyone") ||
              notice.audience.some((value) => value === audience),
          ]),
        ),
        classes: Object.fromEntries(
          (notice.classes ?? []).map((grade) => [grade, true]),
        ),
        publishMode: notice.status === "Scheduled" ? "schedule" : "now",
        publishDate: notice.publishDate ? dayjs(notice.publishDate) : undefined,
        publishTime: notice.publishTime
          ? dayjs(`2000-01-01T${notice.publishTime}`)
          : undefined,
        expiryDate: notice.expiryDate ? dayjs(notice.expiryDate) : undefined,
        channels: Object.fromEntries(
          (notice.channels ?? ["Portal"]).map((channel) => [channel, true]),
        ),
        pinned: notice.pinned ?? false,
        attachments: (notice.attachments ?? []).map((file) => ({
          uid: file.id,
          name: file.name,
          size: file.size,
          status: "done",
        })),
      }
    : noticeFormDefaults;

  return (
    <Form
      form={form}
      initialValues={initialValues}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
        <div className="min-w-0 flex flex-col gap-5 xl:col-span-2">
          <SectionCard title="Notice" className="h-auto!">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  name="title"
                  label="Title"
                  placeholder="Enter notice title"
                />
                <Select
                  name="category"
                  label="Category"
                  options={noticeCategoryOptions}
                  placeholder="Select category"
                />
              </div>
              <TextArea
                name="body"
                label="Message"
                rows={7}
                placeholder="Write your notice message"
              />
              <FileUpload name="attachments" />
            </div>
          </SectionCard>

          <SectionCard title="Audience" className="h-auto!">
            <div className="space-y-5">
              <div>
                <span className="mb-3! block font-medium text-sm text-gray">
                  Who can see this notice
                </span>
                <div className="flex flex-wrap gap-3">
                  {noticeAudienceOptions.map((audience) => (
                    <div
                      key={audience}
                      className="rounded-sm border border-border px-4 py-3"
                    >
                      <Checkbox
                        name={["audience", audience]}
                        label={audience}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-3! block font-medium text-sm text-gray">
                  Classes (leave empty for all)
                </span>
                <div className="flex flex-wrap gap-3">
                  {noticeClassOptions.map((option) => (
                    <div
                      key={option.value}
                      className="rounded-sm border border-border px-4 py-3"
                    >
                      <Checkbox
                        name={["classes", option.value]}
                        label={option.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Delivery" className="h-auto!">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  name="publishMode"
                  label="Publish"
                  options={noticePublishOptions}
                  showSearch={false}
                />
                <DatePicker name="publishDate" label="Publish date" />
                <TimePicker name="publishTime" label="Publish time" />
                <DatePicker name="expiryDate" label="Expiry date" />
              </div>
              <div>
                <span className="mb-3! block font-medium text-sm text-gray">
                  Send via
                </span>
                <div className="flex flex-wrap gap-3">
                  {noticeChannelOptions.map((channel) => (
                    <div
                      key={channel}
                      className="rounded-sm border border-border px-4 py-3"
                    >
                      <Checkbox name={["channels", channel]} label={channel} />
                    </div>
                  ))}
                </div>
              </div>
              <Checkbox name="pinned" label="Pin to top of the portal" />
            </div>
          </SectionCard>
        </div>
        <NoticePreview form={form} initialValues={initialValues} />
      </div>

      <div className="flex flex-wrap justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={() => router.push("/notices")}>
          Cancel
        </Button>
        <Button variant="secondary">Save draft</Button>
        <Button>{notice ? "Update notice" : "Publish notice"}</Button>
      </div>
    </Form>
  );
}
