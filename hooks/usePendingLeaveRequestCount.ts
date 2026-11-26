"use client";

import { useLeaveRequestsControllerFindAll } from "@/app/api/endpoints";
import { LeaveRequestsControllerFindAllStatus } from "@/app/api/schemas";
import { useRolePermission } from "@/hooks/useRolePermission";

export const pendingLeaveRequestsQuery = {
  limit: 1,
  offset: 0,
  status: LeaveRequestsControllerFindAllStatus.PENDING,
} as const;

export function usePendingLeaveRequestCount() {
  const { canView } = useRolePermission("leave_requests");
  const { data } = useLeaveRequestsControllerFindAll(pendingLeaveRequestsQuery, {
    query: { enabled: canView },
  });

  return canView ? (data?.total ?? 0) : 0;
}
