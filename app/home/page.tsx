"use client";

import AbeekPanel from "./components/AbeekPanel";
import AiInsightPanel from "./components/AiInsightPanel";
import AlertBanner from "./components/AlertBanner";
import InfoBlock from "./components/InfoBlock";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TopBar from "./components/TopBar";
import UploadTranscript from "./components/UploadTranscript";
import { creditStats, studentInfo } from "./data/dashboard-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9FE] text-[#001E40]">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar />

        <main className="mx-auto max-w-[1040px] px-5 py-8 md:px-8 md:py-10 lg:px-9">
          <section className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-black text-[#737780]">
                졸업 요건 대시보드
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                안녕하세요, 홍길동님
              </h1>
            </div>
            <div className="flex justify-end gap-8">
              {studentInfo.map((item, index) => (
                <InfoBlock
                  bordered={index > 0}
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </section>

          <div className="space-y-7">
            <UploadTranscript />
            {/* <AlertBanner /> */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {creditStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </section>

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
