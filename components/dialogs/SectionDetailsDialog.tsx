"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRolePermission } from "@/hooks/useRolePermission";
import type { SectionDto } from "@/app/api/schemas";

type SectionDetailsDialogProps = {
  section: SectionDto | null;
  onClose: () => void;
  onEdit: (section: SectionDto) => void;
};

export default function SectionDetailsDialog({
  section,
  onClose,
  onEdit,
}: SectionDetailsDialogProps) {
  const { canEdit } = useRolePermission("sections");

  return (
    <Dialog
      open={section !== null}
      title={
        section && (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
            >
              {section.name.charAt(0)}
            </span>
            <div>
              <h2 className="text-lg leading-tight font-bold text-dark">
                {section.name}
              </h2>
              <p className="mt-0.5 text-sm font-normal text-gray">
                Section details
              </p>
            </div>
          </div>
        )
      }
      cancelText="Close"
      onClose={onClose}
      onConfirm={() => {
        if (section) onEdit(section);
      }}
      okText="Edit section"
      showPrimaryBtn={canEdit}
      confirmDisabled={!section}
    >
      {section && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray">Name</dt>
            <dd className="mt-1 font-semibold text-dark">{section.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={section.status === "ACTIVE" ? "success" : "neutral"}
              >
                {section.status}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
