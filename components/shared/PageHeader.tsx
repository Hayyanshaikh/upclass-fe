import type { PageHeaderProps } from "@/types/page-header";
import Link from "next/link";

export default function PageHeader({
  title,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <header className="mb-5">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-gray">
            {breadcrumbs.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-center gap-1"
              >
                {index > 0 && <span aria-hidden="true">/</span>}
                {item.href && index < breadcrumbs.length - 1 ? (
                  <Link
                    href={item.href}
                    className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span
                    aria-current={
                      index === breadcrumbs.length - 1 ? "page" : undefined
                    }
                  >
                    {item.title}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="text-2xl leading-tight font-extrabold text-dark">
        {title}
      </h1>
    </header>
  );
}
