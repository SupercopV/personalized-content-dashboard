"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Newspaper,
  Film,
  MessageSquare,
} from "lucide-react";
import TrendingCarousel from "@/components/trending/TrendingCarousel";
import ContentCard from "@/components/cards/ContentCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ErrorState from "@/components/common/ErrorState";
import { useGetTrendingQuery } from "@/store/services/contentApi";

export default function TrendingPage() {
  const { data, isLoading, isError, refetch } = useGetTrendingQuery();
  const [activeTab, setActiveTab] = useState<"all" | "news" | "movies" | "social">("all");

  const newsItems = data?.news || [];
  const movieItems = data?.movies || [];
  const socialItems = data?.social || [];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Trending Content
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time popular stories, top-rated cinematic premieres, and viral discussions.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/60 p-1.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm self-start sm:self-auto">
          {(
            [
              { id: "all", label: "Carousels" },
              { id: "news", label: "News" },
              { id: "movies", label: "Movies" },
              { id: "social", label: "Social" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                activeTab === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-8">
          <LoadingSkeleton variant="trending" count={4} />
          <LoadingSkeleton variant="trending" count={4} />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Could not load trending content"
          message="Failed to fetch trending stories. Please try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && (
        <>
          {activeTab === "all" && (
            <div className="space-y-10">
              <TrendingCarousel
                title="Trending News Headlines"
                subtitle="Top verified articles across technology, business, and world affairs"
                items={newsItems}
                icon={Newspaper}
                badgeText="News"
              />

              <TrendingCarousel
                title="Top Cinema & Movies"
                subtitle="High-rated releases trending globally on TMDB"
                items={movieItems}
                icon={Film}
                badgeText="Cinema"
              />

              <TrendingCarousel
                title="Viral Social Discussions"
                subtitle="Top discussions with heavy likes and replies"
                items={socialItems}
                icon={MessageSquare}
                badgeText="Discussions"
              />
            </div>
          )}

          {activeTab === "news" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-emerald-500" />
                All Trending News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "movies" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Film className="h-5 w-5 text-purple-500" />
                All Popular Movies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movieItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sky-500" />
                All Viral Discussions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
