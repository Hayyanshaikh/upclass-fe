"use client";

import { useState } from "react";
import { Checkbox as AntCheckbox, Form } from "antd";
import type { TableColumnsType } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table, { TableSummary } from "@/components/ui/Table";
import TextArea from "@/components/ui/TextArea";
import {
  collectFeeStudent,
  outstandingFees,
  overdueFine,
} from "@/constants/collect-fee";
import type { OutstandingFee } from "@/constants/collect-fee";
import { feeRecords } from "@/constants/fees";
import { students } from "@/constants/students";
import type { Student } from "@/types/student";

const rupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;
const amount = (value: unknown) => Math.max(0, Number(value) || 0);
const feeMonthLabel = (month: string) => {
  const [year, monthNumber] = month.split("-");
  const shortMonth = new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleString("en-US", { month: "short" });
  return `${shortMonth} [${year}]`;
};

function feesForStudent(roll: string): OutstandingFee[] {
  if (roll === collectFeeStudent.roll) return outstandingFees;
  return feeRecords
    .filter((fee) => fee.roll === roll && fee.total > fee.paid)
    .map((fee) => ({
      month: feeMonthLabel(fee.month),
      total: fee.total,
      balance: fee.total - fee.paid,
      status: fee.status === "Overdue" ? "Overdue" : "Due",
    }));
}

