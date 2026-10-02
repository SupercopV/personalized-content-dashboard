"use client";

import React from "react";
import Link from "next/link";
import {
  Rss,
  Check,
  Plus,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import DragDropFeed from "@/components/feed/DragDropFeed";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useGetPersonalizedFeedQuery } from "@/store/services/contentApi";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  ALL_CATEGORIES,
  toggleCategory,
} from "@/store/slices/preferencesSlice";
import { ContentCategory } from "@/types/content";
import { formatCategoryLabel } from "@/lib/transformers";

export default function FeedPage() {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(
    (state) => state.preferences.categories
  );

  const {
    data: feedData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetPersonalizedFeedQuery({
    categories: selectedCategories,
  });

  const items = feedData?.items || [];

  const handleToggleCategory = (cat: ContentCategory) => {
    dispatch(toggleCategory(cat));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Rss className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Personalized Feed
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Unified stream of verified news, movie releases, and developer
            discussions tailored to your topics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Manage Preferences</span>
          </Link>
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Filter Active Topics
        </span>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleToggleCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {isSelected ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span>{formatCategoryLabel(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Content Body */}
      {isLoading && <LoadingSkeleton variant="grid" count={9} />}

      {isError && (
        <ErrorState
          title="Feed Loading Error"
          message="We ran into an issue loading your unified feed. Please retry."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          icon={Rss}
          title="No content for chosen topics"
          message="None of your active topics returned results right now. Please select more topics above."
          actionText="Select All Topics"
          onAction={() => {
            // Select all
          }}
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <DragDropFeed items={items} />
      )}
    </div>
  );
}
