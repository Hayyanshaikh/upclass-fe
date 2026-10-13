"use client";

import { Form } from "antd";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { noticeAudienceOptions } from "@/constants/notice-form";
import type { NoticeFormValues, NoticePreviewProps } from "@/types/notice";

export default function NoticePreview({ form, initialValues }: NoticePreviewProps) {
  const values: NoticeFormValues = Form.useWatch([], form) ?? initialValues;
  const audience = noticeAudienceOptions.filter((audience) => values.audience?.[audience]);

  return (
    <aside className="min-w-0 self-start xl:sticky xl:top-0" aria-label="Notice preview">
      <SectionCard title="Preview" className="h-auto!">
        <div className="space-y-3 rounded-md border border-border p-4">
          <StatusBadge>{values.category || "Category"}</StatusBadge>
          <h2 className="break-words font-bold text-dark">{values.title || "[Notice title]"}</h2>
          <p className="text-sm text-gray">
            {values.publishDate?.format("DD MMM YYYY") || "[Publish date]"} · For {audience.join(", ") || "[audience]"}
          </p>
          <p className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-gray">
            {values.body || "[Message preview appears here]"}
          </p>
          {values.attachments?.map((file) => (
            <p key={file.uid} className="break-words rounded-sm bg-foreground p-3 text-sm font-semibold text-dark">{file.name}</p>
          ))}
        </div>
      </SectionCard>
    </aside>
  );
}
