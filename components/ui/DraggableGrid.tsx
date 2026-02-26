'use client';

import type { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  editMode: boolean;
  children: ReactNode;
}

function SortableItem({ id, editMode, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !editMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {editMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-10 bg-card border border-border rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:bg-muted transition-colors"
        >
          <GripVertical size={14} className="text-muted-foreground" />
        </div>
      )}
      <div className={editMode ? 'ring-2 ring-primary/20 ring-dashed rounded-xl' : ''}>
        {children}
      </div>
    </div>
  );
}

interface DraggableGridProps {
  order: string[];
  onReorder: (newOrder: string[]) => void;
  editMode: boolean;
  sections: Record<string, ReactNode>;
}

export default function DraggableGrid({ order, onReorder, editMode, sections }: DraggableGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      onReorder(arrayMove(order, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-6 lg:space-y-8">
          {order.map((id) => (
            <SortableItem key={id} id={id} editMode={editMode}>
              {sections[id] || null}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
