import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ContentItem,
  ContentCategory,
  SearchResults,
  NewsArticle,
  Movie,
  SocialPost,
} from "@/types/content";
import {
  newsToContentItem,
  movieToContentItem,
  socialToContentItem,
} from "@/lib/transformers";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["News", "Movies", "Social", "Feed"],
  endpoints: (builder) => ({
    getNews: builder.query<
      { articles: NewsArticle[]; totalResults: number; isFallback: boolean },
      { category?: string; q?: string } | void
    >({
      query: (params) => ({
        url: "api/news",
        params: {
          category: params?.category || "",
          q: params?.q || "",
        },
      }),
      providesTags: ["News"],
    }),

    getMovies: builder.query<
      { movies: Movie[]; totalResults: number; isFallback: boolean },
      { type?: string; q?: string } | void
    >({
      query: (params) => ({
        url: "api/movies",
        params: {
          type: params?.type || "popular",
          q: params?.q || "",
        },
      }),
      providesTags: ["Movies"],
    }),

    getSocialPosts: builder.query<
      { posts: SocialPost[]; totalResults: number; isFallback: boolean },
      { category?: string; q?: string } | void
    >({
      query: (params) => ({
        url: "api/social",
        params: {
          category: params?.category || "",
          q: params?.q || "",
        },
      }),
      providesTags: ["Social"],
    }),

    getPersonalizedFeed: builder.query<
      { items: ContentItem[]; isFallback: boolean },
      { categories: ContentCategory[] }
    >({
      async queryFn(arg, _api, _extraOptions, baseQuery) {
        try {
          const [newsRes, moviesRes, socialRes] = await Promise.all([
            baseQuery({ url: "api/news" }),
            baseQuery({ url: "api/movies?type=trending" }),
            baseQuery({ url: "api/social" }),
          ]);

          const newsData = (newsRes.data as { articles?: NewsArticle[]; isFallback?: boolean }) || {};
          const moviesData = (moviesRes.data as { movies?: Movie[]; isFallback?: boolean }) || {};
          const socialData = (socialRes.data as { posts?: SocialPost[]; isFallback?: boolean }) || {};

          const newsArticles = newsData.articles || [];
          const movies = moviesData.movies || [];
          const socialPosts = socialData.posts || [];

          // Filter by user selected categories
          const selectedSet = new Set(arg.categories);

          const filteredNews = newsArticles
            .filter((art) => selectedSet.has(art.category))
            .map(newsToContentItem);

          const filteredMovies = selectedSet.has("entertainment")
            ? movies.map(movieToContentItem)
            : [];

          const filteredSocial = socialPosts
            .filter((p) => selectedSet.has(p.category))
            .map(socialToContentItem);

          // Interleave contents naturally: News -> Movie -> Social -> News...
          const unified: ContentItem[] = [];
          const maxLength = Math.max(
            filteredNews.length,
            filteredMovies.length,
            filteredSocial.length
          );

          for (let i = 0; i < maxLength; i++) {
            if (i < filteredNews.length) unified.push(filteredNews[i]);
            if (i < filteredMovies.length) unified.push(filteredMovies[i]);
            if (i < filteredSocial.length) unified.push(filteredSocial[i]);
          }

          const isFallback = Boolean(
            newsData.isFallback || moviesData.isFallback || socialData.isFallback
          );

          return { data: { items: unified, isFallback } };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Failed to load feed",
            },
          };
        }
      },
      providesTags: ["Feed"],
    }),

    getTrending: builder.query<
      {
        news: ContentItem[];
        movies: ContentItem[];
        social: ContentItem[];
      },
      void
    >({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        try {
          const [newsRes, moviesRes, socialRes] = await Promise.all([
            baseQuery({ url: "api/news" }),
            baseQuery({ url: "api/movies?type=trending" }),
            baseQuery({ url: "api/social" }),
          ]);

          const newsArticles =
            (newsRes.data as { articles?: NewsArticle[] })?.articles || [];
          const movies =
            (moviesRes.data as { movies?: Movie[] })?.movies || [];
          const socialPosts =
            (socialRes.data as { posts?: SocialPost[] })?.posts || [];

          const newsItems = newsArticles.map(newsToContentItem).slice(0, 5);
          const movieItems = movies.map(movieToContentItem).slice(0, 5);
          const socialItems = socialPosts
            .map(socialToContentItem)
            .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
            .slice(0, 5);

          return {
            data: {
              news: newsItems,
              movies: movieItems,
              social: socialItems,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Failed to load trending",
            },
          };
        }
      },
    }),

    searchAll: builder.query<SearchResults, string>({
      async queryFn(query, _api, _extraOptions, baseQuery) {
        if (!query.trim()) {
          return {
            data: {
              query: "",
              total: 0,
              news: [],
              movies: [],
              social: [],
              all: [],
            },
          };
        }

        try {
          const encoded = encodeURIComponent(query);
          const [newsRes, moviesRes, socialRes] = await Promise.all([
            baseQuery({ url: `api/news?q=${encoded}` }),
            baseQuery({ url: `api/movies?type=search&q=${encoded}` }),
            baseQuery({ url: `api/social?q=${encoded}` }),
          ]);

          const newsArticles =
            (newsRes.data as { articles?: NewsArticle[] })?.articles || [];
          const movies =
            (moviesRes.data as { movies?: Movie[] })?.movies || [];
          const socialPosts =
            (socialRes.data as { posts?: SocialPost[] })?.posts || [];

          const newsItems = newsArticles.map(newsToContentItem);
          const movieItems = movies.map(movieToContentItem);
          const socialItems = socialPosts.map(socialToContentItem);

          const all = [...newsItems, ...movieItems, ...socialItems];

          return {
            data: {
              query,
              total: all.length,
              news: newsItems,
              movies: movieItems,
              social: socialItems,
              all,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Search failed",
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
  useGetPersonalizedFeedQuery,
  useGetTrendingQuery,
  useSearchAllQuery,
} = contentApi;
