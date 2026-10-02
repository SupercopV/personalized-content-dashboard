import React from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "grid" | "trending" | "banner" | "row";
  count?: number;
  className?: string;
}

export function SkeletonItem({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80 ${className}`}
    />
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3 mb-4">
        <SkeletonItem className="h-6 w-24 rounded-full" />
        <SkeletonItem className="h-8 w-8 rounded-full" />
      </div>
      <SkeletonItem className="h-44 w-full rounded-xl mb-4" />
      <SkeletonItem className="h-6 w-3/4 mb-2" />
      <SkeletonItem className="h-4 w-full mb-2" />
      <SkeletonItem className="h-4 w-5/6 mb-4" />
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
        <SkeletonItem className="h-4 w-28" />
        <SkeletonItem className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function TrendingCardSkeleton() {
  return (
    <div className="w-72 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60">
      <SkeletonItem className="h-36 w-full rounded-xl mb-3" />
      <SkeletonItem className="h-5 w-3/4 mb-2" />
      <SkeletonItem className="h-4 w-1/2 mb-3" />
      <div className="flex justify-between items-center">
        <SkeletonItem className="h-4 w-16" />
        <SkeletonItem className="h-4 w-12" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  variant = "grid",
  count = 6,
  className = "",
}: LoadingSkeletonProps) {
  if (variant === "card") {
    return <ContentCardSkeleton />;
  }

  if (variant === "trending") {
    return (
      <div className={`flex gap-4 overflow-x-auto pb-4 no-scrollbar ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <TrendingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800/80 dark:bg-slate-900/50 ${className}`}>
        <SkeletonItem className="h-8 w-64 mb-3" />
        <SkeletonItem className="h-4 w-96 mb-6" />
        <div className="flex gap-3">
          <SkeletonItem className="h-10 w-28 rounded-xl" />
          <SkeletonItem className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      data-testid="loading-skeleton"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </div>
  );
}
