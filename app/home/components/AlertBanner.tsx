import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
}

export default function AlertBanner({ message }: Props) {
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
            {message}
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
