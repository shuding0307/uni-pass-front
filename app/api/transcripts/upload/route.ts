import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const TRANSCRIPT_UPLOAD_PATH = "/api/transcript/parse";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

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

  const backendUrl = new URL(TRANSCRIPT_UPLOAD_PATH, BACKEND_BASE_URL);
  const backendFormData = new FormData();
  backendFormData.append("file", file, file.name);

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
    });
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        message:
          "백엔드 서버에 연결할 수 없습니다. http://127.0.0.1:8000 실행 상태를 확인해주세요.",
      },
      { status: 502 },
    );
  }
}
