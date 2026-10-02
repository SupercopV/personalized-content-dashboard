"use client";

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, CheckCircle, Share2 } from "lucide-react";
import { ContentItem, SocialPost } from "@/types/content";
import FavoriteButton from "@/components/common/FavoriteButton";
import ContentModal from "@/components/common/ContentModal";

interface SocialCardProps {
  item: ContentItem;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export default function SocialCard({
  item,
  dragHandleProps,
  isDragging = false,
}: SocialCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const social = item.rawItem as SocialPost;
  const [likes, setLikes] = useState(social?.likes || 420);
  const [hasLiked, setHasLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 dark:bg-slate-900/90 ${
          isDragging
            ? "border-sky-500 shadow-2xl opacity-90 scale-[1.02] dark:border-sky-400"
            : "border-slate-200/80 hover:border-slate-300 hover:shadow-xl dark:border-slate-800/80 dark:hover:border-slate-700/80"
        }`}
        data-testid={`card-${item.id}`}
      >
        {/* Card Header: Author profile & Favorite */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                social?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              }
              alt={social?.username || "Author"}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-500/20"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                  {social?.username || item.title}
                </span>
                {social?.verified && (
                  <CheckCircle className="h-3.5 w-3.5 fill-sky-500 text-white shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                @{social?.handle || "community"}
              </span>
            </div>
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

        {/* Media (if post contains media) */}
        {item.imageUrl && !imageError && (
          <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt="Post attachment"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Post Text */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-xs sm:text-sm text-slate-800 line-clamp-3 hover:text-sky-600 transition dark:text-slate-200 dark:hover:text-sky-400 mb-2 leading-relaxed"
            >
              {item.description}
            </p>

            {/* Hashtags */}
            {social?.hashtags && social.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {social.hashtags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium text-sky-600 hover:underline dark:text-sky-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Engagement Metrics */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
              <button
                type="button"
                onClick={handleLike}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition ${
                  hasLiked
                    ? "text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400 font-bold"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ThumbsUp
                  className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
                />
                <span>{likes.toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{social?.commentsCount || 12}</span>
              </button>

              <span className="inline-flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>Share</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl bg-sky-500 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-sky-600 transition active:scale-95"
            >
              View Post
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