export default function CollectFee() {
  const router = useRouter();
  const studentRoll = useSearchParams().get("student");
  const initialStudent = students.find((student) => student.roll === studentRoll) ??
    students.find((student) => student.roll === collectFeeStudent.roll) ?? students[0];
  const initialFees = feesForStudent(initialStudent.roll);
  const initialReceived = initialFees.reduce((sum, fee) => sum + fee.balance, 0) +
    (initialFees.some((fee) => fee.status === "Overdue") ? overdueFine : 0);
  const [form] = Form.useForm();
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student>(initialStudent);
  const [selectedMonths, setSelectedMonths] = useState(() =>
    initialFees.map((fee) => fee.month),
  );
  const received = Form.useWatch("received", form);
  const discount = Form.useWatch("discount", form);

  const query = studentSearch.trim().toLowerCase();
  const matchingStudents = query
    ? students
        .filter((student) =>
          `${student.name} ${student.roll}`.toLowerCase().includes(query),
        )
        .slice(0, 5)
    : [];
  const studentFees = feesForStudent(selectedStudent.roll);

  const selectedFees = studentFees.filter((fee) =>
    selectedMonths.includes(fee.month),
  );
  const selectedTotal = selectedFees.reduce((sum, fee) => sum + fee.total, 0);
  const selectedBalance = selectedFees.reduce(
    (sum, fee) => sum + fee.balance,
    0,
  );
  const lateFine = selectedFees.some((fee) => fee.status === "Overdue")
    ? overdueFine
    : 0;
  const discountAmount = amount(discount);
  const totalPayable = Math.max(0, selectedBalance + lateFine - discountAmount);
  const balanceAfterPayment = Math.max(
    0,
    totalPayable - amount(received ?? initialReceived),
  );

  function toggleMonth(month: string) {
    setSelectedMonths((current) =>
      current.includes(month)
        ? current.filter((item) => item !== month)
        : [...current, month],
    );
  }

  function selectStudent(student: Student) {
    const fees = feesForStudent(student.roll);
    setSelectedStudent(student);
    setSelectedMonths(fees.map((fee) => fee.month));
    setStudentSearch("");
    form.setFieldValue("studentSearch", "");
    const balance = fees.reduce((sum, fee) => sum + fee.balance, 0);
    const fine = fees.some((fee) => fee.status === "Overdue") ? overdueFine : 0;
    form.setFieldValue("received", String(balance + fine));
  }

  const feeColumns: TableColumnsType<OutstandingFee> = [
    {
      title: <span className="sr-only">Select</span>,
      key: "select",
      width: 64,
      render: (_, fee) => (
        <AntCheckbox
          checked={selectedMonths.includes(fee.month)}
          onChange={() => toggleMonth(fee.month)}
          aria-label={`Select ${fee.month} fee`}
        />
      ),
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 145,
      render: (month: string) => (
        <span className="font-bold text-dark">{month}</span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 130,
      render: rupees,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 130,
      render: rupees,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 115,
      render: (status: OutstandingFee["status"]) => (
        <StatusBadge variant={status === "Overdue" ? "danger" : "warning"}>
          {status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ received: String(initialReceived), method: "Cash", discount: "0" }}
    >
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(18rem,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <SectionCard title="Student" className="h-auto!">
            <div className="relative">
              <Input
                name="studentSearch"
                label="Search student"
                placeholder="Name or roll no."
                allowClear
                onChange={(event) => setStudentSearch(event.target.value)}
              />
              {query && (
                <div className="absolute top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-sm border border-border bg-background shadow-lg">
                  {matchingStudents.length ? (
                    matchingStudents.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-foreground focus-visible:bg-foreground focus-visible:outline-2 focus-visible:outline-primary"
                        onClick={() => selectStudent(student)}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary" aria-hidden="true">
                          {student.name.charAt(0)}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-dark">{student.name}</span>
                          <span className="block text-xs text-gray">Class {student.className} · Roll {student.roll}</span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray">No students found.</p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-foreground p-4">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
                aria-hidden="true"
              >
                {selectedStudent.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-dark">{selectedStudent.name}</p>
                <p className="text-sm text-gray">
                  Class {selectedStudent.className} · Roll{" "}
                  {selectedStudent.roll} · Guardian:{" "}
                  {selectedStudent.guardian}
                </p>
              </div>
            </div>
          </SectionCard>

          <Table
            columns={feeColumns}
            data={studentFees}
            rowKey="month"
            header={
              <h2 className="text-base font-extrabold text-dark">
                Outstanding fees
              </h2>
            }
            pagination={false}
            autoHeight
            className="h-auto! flex-none! gap-0!"
            summary={() => (
              <TableSummary.Row className="bg-foreground font-bold text-dark">
                <TableSummary.Cell index={0} />
                <TableSummary.Cell index={1}>Total amount</TableSummary.Cell>
                <TableSummary.Cell index={2}>
                  {rupees(selectedTotal)}
                </TableSummary.Cell>
                <TableSummary.Cell index={3}>
                  {rupees(selectedBalance)}
                </TableSummary.Cell>
                <TableSummary.Cell index={4} />
              </TableSummary.Row>
            )}
          />

          <SectionCard title="Payment" className="h-auto!">
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Input
                name="received"
                label="Amount received (Rs.)"
                type="number"
                placeholder="0"
              />
              <Select
                name="method"
                label="Method"
                showSearch={false}
                options={["Cash", "Bank transfer", "Card", "Cheque"].map(
                  (value) => ({ label: value, value }),
                )}
              />
              <DatePicker name="paymentDate" label="Payment date" />
              <Input
                name="reference"
                label="Reference no."
                placeholder="Txn / cheque no."
              />
              <Input
                name="discount"
                label="Discount (Rs.)"
                type="number"
                placeholder="0"
              />
            </div>
            <TextArea name="remarks" label="Remarks" rows={2} />
          </SectionCard>
        </div>

        <SectionCard title="Payment summary" className="h-auto!">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt>Selected fees</dt>
              <dd>{rupees(selectedBalance)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Late fine</dt>
              <dd>{rupees(lateFine)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Discount</dt>
              <dd>{rupees(discountAmount)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-4 font-extrabold text-dark">
              <dt>Total payable</dt>
              <dd>{rupees(totalPayable)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Amount received</dt>
              <dd>{rupees(amount(received ?? initialReceived))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Balance after payment</dt>
              <dd>{rupees(balanceAfterPayment)}</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={() => router.push("/fees")}>
          Cancel
        </Button>
        <Button variant="secondary">Save payment</Button>
        <Button>Save and print receipt</Button>
      </div>
    </Form>
  );
}
