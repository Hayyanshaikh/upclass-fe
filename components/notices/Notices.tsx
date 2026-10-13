"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import NoticeDetailsDialog from "@/components/dialogs/NoticeDetailsDialog";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { notices, noticesTotal, noticeFilterFields, noticeStatusVariants, noticeToolbarActions } from "@/constants/notices";
import type { Notice } from "@/types/notice";

export default function Notices() {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editAfterClose, setEditAfterClose] = useState(false);

  function finishClosingDetails() {
    if (editAfterClose && selectedNotice) router.push(`/notices/edit/${selectedNotice.id}`);
    setSelectedNotice(null);
    setEditAfterClose(false);
  }

  const columns: TableColumnsType<Notice> = [
    { title: "Title", dataIndex: "title", key: "title", width: 340,
      render: (title) => <span className="font-bold text-dark">{title}</span> },
    { title: "Category", dataIndex: "category", key: "category", width: 125 },
    { title: "Audience", key: "audience", width: 185,
      render: (_, notice) => notice.audience.join(", ") },
    { title: "Publish date", key: "publishDate", width: 145,
      render: (_, notice) => notice.publishDate ? dayjs(notice.publishDate).format("DD MMM YYYY") : "—" },
    { title: "Status", key: "status", width: 150,
      render: (_, notice) => <StatusBadge variant={noticeStatusVariants[notice.status]}>{notice.status}</StatusBadge> },
    { title: "Actions", key: "actions", width: 125,
      render: (_, notice) => <ActionButtons actions={[
        { label: "View", icon: LuEye, onClick: () => { setSelectedNotice(notice); setDetailsOpen(true); } },
        { label: "Edit", icon: LuPencil, onClick: () => router.push(`/notices/edit/${notice.id}`) },
        { label: "Delete", icon: LuTrash2, danger: true, onClick: () => { setNoticeToDelete(notice); setDeleteOpen(true); } },
      ]} /> },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0"><PageHeader title="Notices" /></div>
      <Table columns={columns} data={notices} total={noticesTotal} current={1} pageSize={6} interactive={false}
        search={{ placeholder: "Notice title" }} filterFields={noticeFilterFields}
        actions={noticeToolbarActions.map((action) => action.label === "Create notice"
          ? { ...action, onClick: () => router.push("/notices/create") } : action)} />

      {selectedNotice && <NoticeDetailsDialog notice={selectedNotice} open={detailsOpen}
        onClose={() => setDetailsOpen(false)} afterClose={finishClosingDetails}
        onEdit={() => { setEditAfterClose(true); setDetailsOpen(false); }} />}
      {noticeToDelete && <DeleteDialog open={deleteOpen} title="Delete notice?"
        message={`${noticeToDelete.title} will be removed from the notice list.`} okText="Delete"
        onClose={() => setDeleteOpen(false)} onConfirm={() => setDeleteOpen(false)}
        afterClose={() => setNoticeToDelete(null)} />}
    </div>
  );
}
