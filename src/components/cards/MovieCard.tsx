"use client";

import React, { useState } from "react";
import { Film, Star, Calendar } from "lucide-react";
import { ContentItem, Movie } from "@/types/content";
import FavoriteButton from "@/components/common/FavoriteButton";
import ContentModal from "@/components/common/ContentModal";

interface MovieCardProps {
  item: ContentItem;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export default function MovieCard({
  item,
  dragHandleProps,
  isDragging = false,
}: MovieCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackPoster =
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80";

  const movie = item.rawItem as Movie;
  const rating = movie?.rating || 8.0;

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 dark:bg-slate-900/90 ${
          isDragging
            ? "border-purple-500 shadow-2xl opacity-90 scale-[1.02] dark:border-purple-400"
            : "border-slate-200/80 hover:border-slate-300 hover:shadow-xl dark:border-slate-800/80 dark:hover:border-slate-700/80"
        }`}
        data-testid={`card-${item.id}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
            <Film className="h-3.5 w-3.5" />
            Movie • Cinema
          </span>

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

        {/* Poster with Rating Overlay */}
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageError || !item.imageUrl ? fallbackPoster : item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md shadow-md">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{typeof rating === "number" ? rating.toFixed(1) : rating}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-base font-bold text-slate-900 line-clamp-1 hover:text-purple-600 transition dark:text-white dark:hover:text-purple-400 mb-2"
            >
              {item.title}
            </h3>

            {/* Genres */}
            {movie?.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {movie.genres.slice(0, 3).map((g, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400 mb-4 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {movie?.releaseDate ? movie.releaseDate.split("-")[0] : "Recent"}
              </span>
              <span>{movie?.voteCount ? `${movie.voteCount.toLocaleString()} votes` : ""}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl bg-purple-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-purple-500 transition active:scale-95"
            >
              View Details
            </button>
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
