import { NextResponse } from "next/server";
import { getBackendUrl, readBackendPayload } from "@/app/lib/backend";
import { fallbackRegulations } from "@/app/home/data/regulations-seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGULATIONS_PATH = "/api/regulations";
const REGULATIONS_TIMEOUT_MS = 8000;

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
      signal: AbortSignal.timeout(REGULATIONS_TIMEOUT_MS),
    });
    const payload = await readBackendPayload(response);

    if (!response.ok) {
      return NextResponse.json(fallbackRegulations);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(fallbackRegulations);
    }

    return NextResponse.json(fallbackRegulations);
  }
}
