"use client";

import dayjs from "dayjs";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { noticeStatusVariants } from "@/constants/notices";
import type { NoticeDetailsDialogProps } from "@/types/notice";

export default function NoticeDetailsDialog({ notice, open, onClose, afterClose, onEdit }: NoticeDetailsDialogProps) {
  const readCount = notice.readCount ?? 0;
  const recipientCount = notice.recipientCount ?? 0;
  const percent = recipientCount > 0 ? Math.min(100, Math.round(readCount / recipientCount * 100)) : 0;

  return (
    <Dialog open={open} title={<span className="text-lg font-bold text-dark">{notice.title}</span>}
      onClose={onClose} afterClose={afterClose} onConfirm={onEdit} okText="Edit notice" cancelText="Close">
      <div className="max-h-96 space-y-5 overflow-y-auto pr-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant={noticeStatusVariants[notice.status]}>{notice.status}</StatusBadge>
          <StatusBadge>{notice.category}</StatusBadge>
          <p className="text-sm text-gray">
            {notice.publishDate ? dayjs(notice.publishDate).format("DD MMM YYYY") : "Not published"} · For {notice.audience.join(", ")}
          </p>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray">{notice.body}</p>
        {notice.attachments?.map((file) => (
          <div key={file.id} className="flex flex-wrap items-center gap-2 rounded-md bg-foreground p-3 text-sm">
            <span className="break-all font-semibold text-dark">{file.name}</span>
            <span className="text-gray">· {Math.round(file.size / 1024)} KB</span>
          </div>
        ))}
        {recipientCount > 0 && <div>
          <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm font-semibold text-dark">
            <p>Read by {readCount.toLocaleString("en-US")} of {recipientCount.toLocaleString("en-US")}</p>
            <p>{percent}%</p>
          </div>
          <ProgressBar value={percent} label="Notice read progress" />
        </div>}
      </div>
    </Dialog>
  );
}
