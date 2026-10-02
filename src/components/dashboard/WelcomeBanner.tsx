"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, SlidersHorizontal, ArrowRight, Heart } from "lucide-react";
import { useAppSelector } from "@/store";

export default function WelcomeBanner() {
  const userName = useAppSelector((state) => state.preferences.userName);
  const categories = useAppSelector((state) => state.preferences.categories);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:border-indigo-500/20">
      {/* Background ambient glow shapes */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{formattedDate} • Live Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {greeting}, {userName}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your personalized feed is active across{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {categories.length} categories
            </span>
            . Reorder cards by dragging, explore trending stories, or save items
            for later.
          </p>

          {/* Quick topic tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((c) => (
              <span
                key={c}
                className="rounded-lg bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-md dark:bg-slate-800/70 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 capitalize"
              >
                #{c}
              </span>
            ))}
          </div>
        </div>

        {/* Quick CTA actions */}
        <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
          <Link
            href="/feed"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Full Feed</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white transition dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
            <span>Preferences</span>
          </Link>

          {favoritesCount > 0 && (
            <Link
              href="/favorites"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200/60 bg-rose-50/80 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400 active:scale-95"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500" />
              <span>Favorites ({favoritesCount})</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
