import type { ReactNode } from "react";
import { typography } from "@/components/typography";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className = "mb-8",
}: PageHeaderProps) {
  const content = (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className={typography.eyebrow}>{eyebrow}</p> : null}
      <h1 className={typography.pageTitle}>{title}</h1>
      {description ? (
        <p className={typography.pageDescription}>{description}</p>
      ) : null}
    </div>
  );

  if (!action) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      {content}
      {action}
    </div>
  );
}
