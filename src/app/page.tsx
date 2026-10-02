"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Newspaper,
  Film,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DragDropFeed from "@/components/feed/DragDropFeed";
import TrendingCarousel from "@/components/trending/TrendingCarousel";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import {
  useGetPersonalizedFeedQuery,
  useGetTrendingQuery,
} from "@/store/services/contentApi";
import { useAppSelector } from "@/store";

export default function DashboardPage() {
  const selectedCategories = useAppSelector(
    (state) => state.preferences.categories
  );

  const {
    data: feedData,
    isLoading: isFeedLoading,
    isError: isFeedError,
    refetch: refetchFeed,
  } = useGetPersonalizedFeedQuery({
    categories: selectedCategories,
  });

  const {
    data: trendingData,
    isLoading: isTrendingLoading,
  } = useGetTrendingQuery();

  const items = feedData?.items || [];

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Welcome Section */}
      <WelcomeBanner />

      {/* 2. Trending Highlights Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trending Right Now
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top global headlines, popular cinema, and viral discussions
              </p>
            </div>
          </div>

          <Link
            href="/trending"
            className="group flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>View All Trending</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isTrendingLoading ? (
          <LoadingSkeleton variant="trending" count={4} />
        ) : trendingData ? (
          <div className="space-y-6">
            <TrendingCarousel
              title="Top News Stories"
              subtitle="Breaking and high-engagement headlines"
              items={trendingData.news}
              icon={Newspaper}
              badgeText="Headlines"
            />
            <TrendingCarousel
              title="Popular Movies"
              subtitle="Top-rated and trending on TMDB"
              items={trendingData.movies}
              icon={Film}
              badgeText="Box Office"
            />
            <TrendingCarousel
              title="Trending Social Posts"
              subtitle="Conversations sparking debate and shares"
              items={trendingData.social}
              icon={MessageSquare}
              badgeText="Viral"
            />
          </div>
        ) : null}
      </section>

      {/* 3. Personalized Feed Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Personalized Feed
              </h2>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {items.length} Items
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated for your selected topics. Drag cards using the grip handle
              to personalize your order.
            </p>
          </div>

          <Link
            href="/settings"
            className="self-start sm:self-auto text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Customize Topics
          </Link>
        </div>

        {isFeedLoading && <LoadingSkeleton variant="grid" count={6} />}

        {isFeedError && (
          <ErrorState
            title="Failed to Load Feed"
            message="Could not load your personalized feed from the services. Please check your network or try again."
            onRetry={refetchFeed}
          />
        )}

        {!isFeedLoading && !isFeedError && items.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="Your feed is quiet"
            message="You don't have any items matching your selected categories. Try selecting more topics in Settings."
            actionText="Go to Settings"
            actionHref="/settings"
          />
        )}

        {!isFeedLoading && !isFeedError && items.length > 0 && (
          <DragDropFeed items={items} />
        )}
      </section>
    </div>
  );
}
