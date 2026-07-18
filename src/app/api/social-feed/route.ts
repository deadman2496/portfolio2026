import { NextResponse } from "next/server";
import { selectedSocialPosts } from "@/data/socialPosts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    source: "static-selected-posts",
    posts: selectedSocialPosts.filter((post) => !post.isHiddenFeature),
  });
}