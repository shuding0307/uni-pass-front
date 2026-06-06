"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { CalendarDays, FileText, Loader2, Upload, X } from "lucide-react";
import { ITranscript, PlannedCourse } from "@/app/types/transcript";

type UploadState = "idle" | "uploading" | "success" | "error";
type FileKind = "transcript" | "timetable";

interface UploadResult {
  plannedCourses: PlannedCourse[];
  transcript: ITranscript;
}

interface Props {
  setLoading: (loading: boolean) => void;
  onUploadComplete: (result: UploadResult) => void;
}

function getFileSize(file: File | null) {
  if (!file) {
    return "";
  }

  return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadAcademicFiles({
  setLoading,
  onUploadComplete,
}: Props) {
  const transcriptInputRef = useRef<HTMLInputElement>(null);
  const timetableInputRef = useRef<HTMLInputElement>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("");

  const transcriptFileSize = useMemo(
    () => getFileSize(transcriptFile),
    [transcriptFile],
  );
  const timetableFileSize = useMemo(
    () => getFileSize(timetableFile),
    [timetableFile],
  );

  const handleFileChange =
    (kind: FileKind) => (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null;

      setState("idle");
      setMessage("");

      if (!selectedFile) {
        if (kind === "transcript") {
          setTranscriptFile(null);
        } else {
          setTimetableFile(null);
        }
        return;
      }

      if (selectedFile.type !== "application/pdf") {
        if (kind === "transcript") {
          setTranscriptFile(null);
        } else {
          setTimetableFile(null);
        }
        setState("error");
        setMessage("PDF 파일만 업로드할 수 있습니다.");
        event.target.value = "";
        return;
      }

      if (kind === "transcript") {
        setTranscriptFile(selectedFile);
      } else {
        setTimetableFile(selectedFile);
      }
    };

  const handleClear = (kind: FileKind) => {
    setState("idle");
    setMessage("");

    if (kind === "transcript") {
      setTranscriptFile(null);
      if (transcriptInputRef.current) {
        transcriptInputRef.current.value = "";
      }
      return;
    }

    setTimetableFile(null);
    if (timetableInputRef.current) {
      timetableInputRef.current.value = "";
    }
  };

  const parseTranscript = async (file: File, timetable?: File | null) => {
    const formData = new FormData();
    formData.append("file", file);

    if (timetable) {
      formData.append("timetable_file", timetable);
    }

    const response = await fetch("/api/transcripts/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message ?? "성적표 업로드에 실패했습니다.");
    }

    return data as ITranscript;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!transcriptFile) {
      setState("error");
      setMessage("성적표 PDF를 선택해주세요.");
      return;
    }

    setState("uploading");
    setMessage("");

    try {
      setLoading(true);
      const parsedTranscript = await parseTranscript(
        transcriptFile,
        timetableFile,
      );
      const parsedCourses = parsedTranscript.planned_courses ?? [];

      onUploadComplete({
        plannedCourses: parsedCourses,
        transcript: parsedTranscript,
      });

      setState("success");
      setMessage(
        timetableFile
          ? "성적표와 시간표 분석이 완료되었습니다."
          : "성적표 분석이 완료되었습니다.",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "파일 업로드 중 오류가 발생했습니다.";

      setState("error");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fileRows = [
    {
      accentClassName: "text-[#2563EB]",
      bgClassName: "bg-[#EEF2FF]",
      file: transcriptFile,
      fileSize: transcriptFileSize,
      inputRef: transcriptInputRef,
      kind: "transcript" as const,
      label: "성적표 PDF",
      title: "성적표",
    },
    {
      accentClassName: "text-[#0F766E]",
      bgClassName: "bg-[#ECFDF5]",
      file: timetableFile,
      fileSize: timetableFileSize,
      inputRef: timetableInputRef,
      kind: "timetable" as const,
      label: "시간표 PDF (선택)",
      title: "시간표",
    },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-[#D9E0EC] bg-white shadow-[0_18px_48px_rgba(16,32,51,0.08)]">
      <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
              Academic Files
            </p>
            <h2 className="text-xl font-black text-[#102033]">
              성적표 · 시간표 업로드
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#6B7280]">
            성적표는 필수, 시간표는 선택입니다.
          </p>
        </div>
      </div>

      <form className="space-y-4 p-5 md:p-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          {fileRows.map((item) => (
            <div className="space-y-3" key={item.kind}>
              <label className="group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#B7C2D2] bg-[#F7F9FC] px-5 py-7 text-center transition hover:border-[#2563EB] hover:bg-[#EFF6FF]">
                <input
                  ref={item.inputRef}
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={handleFileChange(item.kind)}
                  type="file"
                />
                <div
                  className={[
                    "mb-3 grid size-12 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-[#E3E8F2] transition group-hover:scale-105",
                    item.accentClassName,
                  ].join(" ")}
                >
                  {item.kind === "transcript" ? (
                    <Upload size={22} />
                  ) : (
                    <CalendarDays size={22} />
                  )}
                </div>
                <strong className="text-sm font-black text-[#102033]">
                  {item.label} 선택
                </strong>
                <span className="mt-1 text-xs font-semibold text-[#6B7280]">
                  클릭해서 {item.title} 파일을 선택해주세요.
                </span>
              </label>

              {item.file ? (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E3E8F2] bg-white px-4 py-3 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={[
                        "grid size-10 shrink-0 place-items-center rounded-lg",
                        item.bgClassName,
                        item.accentClassName,
                      ].join(" ")}
                    >
                      <FileText size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#102033]">
                        {item.file.name}
                      </p>
                      <p className="text-xs font-semibold text-[#6B7280]">
                        {item.fileSize}
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label={`${item.title} 파일 제거`}
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-[#6B7280] transition hover:bg-[#F3F6FA] hover:text-[#102033]"
                    onClick={() => handleClear(item.kind)}
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {message ? (
          <p
            className={[
              "rounded-lg border px-4 py-3 text-sm font-bold",
              state === "success"
                ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]"
                : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
            ].join(" ")}
          >
            {message}
          </p>
        ) : null}

        <button
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-black text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#B8BEC9] disabled:shadow-none"
          disabled={!transcriptFile || state === "uploading"}
          type="submit"
        >
          {state === "uploading" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              분석 중
            </>
          ) : (
            <>
              <Upload size={17} />
              파일 업로드 및 분석 실행
            </>
          )}
        </button>
      </form>
    </section>
  );
}
