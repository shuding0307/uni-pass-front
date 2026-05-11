import { AlertCircle } from "lucide-react";

export default function AlertBanner() {
  return (
    <section className="flex flex-col gap-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-5 shadow-[0_1px_3px_rgba(239,68,68,0.08)] md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#EF4444] shadow-sm">
          <AlertCircle size={25} />
        </div>
        <div>
          <h2 className="mb-1 text-base font-black text-[#7F1D1D]">
            졸업 요건 알림
          </h2>
          <p className="max-w-3xl text-sm font-semibold leading-6 text-[#B91C1C]">
            교양 3영역에서 <strong className="font-black underline">2학점</strong>이
            부족합니다. 이번 학기에 이수하지 않으면 졸업이 지연될 수 있습니다.
          </p>
        </div>
      </div>
      <button
        className="h-11 rounded-lg bg-[#DC2626] px-5 text-sm font-black text-white transition-colors hover:bg-[#B91C1C]"
        type="button"
      >
        과목 찾기
      </button>
    </section>
  );
}
