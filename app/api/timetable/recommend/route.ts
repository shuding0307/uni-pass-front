import { NextResponse } from "next/server";
import { getBackendUrl, readBackendPayload } from "@/app/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMETABLE_RECOMMEND_PATH = "/api/timetable/recommend";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "시간표 추천 요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(getBackendUrl(TIMETABLE_RECOMMEND_PATH), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await readBackendPayload(response);

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "AI 시간표 추천 API에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}
