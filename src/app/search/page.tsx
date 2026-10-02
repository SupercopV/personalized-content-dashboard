"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  X,
  Newspaper,
  Film,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useSearchAllQuery } from "@/store/services/contentApi";
import { useDebounce } from "@/hooks/useDebounce";

const SUGGESTED_QUERIES = [
  "quantum",
  "dune",
  "marathon",
  "fintech",
  "astronomy",
  "mrna",
  "cyberpunk",
  "circadian",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputVal, 400);
  const [activeTab, setActiveTab] = useState<"all" | "news" | "movies" | "social">("all");

  // Keep URL search param in sync with debounced query
  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.replace(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    } else {
      router.replace("/search");
    }
  }, [debouncedQuery, router]);

  const { data, isLoading, isFetching, isError, refetch } =
    useSearchAllQuery(debouncedQuery, {
      skip: !debouncedQuery.trim(),
    });

  const newsResults = data?.news || [];
  const movieResults = data?.movies || [];
  const socialResults = data?.social || [];
  const allResults = data?.all || [];

  const handleSuggestionClick = (term: string) => {
    setInputVal(term);
  };

  const handleClear = () => {
    setInputVal("");
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl">
      {/* Search Header & Input */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Search Across Everything
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Instant debounced search across verified news articles, TMDB movies, and community posts.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex items-center max-w-2xl">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="search"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a topic, movie title, keyword, or handle..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            autoFocus
            aria-label="Search query"
          />
          {inputVal && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Popular Suggestions Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Suggestions:
          </span>
          {SUGGESTED_QUERIES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSuggestionClick(term)}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition"
            >
              #{term}
            </button>
          ))}
        </div>
      </div>

      {/* When input is empty */}
      {!debouncedQuery.trim() && (
        <EmptyState
          icon={Search}
          title="Start searching"
          message="Enter a search term above or click one of the suggested topics to explore news, movies, and discussions."
        />
      )}

      {/* Loading State */}
      {debouncedQuery.trim() && (isLoading || isFetching) && (
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <LoadingSkeleton variant="grid" count={6} />
        </div>
      )}

      {/* Error State */}
      {debouncedQuery.trim() && isError && (
        <ErrorState
          title="Search Failed"
          message="An error occurred while fetching your search results. Please try again."
          onRetry={refetch}
        />
      )}

      {/* Results State */}
      {debouncedQuery.trim() && !isLoading && !isFetching && !isError && (
        <div className="space-y-6">
          {/* Result Tabs & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Found{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {allResults.length}
              </span>{" "}
              results for &ldquo;{debouncedQuery}&rdquo;
            </div>

            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/60 p-1.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm self-start sm:self-auto">
              {[
                { id: "all", label: `All (${allResults.length})` },
                { id: "news", label: `News (${newsResults.length})` },
                { id: "movies", label: `Movies (${movieResults.length})` },
                { id: "social", label: `Social (${socialResults.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id as "all" | "news" | "movies" | "social")
                  }
                  className={`rounded-xl px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {allResults.length === 0 ? (
            <EmptyState
              icon={Search}
              title={`No results found for "${debouncedQuery}"`}
              message="Try searching for another keyword or check out popular suggestions."
              actionText="Clear Search"
              onAction={handleClear}
            />
          ) : (
            <div>
              {activeTab === "all" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allResults.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              )}

              {activeTab === "news" && (
                <div className="space-y-4">
                  {newsResults.length === 0 ? (
                    <EmptyState
                      icon={Newspaper}
                      title="No news articles found"
                      message="Try another query or view other result tabs."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {newsResults.map((item) => (
                        <ContentCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "movies" && (
                <div className="space-y-4">
                  {movieResults.length === 0 ? (
                    <EmptyState
                      icon={Film}
                      title="No movies found"
                      message="Try another title query or view other result tabs."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {movieResults.map((item) => (
                        <ContentCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-4">
                  {socialResults.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No discussions found"
                      message="Try another keyword or view other result tabs."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {socialResults.map((item) => (
                        <ContentCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="grid" count={6} />}>
      <SearchContent />
    </Suspense>
  );
}
