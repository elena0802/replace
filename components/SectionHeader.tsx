import type { ReactNode } from "react";
import { typography } from "@/components/typography";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="max-w-2xl space-y-4">
        {eyebrow ? <p className={typography.eyebrow}>{eyebrow}</p> : null}
        <h2 className={typography.sectionTitle}>{title}</h2>
        {description ? (
          <p className={typography.sectionDescription}>{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
