"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LucideIcon, Sparkles } from "lucide-react";
import { ContentItem } from "@/types/content";
import ContentModal from "@/components/common/ContentModal";
import FavoriteButton from "@/components/common/FavoriteButton";

interface TrendingCarouselProps {
  title: string;
  subtitle?: string;
  items: ContentItem[];
  icon: LucideIcon;
  badgeText?: string;
}

export default function TrendingCarousel({
  title,
  subtitle,
  items,
  icon: Icon,
  badgeText = "Trending",
}: TrendingCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-2.5 w-2.5" />
                {badgeText}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Carousel Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative w-72 shrink-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80"
          >
            {/* Image Preview */}
            <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                }
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton item={item} size="sm" />
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  {item.categoryLabel}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer text-sm font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 transition dark:text-white dark:hover:text-indigo-400 mb-1"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 dark:text-slate-400 mb-3">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{item.meta[0]?.value || "Trending"}</span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {item.ctaText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ContentModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
