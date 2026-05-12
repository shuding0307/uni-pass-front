import { ITranscript } from "@/app/types/transcript";
import { Bell, Menu, Search, User } from "lucide-react";

interface Props {
  transcript?: ITranscript | null;
}

export default function TopBar({ transcript }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#E4E7EF] bg-white/90 px-5 backdrop-blur md:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="메뉴 열기"
          className="grid size-10 place-items-center rounded-lg border border-[#E4E7EF] text-[#43474F] lg:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>

        <label className="relative hidden w-80 md:block">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737780]"
            size={18}
          />
          <input
            className="h-10 w-full rounded-lg border border-transparent bg-[#F3F4F8] pl-10 pr-4 text-sm font-semibold text-[#001E40] outline-none transition focus:border-[#2563EB] focus:bg-white"
            placeholder="과목 또는 요건 검색"
            type="search"
          />
        </label>
      </div>

      <div className="flex items-center gap-4 md:gap-7">
        <span className="hidden text-xs font-black uppercase tracking-[0.18em] text-[#737780] sm:inline">
          2026학년도 1학기
        </span>
        {transcript && (
          <div className="flex items-center gap-3 border-l border-[#E4E7EF] pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-[#001E40]">
                {transcript.student_name}
              </p>
              <p className="text-[11px] font-bold text-[#737780]">
                컴퓨터공학 4학년
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-[#EEF2FF] text-[#2563EB]">
              <User size={21} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
