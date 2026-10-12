"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form } from "antd";
import { LuSearch } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StudentDetailsDialog from "@/components/dialogs/StudentDetailsDialog";
import { academicTerm } from "@/constants/dashboard";
import { students } from "@/constants/students";
import type { Student } from "@/types/student";

export default function DashboardHeader() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const query = search.trim().toLowerCase();
  const matches = query
    ? students.filter((student) =>
        `${student.name} ${student.roll} ${student.className}`
          .toLowerCase()
          .includes(query),
      )
    : [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <Form
              className="min-w-0 flex-1 basis-60"
              onFinish={() => setSearchOpen(true)}
            >
              <Input
                name="dashboardSearch"
                placeholder="Search students, staff, classes"
                ariaLabel="Search school records. Press Enter to search."
                prefix={
                  <LuSearch className="mr-1 text-gray" aria-hidden="true" />
                }
                allowClear
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit" className="sr-only">
                Search
              </button>
            </Form>
            <Link
              href="/students/add"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Add student
            </Link>
          </div>
        }
      />
      <Dialog
        open={searchOpen}
        title="Search results"
        onClose={() => setSearchOpen(false)}
        onConfirm={() => setSearchOpen(false)}
        footer={null}
      >
        <p className="mb-3 text-sm text-gray">
          Search currently includes the available student and class records.
          Staff records are not available yet.
        </p>
        {matches.length > 0 ? (
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {matches.map((student) => (
              <li
                key={student.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-semibold text-dark">{student.name}</p>
                  <p className="text-xs text-gray">
                    Class {student.className} · Roll {student.roll}
                  </p>
                </div>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchOpen(false);
                    setSelectedStudent(student);
                  }}
                >
                  View<span className="sr-only"> {student.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-gray">
            {query
              ? `No records found for “${search.trim()}”.`
              : "Enter a student name, roll number or class to search."}
          </p>
        )}
      </Dialog>
      <StudentDetailsDialog
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={(student) => {
          setSelectedStudent(null);
          router.push(`/students/edit/${student.id}`);
        }}
      />
    </>
  );
}
