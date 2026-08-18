import { NextResponse } from "next/server";
import {
  isStudioAuthorized,
  studioUnauthorizedResponse,
} from "@/lib/studio/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function checkUrl(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    return {
      isReachable: response.ok,
      status: `${response.status} ${response.statusText}`,
    };
  } catch (error) {
    return {
      isReachable: false,
      status: "unreachable",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  const requestUrl = new URL(request.url);
  const liveStatusUrl = `${requestUrl.origin}/api/social/live-status`;
  const restreamerBaseUrl = process.env.RESTREAMER_BASE_URL;
  const restreamerLabel = process.env.RESTREAMER_PUBLIC_LABEL ?? "Restreamer";

  const [portfolioLiveStatus, restreamerStatus] = await Promise.all([
    checkUrl(liveStatusUrl),
    restreamerBaseUrl
      ? checkUrl(restreamerBaseUrl)
      : Promise.resolve({
          isReachable: false,
          status: "not configured",
        }),
  ]);

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    services: [
      {
        id: "portfolio-live-status",
        label: "Portfolio Live Status API",
        ...portfolioLiveStatus,
      },
      {
        id: "restreamer",
        label: restreamerLabel,
        ...restreamerStatus,
      },
    ],
  });
}