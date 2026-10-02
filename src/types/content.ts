export type ContentCategory =
  | "technology"
  | "sports"
  | "business"
  | "entertainment"
  | "science"
  | "health";

export type ContentType = "news" | "movie" | "social";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author?: string | null;
  category: ContentCategory;
}

export interface Movie {
  id: number | string;
  title: string;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  rating: number;
  voteCount: number;
  releaseDate: string;
  genres: string[];
  category: "entertainment";
}

export interface SocialComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  time: string;
}

export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  mediaUrl?: string | null;
  hashtags: string[];
  timestamp: string;
  likes: number;
  commentsCount: number;
  category: ContentCategory;
  verified?: boolean;
  comments?: SocialComment[];
}

export interface ContentMeta {
  label: string;
  value: string | number;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl?: string;
  category: ContentCategory;
  categoryLabel: string;
  publishedAt: string;
  meta: ContentMeta[];
  ctaText: string;
  ctaLink?: string;
  rawItem: NewsArticle | Movie | SocialPost;
  trendingScore?: number;
}

export interface UserPreferences {
  categories: ContentCategory[];
  theme: "light" | "dark" | "system";
  sortBy: "drag" | "latest" | "popular";
  userName: string;
  isDemoMode: boolean;
}

export interface FavoriteItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl?: string;
  category: ContentCategory;
  categoryLabel: string;
  publishedAt: string;
  favoritedAt: string;
  ctaText: string;
  ctaLink?: string;
  meta?: ContentMeta[];
}

export interface FeedOrder {
  items: string[];
  lastUpdated: string;
}

export interface SearchResults {
  query: string;
  total: number;
  news: ContentItem[];
  movies: ContentItem[];
  social: ContentItem[];
  all: ContentItem[];
}
