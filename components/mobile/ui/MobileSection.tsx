import type { MobileSectionProps } from "@/types/mobile-section";

export default function MobileSection({
  title,
  hint,
  children,
}: MobileSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-bold text-dark">{title}</h2>
        {hint && (
          <span className="shrink-0 text-xs font-semibold text-gray">
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
