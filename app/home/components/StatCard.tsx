type StatCardProps = {
  label: string;
  current: number;
  total: number;
  barClassName: string;
};

export default function StatCard({
  label,
  current,
  total,
}: StatCardProps) {
  const percent =
    total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  const isCompleted = current >= total;
  const isTotal = label === "총 이수 학점";
  const barColor = isTotal
    ? "bg-[#2563EB]"
    : isCompleted
      ? "bg-[#16A34A]"
      : "bg-[#F97316]";
  const statusText = isCompleted ? "충족" : "진행";
  const statusClassName = isCompleted
    ? "bg-[#ECFDF5] text-[#047857]"
    : "bg-[#FFF7ED] text-[#C2410C]";

  return (
    <article className="rounded-lg border border-[#E3E8F2] bg-white p-5 shadow-[0_14px_36px_rgba(16,32,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(16,32,51,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-sm font-black text-[#435266]">{label}</p>
        {!isTotal ? (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClassName}`}>
            {statusText}
          </span>
        ) : null}
      </div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-1">
          <strong className="text-3xl font-black leading-none text-[#102033]">
            {current}
          </strong>
          <span className="text-sm font-bold text-[#6B7280]">/ {total}</span>
        </div>
        <span className="rounded-full bg-[#F3F6FA] px-2.5 py-1 text-xs font-black text-[#435266]">
          {percent}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </article>
  );
}
