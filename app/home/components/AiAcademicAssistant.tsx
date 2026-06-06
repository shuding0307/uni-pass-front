"use client";

import {
  BookOpenText,
  Bot,
  CalendarPlus,
  CheckCircle2,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  GraduationRequirement,
  ITranscript,
  RecommendedTimetable,
  RegulationResponse,
  TimetableRecommendResponse,
} from "@/app/types/transcript";

interface Props {
  transcript: ITranscript | null;
}

interface RegulationMatch extends RegulationResponse {
  snippet: string;
  score: number;
}

const DEFAULT_DEPARTMENT = "컴퓨터공학과";
const DEFAULT_SEMESTER = "2026-1";

function normalizeDepartment(value: string | null | undefined) {
  if (!value) {
    return DEFAULT_DEPARTMENT;
  }

  const compactValue = value.replace(/\s/g, "");

  if (compactValue.includes("컴퓨터공학과")) {
    return "컴퓨터공학과";
  }

  return value.replace(/^.+대학\s*/, "").trim() || DEFAULT_DEPARTMENT;
}

function getAdmissionYear(transcript: ITranscript) {
  if (transcript.admission_year) {
    return transcript.admission_year;
  }

  const yearFromId = Number.parseInt(
    transcript.student_id?.slice(0, 4) ?? "",
    10,
  );

  return Number.isNaN(yearFromId) ? 2025 : yearFromId;
}

function normalizeTranscript(transcript: ITranscript) {
  return {
    student_id: transcript.student_id ?? "",
    admission_year: getAdmissionYear(transcript),
    taken_courses: transcript.taken_courses,
    planned_courses: transcript.planned_courses ?? [],
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getPayloadMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const maybePayload = payload as { detail?: unknown; message?: unknown };

    if (typeof maybePayload.message === "string") {
      return maybePayload.message;
    }

    if (typeof maybePayload.detail === "string") {
      return maybePayload.detail;
    }
  }

  return fallback;
}

