import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React from "react";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const SortableItem = ({ id, children, disabled }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {!disabled && (
        <button
          {...attributes}
          {...listeners}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
          aria-label="Reordenar"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      {children}
    </div>
  );
};
