import { classGradeOptions } from "@/constants/classes";
import type { NoticeFormValues } from "@/types/notice";

export const noticeAudienceOptions = ["Students", "Parents", "Teachers", "Staff"];
export const noticeClassOptions = classGradeOptions.filter((option) => Number(option.value) >= 6);
export const noticeChannelOptions = ["Portal", "Email", "SMS"];
export const noticePublishOptions = [
  { label: "Now", value: "now" },
  { label: "Schedule", value: "schedule" },
];

export const noticeFormDefaults: NoticeFormValues = {
  title: "",
  body: "",
  audience: { Students: true, Parents: true },
  classes: {},
  publishMode: "now",
  channels: { Portal: true },
  pinned: false,
  attachments: [],
};
