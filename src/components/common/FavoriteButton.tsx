"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ContentItem, FavoriteItem } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

interface FavoriteButtonProps {
  item: ContentItem | FavoriteItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({
  item,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = favorites.some((f) => f.id === item.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

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

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleToggle}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`relative flex items-center justify-center rounded-full transition shadow-sm ${sizeClasses[size]} ${
        isFavorited
          ? "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 dark:bg-rose-500/20 dark:text-rose-400"
          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50"
      } ${className}`}
    >
      <motion.div
        animate={isFavorited ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`${iconSizes[size]} transition-colors ${
            isFavorited ? "fill-rose-500 text-rose-500" : ""
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
