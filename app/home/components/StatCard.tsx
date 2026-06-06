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
  
  // '총 이수 학점'은 파란색, 그 외에는 100% 미만일 때 빨간색, 100% 이상일 때 연두색
  const barColor = label === "총 이수 학점" 
    ? "bg-[#2563EB]" 
    : (isCompleted ? "bg-[#16A34A]" : "bg-[#EF4444]");

  return (
    <article className="rounded-lg border border-[#EEF0F5] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <p className="mb-5 text-xs font-black text-[#737780]">{label}</p>
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <strong className="text-3xl font-black leading-none text-[#001E40]">
            {current}
          </strong>
          <span className="text-sm font-bold text-[#737780]">/ {total}</span>
        </div>
        <span className="text-xs font-black text-[#43474F]">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F5]">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </article>
  );
}
