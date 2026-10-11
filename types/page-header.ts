export type BreadcrumbItem = {
  title: string;
  href?: string;
};

export type PageHeaderProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
};
