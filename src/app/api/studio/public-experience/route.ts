import { NextResponse } from "next/server";
import { readStudioExperience } from "@/lib/studio/experienceStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeLab = url.searchParams.get("lab") === "true";

  const items = await readStudioExperience();

  const publicItems = items.filter((item) => {
    if (item.visibility === "draft") {
      return false;
    }

    if (item.visibility === "lab") {
      return includeLab;
    }

    return item.visibility === "public";
  });

  return NextResponse.json({
    items: publicItems,
  });
}