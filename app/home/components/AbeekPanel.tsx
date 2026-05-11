import { CheckCircle2, ChevronRight, Settings } from "lucide-react";
import { abeekItems } from "../data/dashboard-data";

export default function AbeekPanel() {
  return (
    <section className="rounded-lg border border-[#EEF0F5] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-[#EEF2FF] text-[#2563EB]">
            <Settings size={18} />
          </div>
          <h2 className="text-xl font-black text-[#001E40]">ABEEK 인증 현황</h2>
        </div>
        <span className="w-fit rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1.5 text-xs font-black text-[#16A34A]">
          전체 달성률: 75%
        </span>
      </div>

      <div className="space-y-2">
        {abeekItems.map((item) => (
          <div
            className="grid gap-4 rounded-lg p-3 transition-colors hover:bg-[#F6F7FB] sm:grid-cols-[1fr_auto]"
            key={item.title}
          >
            <div className="flex items-center gap-4">
              <span
                className={[
                  "size-2 rounded-full",
                  item.done ? "bg-[#16A34A]" : "bg-[#2563EB]",
                ].join(" ")}
              />
              <div>
                <h3 className="flex items-center gap-2 text-sm font-black text-[#001E40]">
                  {item.title}
                  {item.done ? (
                    <CheckCircle2 className="text-[#16A34A]" size={15} />
                  ) : null}
                </h3>
                <p className="text-xs font-bold text-[#737780]">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-5">
              <span
                className={[
                  "rounded-md px-2.5 py-1 text-[10px] font-black",
                  item.done
                    ? "bg-[#F3F4F8] text-[#737780]"
                    : "bg-[#EEF2FF] text-[#2563EB]",
                ].join(" ")}
              >
                {item.status}
              </span>
              <strong className="w-14 text-right text-sm font-black text-[#001E40]">
                {item.score}
              </strong>
              <ChevronRight className="text-[#B8BEC9]" size={18} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
