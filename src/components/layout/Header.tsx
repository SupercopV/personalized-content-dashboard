"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Layers,
  Sparkles,
  Sliders,
  Heart,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/store";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: HeaderProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const userName = useAppSelector((state) => state.preferences.userName);

  // Navigate to search page when debounced query is ready
  useEffect(() => {
    if (debouncedSearch.trim().length > 1) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              NexusFeed
              <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                PRO
              </span>
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              Personalized Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Debounced Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative mx-4 flex-1 max-w-md hidden md:block"
        role="search"
      >
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news, movies, discussions..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-9 text-xs sm:text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
            aria-label="Global content search"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Right Controls: Theme Toggle & User Area */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button (routes to /search) */}
        <Link
          href="/search"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
        >
          <Search className="h-4 w-4" />
        </Link>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white active:scale-95"
          data-testid="theme-toggle"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Favorites quick shortcut */}
        <Link
          href="/favorites"
          aria-label="Favorites"
          className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-rose-500 transition dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-400 active:scale-95"
        >
          <Heart className="h-4 w-4" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {favoritesCount}
            </span>
          )}
        </Link>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-expanded={showProfileMenu}
            aria-label="User profile menu"
            className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 pr-3 shadow-sm hover:border-slate-300 transition dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt={userName}
              className="h-7 w-7 rounded-xl object-cover ring-1 ring-indigo-500/30"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
              {userName}
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  SDE Intern • Frontend
                </p>
              </div>

              <Link
                href="/favorites"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                <span>Favorites ({favoritesCount})</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                <Sliders className="h-3.5 w-3.5 text-indigo-500" />
                <span>Preferences & Settings</span>
              </Link>

              <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  <span>Interactive Live Demo</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
