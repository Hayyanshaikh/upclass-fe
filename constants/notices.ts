import type { Notice } from "@/types/notice";
import type { SelectFilterField, TableAction } from "@/types/table-toolbar";

export const noticesTotal = 48;

// Sample notice records until notice endpoints are available.
export const notices: Notice[] = [
  {
    id: "NT-001", title: "Mid-term exam schedule published", category: "Exams",
    audience: ["Students", "Parents"], publishDate: "2026-10-11", status: "Published",
    body: "Dear students and parents, the mid-term exam date sheet is now available. Exams start on [date]. Please check the attached schedule.",
    attachments: [{ id: "date-sheet", name: "Date-sheet.pdf", size: 245760 }],
    readCount: 912, recipientCount: 1248, publishTime: "09:00", channels: ["Portal"],
    classes: ["6", "7", "8", "9", "10"],
  },
  {
    id: "NT-002", title: "Parent-teacher meeting", category: "Events",
    audience: ["Parents"], publishDate: "2026-10-18", status: "Scheduled",
    body: "Parents are invited to meet class teachers to discuss student progress, attendance and learning goals. Meeting timings will be shared by the school office.",
    publishTime: "08:00", channels: ["Portal", "Email"],
  },
  {
    id: "NT-003", title: "Fee deadline reminder", category: "Accounts",
    audience: ["Parents"], publishDate: "2026-10-05", status: "Published",
    body: "Please clear outstanding term fees by the due date on your fee voucher. Contact the accounts office for payment queries.",
    readCount: 768, recipientCount: 960, channels: ["Portal"],
  },
  {
    id: "NT-004", title: "Sports day registration open", category: "Activities",
    audience: ["Students"], publishDate: "2026-10-02", status: "Published",
    body: "Students can register for sports day through their class teacher. Event details and participation requirements are available from the activities coordinator.",
    readCount: 320, recipientCount: 600, channels: ["Portal"],
  },
  {
    id: "NT-005", title: "Staff meeting agenda", category: "General",
    audience: ["Teachers"], status: "Draft",
    body: "The staff meeting will cover lesson planning, student progress and upcoming school activities. Teachers are requested to prepare their class updates.",
  },
  {
    id: "NT-006", title: "Eid holidays announcement", category: "Holiday",
    audience: ["Everyone"], publishDate: "2026-09-20", status: "Expired",
    body: "The school holiday announcement has expired. Please contact the school office for the current academic calendar and reopening information.",
    expiryDate: "2026-09-27", channels: ["Portal"],
  },
];

export const noticeStatusVariants = {
  Published: "success", Scheduled: "info", Draft: "neutral", Expired: "warning",
} as const;

export const noticeCategoryOptions = ["Exams", "Events", "Accounts", "Activities", "General", "Holiday"]
  .map((value) => ({ label: value, value }));

export const noticeFilterFields: SelectFilterField[] = [
  { name: "audience", label: "Audience", options: [
    { label: "Everyone", value: "Everyone" },
    { label: "Students", value: "Students" },
    { label: "Parents", value: "Parents" },
    { label: "Teachers", value: "Teachers" },
    { label: "Staff", value: "Staff" },
  ], value: "Everyone", allowClear: false },
  { name: "category", label: "Category", placeholder: "Any category", options: noticeCategoryOptions },
  { name: "status", label: "Status", placeholder: "Any status", options: [
    { label: "Published", value: "Published" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Draft", value: "Draft" },
    { label: "Expired", value: "Expired" },
  ] },
];

export const noticeToolbarActions: TableAction[] = [
  { label: "Export CSV", variant: "secondary" },
  { label: "Create notice" },
];
