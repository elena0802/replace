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
      ? "border-[#E5C8BA] bg-[#FFF8F4] text-[#7A4B3A]"
      : tone === "success"
        ? "border-[#A8B2A1] bg-[#A8B2A1]/20 text-[#4D5748]"
        : "border-[#E5E0D8] bg-[#FCFBF8] text-[#4D5748]";

  return (
    <div
      className={`rounded-3xl border px-5 py-8 text-center text-lg font-semibold leading-8 shadow-[0_14px_34px_rgba(77,87,72,0.06)] ${toneClass} ${className}`}
      role={tone === "loading" ? "status" : "alert"}
    >
      {children}
    </div>
  );
}
