"use client";

import React from "react";
import { ContentItem } from "@/types/content";
import NewsCard from "./NewsCard";
import MovieCard from "./MovieCard";
import SocialCard from "./SocialCard";

interface ContentCardProps {
  item: ContentItem;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export default function ContentCard({
  item,
  dragHandleProps,
  isDragging = false,
}: ContentCardProps) {
  if (item.type === "movie") {
    return (
      <MovieCard
        item={item}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
      />
    );
  }

  if (item.type === "social") {
    return (
      <SocialCard
        item={item}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
      />
    );
  }

  return (
    <NewsCard
      item={item}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
    />
  );
}
