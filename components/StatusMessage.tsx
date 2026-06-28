type StatusMessageProps = {
  children: React.ReactNode;
  tone?: "loading" | "error" | "success";
  className?: string;
};

export default function StatusMessage({
  children,
  tone = "loading",
  className = "",
}: StatusMessageProps) {
  const toneClass =
    tone === "error"
      ? "border-danger-border bg-danger-surface text-danger"
      : tone === "success"
        ? "border-[color:var(--color-success-border)] bg-[color:var(--color-success-surface)] text-link"
        : "border-default bg-surface text-link";

  return (
    <div
      className={`rounded-xl border px-5 py-8 text-center text-lg font-semibold leading-8 shadow-card ${toneClass} ${className}`}
      role={tone === "loading" ? "status" : "alert"}
    >
      {children}
    </div>
  );
}
