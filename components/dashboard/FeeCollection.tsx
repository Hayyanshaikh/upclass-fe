"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { feeCollection } from "@/constants/dashboard";

export default function FeeCollection() {
  const [remindersOpen, setRemindersOpen] = useState(false);

  return (
    <>
      <SectionCard title="Fee collection">
        <p className="text-3xl leading-tight font-extrabold text-dark">{feeCollection.percent}%</p>
        <p className="mt-1 text-sm text-gray">of term fees collected</p>
        <div className="mt-3">
          <ProgressBar value={feeCollection.percent} label="Term fees collected" />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-gray">
          <span>Paid {feeCollection.paid.toLocaleString("en-US")}</span>
          <span>Pending {feeCollection.pending}</span>
        </div>
        <Button variant="secondary" className="mt-5 border-primary! font-semibold! text-primary!" onClick={() => setRemindersOpen(true)}>
          Send reminders
        </Button>
      </SectionCard>
      <Dialog
        open={remindersOpen}
        title="Fee reminders"
        onClose={() => setRemindersOpen(false)}
        onConfirm={() => setRemindersOpen(false)}
        footer={null}
      >
        <p className="text-sm text-gray">Fee reminders are not available yet. Connect the school’s messaging service to send reminders to guardians with outstanding fees.</p>
      </Dialog>
    </>
  );
}
