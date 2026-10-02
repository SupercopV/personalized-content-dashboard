"use client";

import React, { useState } from "react";
import { ExternalLink, Clock, Newspaper } from "lucide-react";
import { ContentItem } from "@/types/content";
import FavoriteButton from "@/components/common/FavoriteButton";
import ContentModal from "@/components/common/ContentModal";

interface NewsCardProps {
  item: ContentItem;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export default function NewsCard({
  item,
  dragHandleProps,
  isDragging = false,
}: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 dark:bg-slate-900/90 ${
          isDragging
            ? "border-indigo-500 shadow-2xl opacity-90 scale-[1.02] dark:border-indigo-400"
            : "border-slate-200/80 hover:border-slate-300 hover:shadow-xl dark:border-slate-800/80 dark:hover:border-slate-700/80"
        }`}
        data-testid={`card-${item.id}`}
      >
        {/* Card Header: Type Badge & Favorite Button */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Newspaper className="h-3.5 w-3.5" />
              News • {item.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FavoriteButton item={item} size="sm" />
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:cursor-grabbing rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Drag to reorder"
                aria-label="Drag to reorder card"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageError || !item.imageUrl ? fallbackImage : item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-base font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition dark:text-white dark:hover:text-indigo-400 mb-2 leading-snug"
            >
              {item.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-3 dark:text-slate-400 mb-4 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Meta Details */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                {item.meta.find((m) => m.label === "Source")?.value || "Global News"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.meta.find((m) => m.label === "Time")?.value || "Today"}
              </span>
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 rounded-xl bg-slate-100 px-3.5 py-2 text-center text-xs font-semibold text-slate-800 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-95"
              >
                Quick Preview
              </button>
              {item.ctaLink && (
                <a
                  href={item.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-95"
                >
                  <span>Read</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContentModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
