import { NextRequest, NextResponse } from "next/server";
import { MOCK_SOCIAL_POSTS } from "@/data/mockData";
import { ContentCategory, SocialPost } from "@/types/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "") as ContentCategory | "";
  const query = searchParams.get("q") || "";

  let filtered: SocialPost[] = [...MOCK_SOCIAL_POSTS];

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.content.toLowerCase().includes(qLower) ||
        p.username.toLowerCase().includes(qLower) ||
        p.handle.toLowerCase().includes(qLower) ||
        p.hashtags.some((h) => h.toLowerCase().includes(qLower))
    );
  }

  return NextResponse.json({
    posts: filtered,
    totalResults: filtered.length,
    isFallback: false,
  });
}
