import { NextResponse } from "next/server";
import {
  deleteStudioContent,
  readStudioContent,
  upsertStudioContent,
} from "@/lib/studio/contentStore";
import {
  isStudioAuthorized,
  studioUnauthorizedResponse,
} from "@/lib/studio/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  const items = await readStudioContent();

  return NextResponse.json({
    items,
  });
}

export async function POST(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const item = await upsertStudioContent(body);

    return NextResponse.json({
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to save Studio content.",
        message: error instanceof Error ? error.message : "Unknown error.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        error: "Missing content id.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await deleteStudioContent(id);

  return NextResponse.json(result);
}