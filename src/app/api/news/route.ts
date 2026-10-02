import { NextRequest, NextResponse } from "next/server";
import { MOCK_NEWS_ARTICLES } from "@/data/mockData";
import { NewsArticle, ContentCategory } from "@/types/content";

interface NewsApiResponseArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "") as ContentCategory | "";
  const query = searchParams.get("q") || "";

  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey && apiKey !== "your_news_api_key_here") {
    try {
      let newsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
      if (category) {
        newsUrl += `&category=${category === "business" ? "business" : category}`;
      }
      if (query) {
        newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
      }

      const response = await fetch(newsUrl, {
        next: { revalidate: 300 }, // Cache 5 min
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "ok" && Array.isArray(data.articles) && data.articles.length > 0) {
          const articles: NewsArticle[] = data.articles
            .filter((art: NewsApiResponseArticle) => art.title && art.title !== "[Removed]")
            .map((art: NewsApiResponseArticle, idx: number) => ({
              id: `api-news-${Date.now()}-${idx}`,
              title: art.title,
              description: art.description || "",
              content: art.content || undefined,
              url: art.url,
              urlToImage: art.urlToImage,
              publishedAt: art.publishedAt || new Date().toISOString(),
              source: {
                id: art.source?.id || null,
                name: art.source?.name || "Global News",
              },
              author: art.author,
              category: (category || "technology") as ContentCategory,
            }));

          return NextResponse.json({
            articles,
            totalResults: data.totalResults || articles.length,
            isFallback: false,
          });
        }
      }
    } catch {
      // Fallback gracefully on network/rate-limit error
    }
  }

  // Graceful realistic fallback
  let filtered = [...MOCK_NEWS_ARTICLES];
  if (category) {
    filtered = filtered.filter((art) => art.category === category);
  }
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (art) =>
        art.title.toLowerCase().includes(qLower) ||
        art.description.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    articles: filtered,
    totalResults: filtered.length,
    isFallback: true,
  });
}
