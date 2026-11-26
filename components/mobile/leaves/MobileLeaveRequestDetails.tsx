import dayjs from "dayjs";
import type { ReactNode } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { DISPLAY_DATE } from "@/constants/date-formats";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type MobileLeaveRequestDetailsProps = {
  request: LeaveRequestDto;
  balanceAfterApproval?: number | null;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="shrink-0 text-sm text-gray">{label}</dt>
      <dd className="text-right text-sm font-bold text-dark">{children}</dd>
    </div>
  );
}

function DetailBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-2.5">
      <dt className="text-sm text-gray">{label}</dt>
      <dd className="mt-1 text-sm leading-5 text-dark">{children}</dd>
    </div>
  );
}

export default function MobileLeaveRequestDetails({
  request,
  balanceAfterApproval,
}: MobileLeaveRequestDetailsProps) {
  return (
    <dl className="divide-y divide-border rounded-lg border border-border">
      <DetailRow label="Leave type">
        {request.leavePolicy?.name ?? "—"}
      </DetailRow>
      <DetailRow label="Status">
        <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
          {leaveRequestStatusLabels[request.status]}
        </StatusBadge>
      </DetailRow>
      <DetailRow label="Dates">
        {formatLeaveRequestDates(request.fromDate, request.toDate)}
      </DetailRow>
      <DetailRow label="Duration">
        {request.isHalfDay
          ? "Half day"
          : leaveRequestDaysLabel(request.totalDays)}
      </DetailRow>
      {balanceAfterApproval !== undefined &&
        balanceAfterApproval !== null && (
          <DetailRow label="Balance after approval">
            {leaveRequestDaysLabel(balanceAfterApproval)}
          </DetailRow>
        )}
      {request.contactDuringLeave && (
        <DetailRow label="Contact during leave">
          {request.contactDuringLeave}
        </DetailRow>
      )}
      {request.substituteTeacher && (
        <DetailRow label="Suggested substitute">
          {formatTeacherName(request.substituteTeacher)}
        </DetailRow>
      )}

      <DetailBlock label="Reason">{request.reason}</DetailBlock>

      {request.attachments && request.attachments.length > 0 && (
        <DetailBlock label="Attachments">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            {request.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary underline"
              >
                {attachment.name}
              </a>
            ))}
          </span>
        </DetailBlock>
      )}

      {request.rejectionReason && (
        <div className="px-4 py-2.5">
          <dt className="text-sm text-gray">Rejection reason</dt>
          <dd className="mt-1 text-sm leading-5 text-danger">
            {request.rejectionReason}
          </dd>
        </div>
      )}

      {request.reviewComment && (
        <DetailBlock label="Review comment">
          {request.reviewComment}
        </DetailBlock>
      )}

      <DetailRow label="Submitted on">
        {dayjs(request.createdAt).format(DISPLAY_DATE)}
      </DetailRow>
      {request.reviewedAt && (
        <DetailRow label="Reviewed on">
          {dayjs(request.reviewedAt).format(DISPLAY_DATE)}
        </DetailRow>
      )}
    </dl>
  );
}
