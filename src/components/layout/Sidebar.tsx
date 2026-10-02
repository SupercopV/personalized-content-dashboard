"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Rss,
  TrendingUp,
  Heart,
  Settings,
  Sparkles,
  Layers,
  X,
  Radio,
} from "lucide-react";
import { useAppSelector } from "@/store";
import { useIsMounted } from "@/hooks/useIsMounted";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const selectedCategories = useAppSelector(
    (state) => state.preferences.categories
  );

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Personalized Feed",
      href: "/feed",
      icon: Rss,
    },
    {
      label: "Trending",
      href: "/trending",
      icon: TrendingUp,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      badge: isMounted && favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Brand & Navigation */}
      <div className="space-y-6">
        {/* Brand header for mobile drawer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              NexusFeed
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Nav Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-rose-500 text-white shadow-sm"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Active Topics / Categories Quick Look */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-3 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Topics
            </span>
            <Link
              href="/settings"
              onClick={onClose}
              className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Edit
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5 px-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 capitalize dark:bg-slate-800/70 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3.5 dark:border-indigo-950/50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Multi-Source Feed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
            Real-time NewsAPI + TMDB movies + simulated social streams.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3 w-3" />
            <span>Curated & Ranked</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70 sticky top-16 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl dark:bg-slate-950 transition-transform">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
