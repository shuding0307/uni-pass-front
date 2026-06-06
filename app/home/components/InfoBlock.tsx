type InfoBlockProps = {
  id?: string;
  department?: string;
};

export default function InfoBlock({
  id = "",
  department = "",
}: InfoBlockProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-[#E3E8F2] bg-white/75 px-4 py-3 shadow-[0_10px_30px_rgba(16,32,51,0.06)]">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#6B7280]">
          학번
        </p>
        <p className="text-base font-black tracking-tight text-[#102033]">
          {id || "-"}
        </p>
      </div>
      <div className="rounded-lg border border-[#E3E8F2] bg-white/75 px-4 py-3 shadow-[0_10px_30px_rgba(16,32,51,0.06)]">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#6B7280]">
          학과
        </p>
        <p className="text-base font-black tracking-tight text-[#102033]">
          {department ?? "컴퓨터공학과"}
        </p>
      </div>
    </div>
  );
}
