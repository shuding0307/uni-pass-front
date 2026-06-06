import { NextResponse } from "next/server";
import { getBackendUrl, readBackendPayload } from "@/app/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRADUATION_EVALUATE_PATH = "/api/graduation/evaluate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: "졸업 평가 요청 데이터가 없습니다." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(getBackendUrl(GRADUATION_EVALUATE_PATH), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await readBackendPayload(response);

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "졸업 평가 API에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}
