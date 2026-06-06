import { ChevronRight, Sparkles } from "lucide-react";
import { aiInsights } from "../data/dashboard-data";

interface Insight {
  label: string;
  value: string;
  description: string;
}

interface Props {
  insights?: Insight[];
}

export default function AiInsightPanel({ insights = aiInsights }: Props) {
  return (
    <aside className="rounded-lg border border-[#D9E0EC] bg-[#102033] p-6 text-white shadow-[0_18px_48px_rgba(16,32,51,0.18)] md:p-7">
      <div className="mb-7 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#93C5FD] ring-1 ring-white/10">
          <Sparkles size={21} />
        </div>
        <h2 className="text-xl font-black tracking-tight">AI 맞춤 분석</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-xs font-black text-[#102033] transition hover:bg-[#EFF6FF]"
        type="button"
      >
        플래너에 추가
        <ChevronRight size={15} />
      </button>
    </aside>
  );
}
