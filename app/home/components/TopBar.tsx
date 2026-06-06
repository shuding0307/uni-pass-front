import { ITranscript } from "@/app/types/transcript";
import { Menu, Search, User } from "lucide-react";

interface Props {
  transcript?: ITranscript | null;
}

export default function TopBar({ transcript }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E3E8F2] bg-white/80 px-5 backdrop-blur-xl md:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="메뉴 열기"
          className="grid size-10 place-items-center rounded-lg border border-[#D9E0EC] bg-white text-[#435266] shadow-sm lg:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>

        <label className="relative hidden w-80 md:block">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            size={18}
          />
          <input
            className="h-11 w-full rounded-lg border border-[#E3E8F2] bg-[#F7F9FC] pl-10 pr-4 text-sm font-semibold text-[#102033] outline-none transition focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)]"
            placeholder="과목 또는 요건 검색"
            type="search"
          />
        </label>
      </div>

      <div className="flex items-center gap-4 md:gap-7">
        <span className="hidden rounded-full border border-[#E3E8F2] bg-white px-3 py-1.5 text-xs font-black text-[#435266] shadow-sm sm:inline">
          2026학년도 1학기
        </span>
        {transcript && (
          <div className="flex items-center gap-3 border-l border-[#E3E8F2] pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-[#102033]">
                {transcript.student_name}
              </p>
              <p className="text-[11px] font-bold text-[#6B7280]">
                컴퓨터공학 4학년
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#DBEAFE]">
              <User size={21} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