function buildSnippet(content: string, query: string) {
  const terms = query
    .split(/[\s,，.?!]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
  const firstIndex = terms
    .map((term) => content.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const start = Math.max((firstIndex ?? 0) - 48, 0);
  const snippet = content.slice(start, start + 170).trim();

  return `${start > 0 ? "... " : ""}${snippet}${
    start + 170 < content.length ? " ..." : ""
  }`;
}

function scoreRegulation(regulation: RegulationResponse, query: string) {
  const terms = query
    .toLowerCase()
    .split(/[\s,，.?!]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
  const haystack = `${regulation.title} ${regulation.content} ${
    regulation.source_tag ?? ""
  }`.toLowerCase();

  return terms.reduce(
    (score, term) => score + (haystack.includes(term) ? 1 : 0),
    0,
  );
}

export default function AiAcademicAssistant({ transcript }: Props) {
  const [semester, setSemester] = useState(DEFAULT_SEMESTER);
  const [targetMin, setTargetMin] = useState(15);
  const [targetMax, setTargetMax] = useState(18);
  const [preferNoEarly, setPreferNoEarly] = useState(false);
  const [optimizeWalking, setOptimizeWalking] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedTimetable[]>(
    [],
  );
  const [deficiencyMap, setDeficiencyMap] = useState<Record<string, unknown>>(
    {},
  );
  const [llmUsed, setLlmUsed] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState("");
  const [ruleQuestion, setRuleQuestion] = useState("");
  const [ruleMatches, setRuleMatches] = useState<RegulationMatch[]>([]);
  const [ruleLoading, setRuleLoading] = useState(false);
  const [ruleError, setRuleError] = useState("");

  const department = normalizeDepartment(transcript?.department);
  const canUseAi = Boolean(transcript);
  const deficiencyEntries = useMemo(
    () =>
      Object.entries(deficiencyMap).filter(([, value]) => {
        if (typeof value === "number") {
          return value > 0;
        }

        return value != null && String(value).trim().length > 0;
      }),
    [deficiencyMap],
  );

  const requestRecommendation = async () => {
    if (!transcript) {
      setRecommendError("성적표를 먼저 업로드해야 시간표를 추천할 수 있습니다.");
      return;
    }

    setRecommendLoading(true);
    setRecommendError("");

    try {
      const requirementUrl = new URL(
        "/api/graduation/requirements",
        window.location.origin,
      );
      requirementUrl.searchParams.set(
        "year",
        String(getAdmissionYear(transcript)),
      );
      requirementUrl.searchParams.set("department", department);

      const requirementResponse = await fetch(requirementUrl, {
        cache: "no-store",
      });
      const requirementPayload = (await requirementResponse
        .json()
        .catch(() => null)) as
        | GraduationRequirement
        | { message?: string; detail?: string }
        | null;

      if (!requirementResponse.ok) {
        throw new Error(
          getPayloadMessage(requirementPayload, "졸업 요건을 가져오지 못했습니다."),
        );
      }

      const recommendationResponse = await fetch("/api/timetable/recommend", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          transcript: normalizeTranscript(transcript),
          requirement: requirementPayload,
          semester,
          target_credits_min: targetMin,
          target_credits_max: targetMax,
          prefer_no_early: preferNoEarly,
          optimize_walking: optimizeWalking,
          num_alternatives: 3,
        }),
      });
      const recommendationPayload = (await recommendationResponse
        .json()
        .catch(() => null)) as
        | TimetableRecommendResponse
        | { message?: string; detail?: string }
        | null;

      if (!recommendationResponse.ok) {
        throw new Error(
          getPayloadMessage(
            recommendationPayload,
            "AI 시간표 추천을 가져오지 못했습니다.",
          ),
        );
      }

      const result = recommendationPayload as TimetableRecommendResponse;
      setRecommendations(result.timetables ?? []);
      setDeficiencyMap(result.deficiency_map ?? {});
      setLlmUsed(Boolean(result.llm_used));
    } catch (error) {
      setRecommendations([]);
      setRecommendError(
        getErrorMessage(error, "AI 시간표 추천 중 오류가 발생했습니다."),
      );
    } finally {
      setRecommendLoading(false);
    }
  };

  const searchRegulations = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = ruleQuestion.trim();
    if (!query) {
      setRuleError("검색할 학칙 질문을 입력해주세요.");
      return;
    }

    setRuleLoading(true);
    setRuleError("");

    try {
      const response = await fetch("/api/regulations", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | RegulationResponse[]
        | { message?: string; detail?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          getPayloadMessage(
            payload,
            "학칙 데이터를 가져오지 못했습니다. 백엔드 RAG 데이터베이스와 regulations 테이블 상태를 확인해주세요.",
          ),
        );
      }

      const regulations = Array.isArray(payload) ? payload : [];
      const matches = regulations
        .map((regulation) => ({
          ...regulation,
          score: scoreRegulation(regulation, query),
          snippet: buildSnippet(regulation.content, query),
        }))
        .filter((regulation) => regulation.score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 3);

      setRuleMatches(matches);
    } catch (error) {
      setRuleMatches([]);
      setRuleError(getErrorMessage(error, "학칙 검색 중 오류가 발생했습니다."));
    } finally {
      setRuleLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-[#D9E0EC] bg-white shadow-[0_18px_48px_rgba(16,32,51,0.07)]">
      <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
              AI Academic Assistant
            </p>
            <h2 className="text-xl font-black text-[#102033]">
              AI 시간표 추천 · RAG 학칙 검색
            </h2>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-black text-[#2563EB]">
            <Bot size={14} />
            {canUseAi ? `${department} 분석 준비` : "성적표 업로드 필요"}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="border-b border-[#EEF2F7] p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-[#ECFDF5] text-[#0F766E]">
              <CalendarPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#102033]">
                부족 학점 기반 추천
              </h3>
              <p className="text-xs font-semibold text-[#6B7280]">
                졸업 요건, 기이수 과목, 시간 충돌을 함께 반영합니다.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-black text-[#435266]">학기</span>
              <input
                className="h-11 w-full rounded-lg border border-[#D9E0EC] bg-white px-3 text-sm font-bold text-[#102033] outline-none transition focus:border-[#2563EB]"
                onChange={(event) => setSemester(event.target.value)}
                value={semester}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black text-[#435266]">
                최소 학점
              </span>
              <input
                className="h-11 w-full rounded-lg border border-[#D9E0EC] bg-white px-3 text-sm font-bold text-[#102033] outline-none transition focus:border-[#2563EB]"
                max={24}
                min={1}
                onChange={(event) => setTargetMin(Number(event.target.value))}
                type="number"
                value={targetMin}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black text-[#435266]">
                최대 학점
              </span>
              <input
                className="h-11 w-full rounded-lg border border-[#D9E0EC] bg-white px-3 text-sm font-bold text-[#102033] outline-none transition focus:border-[#2563EB]"
                max={24}
                min={1}
                onChange={(event) => setTargetMax(Number(event.target.value))}
                type="number"
                value={targetMax}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] px-3">
              <input
                checked={preferNoEarly}
                className="size-4 accent-[#2563EB]"
                onChange={(event) => setPreferNoEarly(event.target.checked)}
                type="checkbox"
              />
              <span className="text-sm font-bold text-[#435266]">
                이른 오전 수업 피하기
              </span>
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] px-3">
              <input
                checked={optimizeWalking}
                className="size-4 accent-[#2563EB]"
                onChange={(event) => setOptimizeWalking(event.target.checked)}
                type="checkbox"
              />
              <span className="text-sm font-bold text-[#435266]">
                건물 이동 동선 최적화
              </span>
            </label>
          </div>

          {recommendError ? (
            <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-bold text-[#B91C1C]">
              {recommendError}
            </p>
          ) : null}

          <button
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] text-sm font-black text-white shadow-[0_12px_26px_rgba(15,118,110,0.2)] transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:bg-[#B8BEC9] disabled:shadow-none"
            disabled={!canUseAi || recommendLoading}
            onClick={requestRecommendation}
            type="button"
          >
            {recommendLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                추천 생성 중
              </>
            ) : (
              <>
                <Sparkles size={17} />
                AI 시간표 추천 받기
              </>
            )}
          </button>

          {deficiencyEntries.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {deficiencyEntries.map(([key, value]) => (
                <span
                  className="rounded-full bg-[#F3F6FA] px-3 py-1 text-xs font-black text-[#435266]"
                  key={key}
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            {recommendations.map((timetable, index) => (
              <article
                className="rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] p-4"
                key={`${timetable.total_credits}-${index}`}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-[#102033]">
                      추천안 {index + 1}
                    </h4>
                    <p className="mt-1 text-xs font-bold text-[#6B7280]">
                      총 {timetable.total_credits}학점 ·{" "}
                      {llmUsed ? "LLM 사유 반영" : "규칙 기반 폴백"}
                    </p>
                  </div>
                  <CheckCircle2
                    className="shrink-0 text-[#0F766E]"
                    size={18}
                  />
                </div>
                {timetable.rationale ? (
                  <p className="mb-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#435266]">
                    {timetable.rationale}
                  </p>
                ) : null}
                <div className="space-y-2">
                  {timetable.courses.map((course) => (
                    <div
                      className="rounded-lg border border-[#EEF2F7] bg-white px-3 py-3"
                      key={`${course.course_code}-${course.section ?? ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#102033]">
                            {course.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#6B7280]">
                            {[
                              course.course_code,
                              course.section,
                              course.professor,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2 py-1 text-[10px] font-black text-[#0F766E]">
                          {course.credits}학점
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-[#6B7280]">
                        {[course.schedule, course.building_name]
                          .filter(Boolean)
                          .join(" · ") || "시간 정보 없음"}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <form className="p-5 md:p-6" onSubmit={searchRegulations}>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <BookOpenText size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#102033]">
                RAG 학칙 검색
              </h3>
              <p className="text-xs font-semibold text-[#6B7280]">
                등록된 학칙 산문에서 질문과 가까운 근거를 찾습니다.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              className="h-12 min-w-0 flex-1 rounded-lg border border-[#D9E0EC] bg-white px-4 text-sm font-bold text-[#102033] outline-none transition placeholder:text-[#9AA4B2] focus:border-[#2563EB]"
              onChange={(event) => setRuleQuestion(event.target.value)}
              placeholder="예: 전공필수 과목을 놓치면 어떻게 해야 하나요?"
              value={ruleQuestion}
            />
            <button
              aria-label="학칙 검색"
              className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#2563EB] text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#B8BEC9] disabled:shadow-none"
              disabled={ruleLoading}
              type="submit"
            >
              {ruleLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>

          {ruleError ? (
            <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-bold text-[#B91C1C]">
              {ruleError}
            </p>
          ) : null}

          <div className="mt-5 space-y-3">
            {ruleMatches.map((match) => (
              <article
                className="rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] p-4"
                key={match.id}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-sm font-black text-[#102033]">
                    {match.title}
                  </h4>
                  <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-1 text-[10px] font-black text-[#2563EB]">
                    score {match.score}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-5 text-[#435266]">
                  {match.snippet}
                </p>
                <p className="mt-3 text-[11px] font-bold text-[#6B7280]">
                  {[match.major, match.source_tag, match.effective_date]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </article>
            ))}

            {!ruleLoading && ruleQuestion && ruleMatches.length === 0 && !ruleError ? (
              <p className="rounded-lg border border-[#E3E8F2] bg-[#FBFCFE] px-4 py-3 text-sm font-bold text-[#6B7280]">
                일치하는 학칙 근거가 없습니다. 질문 키워드를 조금 더 구체적으로 입력해주세요.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
