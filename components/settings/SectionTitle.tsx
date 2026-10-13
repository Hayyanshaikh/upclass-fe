import type { SectionTitleProps } from "@/types/settings";

export default function SectionTitle({ icon: Icon, children, action }: SectionTitleProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-sm bg-success/10 text-primary">
          <Icon size={17} aria-hidden="true" />
        </span>
        <h2 className="text-base font-extrabold text-dark">{children}</h2>
      </div>
      {action}
    </div>
  );
}
