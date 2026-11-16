export function DaySkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg border border-border bg-background"
        />
      ))}
    </div>
  );
}

export default function TimetableSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="h-10 w-2/3 animate-pulse rounded-full bg-border/60" />
      <DaySkeleton />
    </div>
  );
}
