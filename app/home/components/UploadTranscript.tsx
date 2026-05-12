"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { ITranscript } from "@/app/types/transcript";

type UploadState = "idle" | "uploading" | "success" | "error";

interface Props {
  setLoading: (loading: boolean) => void;
  setTranscript: (Transcript: ITranscript) => void;
}

export default function UploadTranscript({ setLoading, setTranscript }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("");

  const fileSize = useMemo(() => {
    if (!file) {
      return "";
    }

    return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }, [file]);

  useEffect(() => {
    if (state === "success") {
      console.log("성적표 업로드 성공, 학생 정보 가져오기 시작");
      setLoading(false);
    }
  }, [state]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setState("idle");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setState("error");
      setMessage("PDF 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setState("idle");
    setMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setState("error");
      setMessage("업로드할 PDF 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setState("uploading");
    setMessage("");

    try {
      setLoading(true);
      const response = await fetch("/api/transcripts/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message ?? "성적표 업로드에 실패했습니다.");
      }
      console.log("백엔드 응답 데이터:", data);
      setState("success");
      setMessage("성적표가 백엔드로 전송되었습니다.");
      setTranscript(data);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "성적표 업로드 중 오류가 발생했습니다.",
      );
    }
    setLoading(false);
  };

  return (
    <section className="rounded-lg border border-[#D8DCE6] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
            Transcript
          </p>
          <h2 className="text-xl font-black text-[#001E40]">성적표 업로드</h2>
        </div>
        <p className="text-sm font-semibold text-[#737780]">
          PDF 파일을 업로드하면 졸업 요건 분석을 시작합니다.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#B8BEC9] bg-[#F9F9FE] px-5 py-7 text-center transition-colors hover:border-[#2563EB] hover:bg-[#EEF2FF]">
          <input
            ref={inputRef}
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleFileChange}
            type="file"
          />
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-white text-[#2563EB] shadow-sm">
            <Upload size={22} />
          </div>
          <strong className="text-sm font-black text-[#001E40]">
            PDF 파일 선택
          </strong>
          <span className="mt-1 text-xs font-semibold text-[#737780]">
            클릭해서 성적표 PDF를 선택해주세요.
          </span>
        </label>

        {file ? (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E4E7EF] bg-white px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EEF2FF] text-[#2563EB]">
                <FileText size={19} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#001E40]">
                  {file.name}
                </p>
                <p className="text-xs font-semibold text-[#737780]">
                  {fileSize}
                </p>
              </div>
            </div>
            <button
              aria-label="선택한 파일 제거"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-[#737780] transition-colors hover:bg-[#F3F4F8] hover:text-[#001E40]"
              onClick={handleClear}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        ) : null}

        {message ? (
          <p
            className={[
              "rounded-lg px-4 py-3 text-sm font-bold",
              state === "success"
                ? "bg-[#F0FDF4] text-[#15803D]"
                : "bg-[#FEF2F2] text-[#B91C1C]",
            ].join(" ")}
          >
            {message}
          </p>
        ) : null}

        <button
          className="flex h-11 w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-[#2563EB] text-sm font-black text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#B8BEC9]"
          disabled={!file || state === "uploading"}
          type="submit"
        >
          {state === "uploading" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              업로드 중
            </>
          ) : (
            "백엔드로 전송"
          )}
        </button>
      </form>
    </section>
  );
}
