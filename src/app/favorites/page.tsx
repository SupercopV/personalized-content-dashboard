"use client";

import React, { useState, useMemo } from "react";
import {
  Heart,
  Trash2,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ContentModal from "@/components/common/ContentModal";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeFavorite,
  clearFavorites,
} from "@/store/slices/favoritesSlice";
import { ContentItem, ContentType, FavoriteItem } from "@/types/content";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [activeFilter, setActiveFilter] = useState<"all" | ContentType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const matchesType =
        activeFilter === "all" ? true : item.type === activeFilter;
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [favorites, activeFilter, searchQuery]);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFavorite(id));
  };

  const handleClearAll = () => {
    dispatch(clearFavorites());
    setShowClearConfirm(false);
  };

  const openItemDetails = (fav: FavoriteItem) => {
    const contentItem: ContentItem = {
      id: fav.id,
      type: fav.type,
      title: fav.title,
      description: fav.description,
      imageUrl: fav.imageUrl,
      category: fav.category,
      categoryLabel: fav.categoryLabel,
      publishedAt: fav.publishedAt,
      meta: fav.meta || [],
      ctaText: fav.ctaText,
      ctaLink: fav.ctaLink,
      rawItem: {
        id: fav.id,
        title: fav.title,
        description: fav.description,
        url: fav.ctaLink || "",
        publishedAt: fav.publishedAt,
        source: { id: null, name: "Saved Item" },
        category: fav.category,
      },
    };
    setSelectedItem(contentItem);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Your Favorites
            </h1>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              {favorites.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Articles, cinema titles, and social discussions saved for offline or future review.
          </p>
        </div>

        {favorites.length > 0 && (
          <div>
            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition active:scale-95 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          message="When you discover articles, films, or posts you enjoy, click the heart icon on any card to save them here."
          actionText="Explore Feed"
          actionHref="/feed"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls: Type tabs & Local Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter:
              </span>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "news", label: "News" },
                  { id: "movie", label: "Movies" },
                  { id: "social", label: "Social" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                    activeFilter === tab.id
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved items..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Favorites Grid */}
          {filteredFavorites.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matches found"
              message="No favorites matched your search criteria."
              actionText="Reset Search"
              onAction={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openItemDetails(item)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80 cursor-pointer"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.type} • {item.categoryLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(item.id, e)}
                      aria-label="Remove favorite"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Media (if exists) */}
                  {item.imageUrl && (
                    <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 dark:text-slate-400 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-400">
                        Saved {new Date(item.favoritedAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ContentModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
