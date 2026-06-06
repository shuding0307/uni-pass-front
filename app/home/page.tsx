"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import AiAcademicAssistant from "./components/AiAcademicAssistant";
import AiInsightPanel from "./components/AiInsightPanel";
import InfoBlock from "./components/InfoBlock";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TopBar from "./components/TopBar";
import UploadAcademicFiles from "./components/UploadAcademicFiles";
import { creditStats as initialCreditStats } from "./data/dashboard-data";
import { ITranscript, PlannedCourse, TakenCourse } from "../types/transcript";

const DEFAULT_DEPARTMENT = "컴퓨터공학과";

function toCredit(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getCredit(
  credits: ITranscript["basic_credits"] | ITranscript["earned_credit"],
  keys: string[],
) {
  const key = keys.find((candidate) => credits?.[candidate] != null);

  return toCredit(key ? credits?.[key] : 0);
}

function getAnalysisInsights(hasTranscript: boolean, plannedCourseCount: number) {
  return [
    {
      label: "통합 분석",
      value: hasTranscript ? "완료" : "대기",
      description: hasTranscript
        ? "성적표를 분석해 이수 학점과 졸업 요건 충족 현황을 반영했습니다."
        : "성적표를 업로드하면 분석 결과가 표시됩니다.",
    },
    {
      label: "현재 수강",
      value: `${plannedCourseCount}개`,
      description: "시간표 PDF를 함께 올리면 현재 학기 과목도 반영됩니다.",
    },
  ];
}

function groupTakenCourses(courses: TakenCourse[]) {
  return courses.reduce<Record<string, TakenCourse[]>>((groups, course) => {
    const category = course.area_type || "기타";

    groups[category] = [...(groups[category] ?? []), course];
    return groups;
  }, {});
}

function getCourseCredits(courses: Array<TakenCourse | PlannedCourse>) {
  return courses.reduce((total, course) => total + course.credits, 0);
}

export default function Home() {
  const [transcript, setTranscript] = useState<ITranscript | null>(null);
  const [plannedCourses, setPlannedCourses] = useState<PlannedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const takenCourseGroups = transcript
    ? Object.entries(groupTakenCourses(transcript.taken_courses)).sort(
        ([firstCategory], [secondCategory]) =>
          firstCategory.localeCompare(secondCategory, "ko"),
      )
    : [];

  const creditStats = transcript
    ? [
        {
          label: "총 이수 학점",
          current: getCredit(transcript.earned_credit, ["total"]) ||
            toCredit(transcript.total_earned_credits),
          total: getCredit(transcript.basic_credits, ["total"]),
          barClassName: "bg-[#2563EB]",
        },
        {
          label: "교양 기초",
          current: getCredit(transcript.earned_credit, [
            "basic_general",
            "기초",
            "기초교양",
          ]),
          total: getCredit(transcript.basic_credits, [
            "basic_general",
            "기초",
            "기초교양",
          ]),
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "교양 균형",
          current: getCredit(transcript.earned_credit, [
            "balanced_general",
            "균형",
            "균형교양",
          ]),
          total: getCredit(transcript.basic_credits, [
            "balanced_general",
            "균형",
            "균형교양",
          ]),
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "학문 기초",
          current: getCredit(transcript.earned_credit, [
            "academic_foundation",
            "학문기초",
            "대교",
          ]),
          total: getCredit(transcript.basic_credits, [
            "academic_foundation",
            "학문기초",
            "대교",
          ]),
          barClassName: "bg-[#EF4444]",
        },
        {
          label: "전공 전필",
          current: getCredit(transcript.earned_credit, [
            "major_required",
            "전필",
            "최소전공_필수",
          ]),
          total: getCredit(transcript.basic_credits, [
            "major_required",
            "전필",
            "최소전공_필수",
          ]),
          barClassName: "bg-[#16A34A]",
        },
        {
          label: "전공 전선",
          current: getCredit(transcript.earned_credit, [
            "major_elective",
            "전선",
            "최소전공_선택",
          ]),
          total: getCredit(transcript.basic_credits, [
            "major_elective",
            "전선",
            "최소전공_선택",
          ]),
          barClassName: "bg-[#16A34A]",
        },
        {
          label: "심화 전공",
          current: getCredit(transcript.earned_credit, [
            "advanced_major",
            "심화",
            "심화전공",
          ]),
          total: getCredit(transcript.basic_credits, [
            "advanced_major",
            "심화",
            "심화전공",
          ]),
          barClassName: "bg-[#0F766E]",
        },
        {
          label: "자유 선택",
          current: getCredit(transcript.earned_credit, [
            "free_elective",
            "자선",
            "자유선택",
          ]),
          total: getCredit(transcript.basic_credits, [
            "free_elective",
            "자선",
            "자유선택",
          ]),
          barClassName: "bg-[#0F766E]",
        },
      ]
    : initialCreditStats;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
        <div className="flex min-w-72 flex-col items-center rounded-lg border border-[#E3E8F2] bg-white px-6 py-6 text-center shadow-[0_18px_48px_rgba(16,32,51,0.08)]">
          <div className="mb-4 grid size-12 place-items-center rounded-full bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#DBEAFE]">
            <Loader2 className="animate-spin" size={24} />
          </div>
          <p className="text-lg font-black text-[#102033]">로딩 중...</p>
          <p className="mt-1 text-sm font-semibold text-[#6B7280]">
            업로드한 파일을 분석하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#102033]">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar transcript={transcript ?? null} />

        <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-10 lg:px-9">
          <section className="mb-8 overflow-hidden rounded-lg border border-[#D9E0EC] bg-white shadow-[0_18px_48px_rgba(16,32,51,0.07)]">
            <div className="flex flex-col gap-6 bg-[#FBFCFE] px-6 py-7 md:flex-row md:items-end md:justify-between md:px-8">
              <div>
                <p className="mb-2 text-sm font-black text-[#6B7280]">
                졸업 요건 대시보드
                </p>
                <h1 className="text-3xl font-black tracking-tight text-[#102033] md:text-4xl">
                  안녕하세요, {transcript?.student_name || "학생"}님
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#6B7280]">
                  성적표를 업로드하면 졸업 요건 충족 현황을 한 화면에서 확인할 수 있습니다. 시간표는 선택으로 함께 반영할 수 있습니다.
                </p>
              </div>
              {transcript && (
                <InfoBlock
                  id={transcript.student_id ?? ""}
                  department={transcript.department ?? DEFAULT_DEPARTMENT}
                />
              )}
            </div>
          </section>

          <div className="space-y-7">
            <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
              <UploadAcademicFiles
                setLoading={setLoading}
                onUploadComplete={({ plannedCourses, transcript }) => {
                  setTranscript(transcript);
                  setPlannedCourses(plannedCourses);
                }}
              />
              <div className="xl:sticky xl:top-24">
                <AiInsightPanel
                  insights={getAnalysisInsights(
                    Boolean(transcript),
                    plannedCourses.length,
                  )}
                />
              </div>
            </section>

            {transcript && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {creditStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </section>
            )}

            <AiAcademicAssistant transcript={transcript} />

            {takenCourseGroups.length > 0 ? (
              <section className="rounded-lg border border-[#E3E8F2] bg-white p-6 shadow-[0_14px_36px_rgba(16,32,51,0.06)]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
                      Taken Courses
                    </p>
                    <h2 className="text-xl font-black text-[#102033]">
                      지금까지 수강한 과목
                    </h2>
                  </div>
                  <span className="w-fit rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-black text-[#2563EB]">
                    {transcript?.taken_courses.length ?? 0}개 ·{" "}
                    {getCourseCredits(transcript?.taken_courses ?? [])}학점
                  </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {takenCourseGroups.map(([category, courses]) => (
                    <article
                      className="rounded-lg border border-[#E3E8F2] bg-[#F7F9FC] p-4"
                      key={category}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-black text-[#102033]">
                            {category}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-[#6B7280]">
                            {courses.length}개 과목
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#435266] shadow-sm">
                          {getCourseCredits(courses)}학점
                        </span>
                      </div>

                      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                        {courses.map((course) => (
                          <div
                            className="rounded-lg border border-[#EEF2F7] bg-white px-3 py-3 shadow-sm"
                            key={`${course.course_code}-${course.name}-${course.grade}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-[#102033]">
                                  {course.name}
                                </p>
                                <p className="mt-1 text-xs font-bold text-[#6B7280]">
                                  {course.course_code}
                                  {course.sub_area ? ` · ${course.sub_area}` : ""}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="rounded-full bg-[#F3F6FA] px-2 py-1 text-[10px] font-black text-[#435266]">
                                  {course.credits}학점
                                </span>
                                <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-[10px] font-black text-[#2563EB]">
                                  {course.grade}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {plannedCourses.length > 0 ? (
              <section className="rounded-lg border border-[#E3E8F2] bg-white p-6 shadow-[0_14px_36px_rgba(16,32,51,0.06)]">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#0F766E]">
                      Planned Courses
                    </p>
                    <h2 className="text-xl font-black text-[#102033]">
                      현재 학기 반영 과목
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-black text-[#0F766E]">
                    {plannedCourses.length}개
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {plannedCourses.map((course) => (
                    <article
                      className="rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] p-4 shadow-sm"
                      key={`${course.course_code}-${course.name}`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="text-sm font-black text-[#102033]">
                          {course.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-[#F3F6FA] px-2 py-1 text-[10px] font-black text-[#435266]">
                          {course.credits}학점
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#6B7280]">
                        {course.course_code} · {course.area_type}
                        {course.building_name ? ` · ${course.building_name}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
