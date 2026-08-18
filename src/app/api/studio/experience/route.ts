import { NextResponse } from "next/server";
import {
  deleteStudioExperience,
  readStudioExperience,
  upsertStudioExperience,
} from "@/lib/studio/experienceStore";
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

  const items = await readStudioExperience();

  return NextResponse.json({
    items,
  });
}

export async function POST(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  try {
    const input = await request.json();
    const item = await upsertStudioExperience(input);

    return NextResponse.json({
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to save experience item.",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save experience item.",
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
        error: "Missing experience item id.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await deleteStudioExperience(id);

  return NextResponse.json(result);
}