"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeacherStore } from "@/stores/teachers";
import type { ClassDetailsDialogProps } from "@/types/classes";

export default function ClassDetailsDialog({ schoolClass, onClose, onEdit }: ClassDetailsDialogProps) {
  const teachers = useTeacherStore((state) => state.records);
  const teacherName = (id: string) => teachers.find((teacher) => teacher.id === id)?.name ?? "Teacher unavailable";

  return (
    <Dialog
      open={schoolClass !== null}
      title={schoolClass ? `Class ${schoolClass.grade}-${schoolClass.section}` : "Class details"}
      onClose={onClose}
      onConfirm={() => { if (schoolClass) onEdit(schoolClass); }}
      okText="Edit class"
      cancelText="Close"
    >
      {schoolClass && (
        <>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-gray">Class teacher</dt><dd className="mt-1 font-semibold text-dark">{teacherName(schoolClass.teacherId)}</dd></div>
            <div><dt className="text-gray">Assistant teacher</dt><dd className="mt-1 font-semibold text-dark">{schoolClass.assistantTeacherId ? teacherName(schoolClass.assistantTeacherId) : "None"}</dd></div>
            <div><dt className="text-gray">Students / capacity</dt><dd className="mt-1 font-semibold text-dark">{schoolClass.students} / {schoolClass.capacity}</dd></div>
            <div><dt className="text-gray">Room</dt><dd className="mt-1 font-semibold text-dark">{schoolClass.room}</dd></div>
            <div><dt className="text-gray">Academic year</dt><dd className="mt-1 font-semibold text-dark">{schoolClass.academicYear}</dd></div>
            <div><dt className="mb-1 text-gray">Status</dt><dd><StatusBadge variant={schoolClass.status === "Active" ? "success" : "neutral"}>{schoolClass.status}</StatusBadge></dd></div>
          </dl>
          <h3 className="mt-5 mb-2 text-sm font-bold text-dark">Subjects and teachers</h3>
          {schoolClass.subjects.length ? (
            <ul className="max-h-60 divide-y divide-border overflow-y-auto">
              {schoolClass.subjects.map((item) => (
                <li key={item.subject} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <div><p className="font-semibold text-dark">{item.subject}</p><p className="text-gray">{teacherName(item.teacherId)}</p></div>
                  <span className="text-gray">{item.periodsPerWeek} periods / week</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray">No subjects assigned yet.</p>}
        </>
      )}
    </Dialog>
  );
}
