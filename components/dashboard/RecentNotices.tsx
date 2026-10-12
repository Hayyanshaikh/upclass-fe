"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { recentNotices } from "@/constants/dashboard";
import type { DashboardNotice } from "@/types/dashboard";

export default function RecentNotices() {
  const [selectedNotice, setSelectedNotice] = useState<DashboardNotice | null>(null);

  return (
    <>
      <SectionCard title="Recent notices" divider>
        <ul className="divide-y divide-border">
          {recentNotices.map((notice) => (
            <li key={notice.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-base font-bold text-dark">{notice.title}</p>
                <p className="text-sm text-gray">{notice.category} · {notice.date}</p>
              </div>
              <Button variant="link" className="shrink-0" onClick={() => setSelectedNotice(notice)}>
                View<span className="sr-only">: {notice.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>
      <Dialog
        open={selectedNotice !== null}
        title={selectedNotice?.title}
        onClose={() => setSelectedNotice(null)}
        onConfirm={() => setSelectedNotice(null)}
        footer={null}
      >
        <p className="mb-3 text-xs text-gray">{selectedNotice?.category} · {selectedNotice?.date}</p>
        <p className="text-sm leading-relaxed text-dark">{selectedNotice?.body}</p>
      </Dialog>
    </>
  );
}
