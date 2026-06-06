import { NextResponse } from "next/server";
import { getBackendUrl, readBackendPayload } from "@/app/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGULATIONS_PATH = "/api/regulations";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const backendUrl = getBackendUrl(REGULATIONS_PATH);

  requestUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      cache: "no-store",
    });
    const payload = await readBackendPayload(response);

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "RAG 학칙 데이터 API에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}
