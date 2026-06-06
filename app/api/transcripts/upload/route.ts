import { NextResponse } from "next/server";
import { getBackendUrl, readBackendPayload } from "@/app/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRANSCRIPT_UPLOAD_PATH = "/api/transcript/parse";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const timetableFile = formData.get("timetable_file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "PDF 파일이 요청에 포함되지 않았습니다." },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { message: "PDF 파일만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  if (timetableFile != null && !(timetableFile instanceof File)) {
    return NextResponse.json(
      { message: "시간표 PDF 파일 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (timetableFile instanceof File && timetableFile.type !== "application/pdf") {
    return NextResponse.json(
      { message: "시간표는 PDF 파일만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("file", file, file.name);

  if (timetableFile instanceof File) {
    backendFormData.append("timetable_file", timetableFile, timetableFile.name);
  }

  try {
    const response = await fetch(getBackendUrl(TRANSCRIPT_UPLOAD_PATH), {
      method: "POST",
      body: backendFormData,
    });
    const payload = await readBackendPayload(response);

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        message:
          "백엔드 서버에 연결할 수 없습니다. BACKEND_BASE_URL 설정 또는 uni-pass API 상태를 확인해주세요.",
      },
      { status: 502 },
    );
  }
}
