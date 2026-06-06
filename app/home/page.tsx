"use client";

import { useState } from "react";
import AlertBanner from "./components/AlertBanner";
import AiInsightPanel from "./components/AiInsightPanel";
import AbeekPanel from "./components/AbeekPanel";
import InfoBlock from "./components/InfoBlock";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TopBar from "./components/TopBar";
import UploadTranscript from "./components/UploadTranscript";
import { creditStats as initialCreditStats } from "./data/dashboard-data";
import {
  GraduationEvaluation,
  GraduationRequirement,
  ITranscript,
} from "../types/transcript";

const DEFAULT_DEPARTMENT = "컴퓨터공학과";
const DEFAULT_YEAR = "2025";

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

function getPrimaryTrack(requirement: GraduationRequirement | null) {
  if (!requirement) {
    return null;
  }

  return requirement.tracks["기본전공"] ?? Object.values(requirement.tracks)[0] ?? null;
}

function getEvaluationText(evaluation: GraduationEvaluation | null) {
  if (!evaluation) {
    return "성적표를 업로드하면 백엔드 졸업 평가 결과가 표시됩니다.";
  }

  const possibleResult =
    evaluation.graduation_possible ??
    evaluation.is_graduatable ??
    evaluation.can_graduate ??
    evaluation.result;
  const message =
    evaluation.message ??
    evaluation.summary ??
    evaluation.reason ??
    "백엔드 졸업 평가가 완료되었습니다.";

  if (typeof possibleResult === "boolean") {
    return possibleResult
      ? "현재 기준으로 졸업 가능성이 있습니다."
      : "현재 기준으로 추가 이수 또는 확인이 필요한 항목이 있습니다.";
  }

  return typeof message === "string" ? message : "백엔드 졸업 평가가 완료되었습니다.";
}

function getEvaluationInsights(
  evaluation: GraduationEvaluation | null,
  requirement: GraduationRequirement | null,
) {
  const primaryTrack = getPrimaryTrack(requirement);

  return [
    {
      label: "졸업 평가",
      value: evaluation ? "완료" : "대기",
      description: getEvaluationText(evaluation),
    },
    {
      label: "적용 요건",
      value: requirement?.department ?? DEFAULT_DEPARTMENT,
      description: requirement
        ? `총 ${requirement.total_credits}학점, 전공계 ${primaryTrack?.전공계 ?? 0}학점 기준으로 계산했습니다.`
        : "성적표의 입학년도와 학과 기준으로 졸업 요건을 조회합니다.",
    },
  ];
}

export default function Home() {
  const [transcript, setTranscript] = useState<ITranscript | null>(null);
  const [requirement, setRequirement] = useState<GraduationRequirement | null>(
    null,
  );
  const [evaluation, setEvaluation] = useState<GraduationEvaluation | null>(null);
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleTranscriptParsed = async (parsedTranscript: ITranscript) => {
    setTranscript(parsedTranscript);
    setRequirement(null);
    setEvaluation(null);
    setApiMessage("");

    const params = new URLSearchParams({
      year: parsedTranscript.admission_year?.toString() ?? DEFAULT_YEAR,
      department: parsedTranscript.department ?? DEFAULT_DEPARTMENT,
    });

    const requirementsResponse = await fetch(
      `/api/graduation/requirements?${params.toString()}`,
    );
    const requirementsData = await requirementsResponse.json().catch(() => null);

    if (!requirementsResponse.ok) {
      throw new Error(requirementsData?.message ?? "졸업 요건 조회에 실패했습니다.");
    }

    setRequirement(requirementsData);

    const evaluateResponse = await fetch("/api/graduation/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: {
          student_id: parsedTranscript.student_id ?? "",
          admission_year:
            parsedTranscript.admission_year ?? Number.parseInt(DEFAULT_YEAR, 10),
          taken_courses: parsedTranscript.taken_courses,
          planned_courses: [],
        },
        requirement: requirementsData,
      }),
    });
    const evaluationData = await evaluateResponse.json().catch(() => null);

    if (!evaluateResponse.ok) {
      setApiMessage(
        evaluationData?.message ??
          "졸업 평가 API 호출에 실패해 성적표와 요건만 표시합니다.",
      );
      return;
    }

    setEvaluation(evaluationData);
  };

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
                  id={transcript.student_id ?? ""}
                  department={transcript.department ?? DEFAULT_DEPARTMENT}
                />
              </div>
            )}
          </section>

          <div className="space-y-7">
            <UploadTranscript
              setLoading={setLoading}
              onTranscriptParsed={handleTranscriptParsed}
            />
            {apiMessage ? <AlertBanner message={apiMessage} /> : null}

            {transcript && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {creditStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </section>
            )}

            <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
              {transcript ? <AbeekPanel /> : null}
              <div className="xl:sticky xl:top-24">
                <AiInsightPanel
                  insights={getEvaluationInsights(evaluation, requirement)}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
