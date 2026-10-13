"use client";

import { notFound, useParams } from "next/navigation";
import NoticeForm from "@/components/forms/NoticeForm";
import { notices } from "@/constants/notices";
import type { NoticeRouteParams } from "@/types/notice";

export default function EditNoticeForm() {
  const { id } = useParams<NoticeRouteParams>();
  const notice = notices.find((notice) => notice.id === id);
  if (!notice) notFound();
  return <NoticeForm key={notice.id} notice={notice} />;
}
