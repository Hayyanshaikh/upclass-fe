"use client";

import { Tooltip } from "antd";
import type { TagListProps } from "@/types/tag-list";

const tagClassName =
  "inline-flex shrink-0 rounded-full border border-border bg-foreground px-2.5 py-1 text-xs font-medium text-dark";

export default function TagList({ tags, showTags }: TagListProps) {
  const hiddenCount = showTags ? Math.max(tags.length - showTags, 0) : 0;
  const visibleTags = hiddenCount ? tags.slice(0, showTags) : tags;
  const hiddenTags = hiddenCount ? tags.slice(showTags) : [];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleTags.map((tag) => (
        <span key={tag} className={tagClassName}>
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <Tooltip
          color="#ffffff"
          trigger={["hover", "focus"]}
          classNames={{ container: "border! border-border!" }}
          title={
            <div className="flex flex-wrap gap-1">
              {hiddenTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex shrink-0 rounded-full border border-border bg-foreground px-2 py-0.5 text-xs font-medium text-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          }
        >
          <span
            tabIndex={0}
            aria-label={`${hiddenCount} more tags`}
            className={`${tagClassName} cursor-pointer`}
          >
            +{hiddenCount}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
