import type { FormInstance, UploadFile } from "antd";
import type { Dayjs } from "dayjs";

export type NoticeCategory = "Exams" | "Events" | "Accounts" | "Activities" | "General" | "Holiday";
export type NoticeAudience = "Everyone" | "Students" | "Parents" | "Teachers" | "Staff";
export type NoticeStatus = "Published" | "Scheduled" | "Draft" | "Expired";
export type NoticeChannel = "Portal" | "Email" | "SMS";

export type NoticeAttachment = {
  id: string;
  name: string;
  size: number;
};

export type Notice = {
  id: string;
  title: string;
  category: NoticeCategory;
  audience: NoticeAudience[];
  publishDate?: string;
  status: NoticeStatus;
  body: string;
  classes?: string[];
  attachments?: NoticeAttachment[];
  readCount?: number;
  recipientCount?: number;
  publishTime?: string;
  expiryDate?: string;
  channels?: NoticeChannel[];
  pinned?: boolean;
};

export type NoticeDetailsDialogProps = {
  notice: Notice;
  open: boolean;
  onClose: () => void;
  afterClose: () => void;
  onEdit: () => void;
};

export type NoticeFormValues = {
  title: string;
  category?: NoticeCategory;
  body: string;
  audience: Record<string, boolean>;
  classes: Record<string, boolean>;
  publishMode: "now" | "schedule";
  publishDate?: Dayjs;
  publishTime?: Dayjs;
  expiryDate?: Dayjs;
  channels: Record<string, boolean>;
  pinned: boolean;
  attachments: UploadFile[];
};

export type NoticeFormProps = {
  notice?: Notice;
};

export type NoticePreviewProps = {
  form: FormInstance<NoticeFormValues>;
  initialValues: NoticeFormValues;
};

export type NoticeRouteParams = {
  id: string;
};
