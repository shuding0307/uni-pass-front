import { ChevronRight, Sparkles } from "lucide-react";
import { aiInsights } from "../data/dashboard-data";

export default function AiInsightPanel() {
  return (
    <aside className="rounded-lg bg-[#101827] p-6 text-white shadow-[0_16px_40px_rgba(16,24,39,0.18)] md:p-7">
      <div className="mb-7 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-[#2563EB]/20 text-[#93C5FD]">
          <Sparkles size={21} />
        </div>
        <h2 className="text-xl font-black tracking-tight">AI 맞춤 분석</h2>
      </div>

      <div className="space-y-4">
        {aiInsights.map((insight) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
            key={insight.label}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#93C5FD]">
                {insight.label}
              </p>
              <strong className="text-xl font-black text-white">
                {insight.value}
              </strong>
            </div>
            <p className="text-sm font-semibold leading-6 text-[#CBD5E1]">
              {insight.description}
            </p>
          </article>
        ))}
      </div>

      <button
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-xs font-black text-white transition-colors hover:bg-[#1D4ED8]"
        type="button"
      >
        플래너에 추가
        <ChevronRight size={15} />
      </button>
    </aside>
  );
}
