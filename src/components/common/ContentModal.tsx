"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ExternalLink,
  Calendar,
  Share2,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { ContentItem } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

interface ContentModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentModal({ item, isOpen, onClose }: ContentModalProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [commentInput, setCommentInput] = useState("");
  const [localComments, setLocalComments] = useState<
    { id: string; username: string; text: string; time: string }[]
  >([]);
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isFavorited = favorites.some((f) => f.id === item.id);

  const handleToggleFavorite = () => {
    dispatch(
      toggleFavorite({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        category: item.category,
        categoryLabel: item.categoryLabel,
        publishedAt: item.publishedAt,
        favoritedAt: new Date().toISOString(),
        ctaText: item.ctaText,
        ctaLink: item.ctaLink,
        meta: item.meta,
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: `c-local-${Date.now()}`,
        username: "You",
        text: commentInput.trim(),
        time: "Just now",
      },
    ]);
    setCommentInput("");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.ctaLink || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMovie = item.type === "movie";
  const isSocial = item.type === "social";
  const isNews = item.type === "news";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col"
          >
            {/* Header / Media */}
            {item.imageUrl && (
              <div className="relative h-60 w-full shrink-0 overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-white/20 text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    {item.type} • {item.categoryLabel}
                  </span>
                </div>
              </div>
            )}

            {!item.imageUrl && (
              <div className="flex items-center justify-between p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                  {item.type} • {item.categoryLabel}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
                  {item.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  {item.meta.map((m, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="text-slate-400 dark:text-slate-500">{m.label}:</span>
                      {m.value}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description / Story */}
              <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <p>{item.description}</p>
              </div>

              {/* Social Discussion / Comments section */}
              {isSocial && (
                <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                    <MessageCircle className="h-4 w-4 text-indigo-500" />
                    <span>Discussion ({localComments.length})</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {localComments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60"
                      >
                        <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                          <span>{c.username}</span>
                          <span className="text-slate-400 font-normal">{c.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-xl bg-indigo-600 px-3.5 py-2 text-white hover:bg-indigo-500 transition text-xs font-medium"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-4 px-6 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
                    isFavorited
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorited ? "fill-current text-rose-500" : ""}`}
                  />
                  <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>
              </div>

              {isNews && item.ctaLink && (
                <a
                  href={item.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 transition active:scale-95"
                >
                  <span>Original Article</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {isMovie && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 transition active:scale-95"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
