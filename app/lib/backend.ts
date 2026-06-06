export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "https://uni-pass-seven.vercel.app";

export function getBackendUrl(path: string) {
  return new URL(path, BACKEND_BASE_URL);
}

export async function readBackendPayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return { message: await response.text() };
}
