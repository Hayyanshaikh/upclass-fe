"use client";

import type { TableColumnsType } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import Table, { TableSummary } from "@/components/ui/Table";
import { collectFeeStudent } from "@/constants/collect-fee";
import { feeRecords } from "@/constants/fees";
import { students } from "@/constants/students";

type ReceiptLine = {
  id: string;
  description: string;
  period: string;
  amount: number;
};

const rupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

const sampleLines: ReceiptLine[] = [
  { id: "tuition", description: "Tuition fee", period: "Sep–Oct [2026]", amount: 16000 },
  { id: "exam", description: "Exam fee", period: "Oct [2026]", amount: 500 },
  { id: "other", description: "Lab and sports fee", period: "Oct [2026]", amount: 500 },
  { id: "fine", description: "Late fine", period: "", amount: 500 },
];

function validAmount(value: string | null, fallback: number) {
  if (value === null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export default function FeeReceipt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roll = searchParams.get("student") ?? collectFeeStudent.roll;
  const student = students.find((item) => item.roll === roll) ??
    students.find((item) => item.roll === collectFeeStudent.roll);
  const fee = feeRecords.find((item) => item.roll === roll);
  const totalReceived = validAmount(
    searchParams.get("amount"),
    roll === collectFeeStudent.roll ? 17500 : (fee?.paid ?? 0),
  );
  const method = searchParams.get("method") || "Cash";
  const date = searchParams.get("date") || "[DD/MM/YYYY]";
  const period = searchParams.get("period") || "Oct [2026]";
  const isSample = roll === collectFeeStudent.roll && totalReceived === 17500 &&
    method === "Cash" && (!searchParams.has("period") ||
      (period.includes("Sep") && period.includes("Oct")));
  const lines: ReceiptLine[] = isSample
    ? sampleLines
    : [{ id: "payment", description: "Fee payment", period, amount: totalReceived }];

  const columns: TableColumnsType<ReceiptLine> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <span className="font-semibold text-dark">{description}</span>,
    },
    { title: "Period", dataIndex: "period", key: "period" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (value: number) => <span className="font-semibold text-dark">{rupees(value)}</span>,
    },
  ];

  return (
    <div className="fee-receipt-page">
      <PageHeader
        title="Fee receipt"
        subtitle="Printable receipt"
        breadcrumbs={[{ title: "Fees", href: "/fees" }, { title: "Receipt" }]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => router.push("/fees")}>Back to fees</Button>
            <Button variant="secondary" onClick={() => window.print()}>Download PDF</Button>
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        }
      />

      <SectionCard className="fee-receipt-card h-auto! max-w-4xl">
        <article aria-label={`Fee receipt for ${student?.name ?? collectFeeStudent.name}`} className="space-y-7">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-dark">[School Name]</h2>
              <p className="text-sm text-gray">[School address] · [Phone]</p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-base font-bold text-dark">Fee receipt</h3>
              <p className="text-sm text-gray">No. FR-[0000]</p>
              <p className="text-sm text-gray">Date {date}</p>
            </div>
          </header>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 rounded-md bg-foreground p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray">Student</dt>
              <dd className="mt-1 font-bold text-dark">{student?.name ?? collectFeeStudent.name}</dd>
            </div>
            <div>
              <dt className="text-gray">Class</dt>
              <dd className="mt-1 font-bold text-dark">
                {student?.className ?? collectFeeStudent.className} · Roll {student?.roll ?? collectFeeStudent.roll}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Guardian</dt>
              <dd className="mt-1 font-bold text-dark">{student?.guardian ?? collectFeeStudent.guardian}</dd>
            </div>
            <div>
              <dt className="text-gray">Payment method</dt>
              <dd className="mt-1 font-bold text-dark">{method}</dd>
            </div>
          </dl>

          <Table
            columns={columns}
            data={lines}
            rowKey="id"
            pagination={false}
            autoHeight
            showSearch={false}
            className="fee-receipt-table h-auto! flex-none! gap-0!"
            summary={() => (
              <TableSummary.Row className="font-bold text-dark">
                <TableSummary.Cell index={0}>Total received</TableSummary.Cell>
                <TableSummary.Cell index={1} />
                <TableSummary.Cell index={2} align="right">{rupees(totalReceived)}</TableSummary.Cell>
              </TableSummary.Row>
            )}
          />

          <div className="flex flex-col justify-between gap-8 pt-6 text-sm text-gray sm:flex-row">
            <div className="w-44 border-t border-gray pt-2">Received by</div>
            <div className="w-44 border-t border-gray pt-2">Guardian signature</div>
          </div>
        </article>
      </SectionCard>
    </div>
  );
}
