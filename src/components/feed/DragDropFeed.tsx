"use client";

import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCcw, Filter, Sparkles } from "lucide-react";
import { ContentItem, ContentType } from "@/types/content";
import ContentCard from "@/components/cards/ContentCard";
import { useAppDispatch, useAppSelector } from "@/store";
import { setFeedOrder, resetFeedOrder } from "@/store/slices/feedOrderSlice";

interface SortableCardWrapperProps {
  item: ContentItem;
}

function SortableCardWrapper({ item }: SortableCardWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 1,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ContentCard
        item={item}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

interface DragDropFeedProps {
  items: ContentItem[];
  enableFilters?: boolean;
}

export default function DragDropFeed({
  items,
  enableFilters = true,
}: DragDropFeedProps) {
  const dispatch = useAppDispatch();
  const customOrder = useAppSelector((state) => state.feedOrder.customOrder);
  const [activeType, setActiveType] = useState<"all" | ContentType>("all");
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);

  // Setup sensors with activation constraint so normal clicks are not intercepted
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply custom order to items
  const sortedItems = useMemo(() => {
    if (!customOrder || customOrder.length === 0) return items;

    const itemMap = new Map(items.map((it) => [it.id, it]));
    const ordered: ContentItem[] = [];

    // Add ordered items first
    for (const id of customOrder) {
      const item = itemMap.get(id);
      if (item) {
        ordered.push(item);
        itemMap.delete(id);
      }
    }

    // Add any remaining new items
    for (const remaining of itemMap.values()) {
      ordered.push(remaining);
    }

    return ordered;
  }, [items, customOrder]);

  // Filter items by type tab
  const filteredItems = useMemo(() => {
    if (activeType === "all") return sortedItems;
    return sortedItems.filter((i) => i.type === activeType);
  }, [sortedItems, activeType]);

  const itemIds = useMemo(() => filteredItems.map((i) => i.id), [filteredItems]);

  const handleDragStart = (event: DragStartEvent) => {
    const found = items.find((i) => i.id === event.active.id);
    if (found) {
      setActiveItem(found);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((it) => it.id === active.id);
      const newIndex = sortedItems.findIndex((it) => it.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = [...sortedItems];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        dispatch(setFeedOrder(reordered.map((i) => i.id)));
      }
    }
  };

  const handleResetOrder = () => {
    dispatch(resetFeedOrder());
  };

  const hasCustomOrder = customOrder && customOrder.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Control Bar: Filters & Reset Order */}
      {enableFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filter:
            </span>
            {(
              [
                { id: "all", label: "All Items" },
                { id: "news", label: "News" },
                { id: "movie", label: "Movies" },
                { id: "social", label: "Social" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition active:scale-95 ${
                  activeType === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reorder notice & Reset button */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Drag grip handles to reorder
            </span>
            {hasCustomOrder && (
              <button
                type="button"
                onClick={handleResetOrder}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                title="Restore default feed order"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drag & Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="feed-grid"
          >
            {filteredItems.map((item) => (
              <SortableCardWrapper key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay Ghost */}
        <DragOverlay>
          {activeItem ? (
            <div className="rotate-2 scale-105 shadow-2xl opacity-90 cursor-grabbing">
              <ContentCard item={activeItem} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
