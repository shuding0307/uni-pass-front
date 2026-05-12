"use client";

import { useState } from "react";
import InfoBlock from "./components/InfoBlock";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TopBar from "./components/TopBar";
import UploadTranscript from "./components/UploadTranscript";
import { creditStats as initialCreditStats } from "./data/dashboard-data";
import { ITranscript } from "../types/transcript";

export default function Home() {
  const [transcript, setTranscript] = useState<ITranscript | null>(null);
  const [loading, setLoading] = useState(false);

  const creditStats = transcript
    ? [
        {
          label: "총 이수 학점",
          current: transcript.total_earned_credits,
          total: 130,
          barClassName: "bg-[#2563EB]",
        },
        {
          label: "교양 기초",
          current: parseInt(transcript.basic_credits.기초),
          total: 10,
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "교양 균형",
          current: parseInt(transcript.basic_credits.균형),
          total: 12,
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "교양 특화",
          current: parseInt(transcript.basic_credits.특화),
          total: 1,
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "교양 대교",
          current: parseInt(transcript.basic_credits.대교),
          total: 18,
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "전공 전필",
          current: parseInt(transcript.basic_credits.전필),
          total: 9,
          barClassName: "bg-[#16A34A]",
        },
        {
          label: "전공 전선",
          current: parseInt(transcript.basic_credits.전선),
          total: 33,
          barClassName: "bg-[#16A34A]",
        },
        {
          label: "전공 선택 심화",
          current: 13,
          total: 27,
          barClassName: "bg-[#0F766E]",
        },
        {
          label: "자유 선택 자선",
          current: parseInt(transcript.basic_credits.교직),
          total: 19,
          barClassName: "bg-[#0F766E]",
        },
      ]
    : initialCreditStats;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FE] text-[#001E40]">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar transcript={transcript ?? null} />

        <main className="mx-auto max-w-[1040px] px-5 py-8 md:px-8 md:py-10 lg:px-9">
          <section className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-black text-[#737780]">
                졸업 요건 대시보드
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                안녕하세요, {transcript?.student_name || "학생"}님
              </h1>
            </div>
            {transcript && (
              <div className="flex justify-end gap-8">
                <InfoBlock
                  id={transcript?.student_id}
                  department={transcript?.department}
                />
              </div>
            )}
          </section>

          <div className="space-y-7">
            <UploadTranscript
              setLoading={setLoading}
              setTranscript={setTranscript}
            />
            {/* <AlertBanner /> */}

            {transcript && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {creditStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </section>
            )}

            <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
              {/* <AbeekPanel /> */}
              <div className="xl:sticky xl:top-24">
                {/* <AiInsightPanel /> */}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
