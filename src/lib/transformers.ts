import {
  NewsArticle,
  Movie,
  SocialPost,
  ContentItem,
  ContentCategory,
} from "@/types/content";

export function formatCategoryLabel(category: ContentCategory): string {
  switch (category) {
    case "technology":
      return "Technology";
    case "sports":
      return "Sports";
    case "business":
      return "Business & Finance";
    case "entertainment":
      return "Entertainment";
    case "science":
      return "Science";
    case "health":
      return "Health & Wellness";
    default:
      return category;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return dateString;
  }
}

export function newsToContentItem(news: NewsArticle): ContentItem {
  return {
    id: news.id,
    type: "news",
    title: news.title,
    description: news.description || "",
    imageUrl: news.urlToImage || undefined,
    category: news.category,
    categoryLabel: formatCategoryLabel(news.category),
    publishedAt: news.publishedAt,
    meta: [
      { label: "Source", value: news.source.name },
      { label: "Author", value: news.author || "Editorial Staff" },
      { label: "Time", value: formatRelativeTime(news.publishedAt) },
    ],
    ctaText: "Read More",
    ctaLink: news.url,
    rawItem: news,
    trendingScore: 85,
  };
}

export function movieToContentItem(movie: Movie): ContentItem {
  return {
    id: `movie-${movie.id}`,
    type: "movie",
    title: movie.title,
    description: movie.overview,
    imageUrl: movie.posterPath || undefined,
    category: "entertainment",
    categoryLabel: "Movies & Cinema",
    publishedAt: movie.releaseDate,
    meta: [
      { label: "Rating", value: `★ ${movie.rating.toFixed(1)}/10` },
      { label: "Votes", value: `${movie.voteCount.toLocaleString()}` },
      { label: "Release", value: movie.releaseDate },
    ],
    ctaText: "View Details",
    ctaLink: undefined,
    rawItem: movie,
    trendingScore: Math.round(movie.rating * 10),
  };
}

export function socialToContentItem(post: SocialPost): ContentItem {
  return {
    id: post.id,
    type: "social",
    title: `${post.username} (@${post.handle})`,
    description: post.content,
    imageUrl: post.mediaUrl || undefined,
    category: post.category,
    categoryLabel: formatCategoryLabel(post.category),
    publishedAt: post.timestamp,
    meta: [
      { label: "Likes", value: post.likes.toLocaleString() },
      { label: "Comments", value: post.commentsCount.toString() },
      { label: "Posted", value: formatRelativeTime(post.timestamp) },
    ],
    ctaText: "View Post",
    ctaLink: undefined,
    rawItem: post,
    trendingScore: Math.min(100, Math.round(post.likes / 30)),
  };
}
