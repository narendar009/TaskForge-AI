import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, GripVertical, Clock, Pencil } from 'lucide-react';

const STATUS_BADGE = {
  todo:          { cls: 'badge-todo',     label: 'To Do' },
  'in-progress': { cls: 'badge-progress', label: 'In Progress' },
  done:          { cls: 'badge-done',     label: 'Done' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // hide original when dragging (DragOverlay shows ghost)
    zIndex: isDragging ? 0 : undefined,
  };

  const badge = STATUS_BADGE[task.status] ?? STATUS_BADGE.todo;
  const overdue = task.status !== 'done' && isOverdue(task.dueDate);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="task-card-hover glass rounded-xl p-4 cursor-pointer select-none group relative"
        onClick={onClick}
      >
        {/* Edit icon — appears on hover */}
        <div className="absolute top-3 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil size={13} className="text-slate-500" />
        </div>

        {/* Top row: title + drag handle */}
        <div className="flex items-start gap-2">
          <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 flex-1 pr-1">
            {task.title}
          </h4>
          <span
            {...listeners}
            className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing mt-0.5 flex-shrink-0 touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Footer: badge + due date */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className={`badge ${badge.cls}`}>{badge.label}</span>

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                overdue ? 'text-red-400' : 'text-slate-500'
              }`}
            >
              {overdue ? <Clock size={11} /> : <Calendar size={11} />}
              {formatDate(task.dueDate)}
              {overdue && (
                <span className="ml-1 text-[10px] font-bold uppercase text-red-500/80 tracking-wide">
                  Overdue
                </span>
              )}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
