import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { Plus, Inbox } from 'lucide-react';

const COLUMNS = [
  {
    id: 'todo',
    label: 'To Do',
    color: '#64748b',
    bg: 'rgba(100,116,139,0.07)',
    border: 'rgba(100,116,139,0.18)',
    accentBg: 'rgba(100,116,139,0.15)',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.18)',
    accentBg: 'rgba(245,158,11,0.15)',
  },
  {
    id: 'done',
    label: 'Done',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.07)',
    border: 'rgba(16,185,129,0.18)',
    accentBg: 'rgba(16,185,129,0.15)',
  },
];

/* ── Empty column placeholder ── */
function EmptyColumn({ onAdd, colId, color }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center select-none">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}25` }}
      >
        <Inbox size={18} style={{ color }} />
      </div>
      <p className="text-xs text-slate-600 font-medium">No tasks here</p>
      <button
        onClick={() => onAdd(colId)}
        className="text-xs font-semibold transition-colors"
        style={{ color }}
      >
        + Add a task
      </button>
    </div>
  );
}

export default function KanbanBoard({ tasks, setTasks, updateTask, onAddTask, onEditTask }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  /* Group tasks by column status */
  const columnTasks = useMemo(
    () =>
      COLUMNS.reduce((acc, col) => {
        acc[col.id] = tasks.filter((t) => t.status === col.id);
        return acc;
      }, {}),
    [tasks]
  );

  function findColumn(taskId) {
    for (const col of COLUMNS) {
      if (columnTasks[col.id].find((t) => t._id === taskId)) return col.id;
    }
    return null;
  }

  function handleDragStart({ active }) {
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd({ active, over }) {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const sourceCol = findColumn(activeId);

    // Determine destination: over a column id directly, or over a task id → find its column
    const destCol =
      COLUMNS.find((c) => c.id === overId)?.id ?? findColumn(overId);

    if (!sourceCol || !destCol) return;

    if (sourceCol === destCol) {
      // Reorder within same column
      const items = columnTasks[sourceCol];
      const oldIdx = items.findIndex((t) => t._id === activeId);
      const newIdx = items.findIndex((t) => t._id === overId);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(items, oldIdx, newIdx);
        setTasks((prev) => {
          const others = prev.filter((t) => t.status !== sourceCol);
          return [...others, ...reordered];
        });
      }
    } else {
      // Move between columns → optimistic update then persist
      setTasks((prev) =>
        prev.map((t) => (t._id === activeId ? { ...t, status: destCol } : t))
      );
      try {
        await updateTask(activeId, { status: destCol });
      } catch {
        // Rollback on failure
        setTasks((prev) =>
          prev.map((t) => (t._id === activeId ? { ...t, status: sourceCol } : t))
        );
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Responsive grid: 1 col → 2 col (tablet) → 3 col (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((col, colIndex) => {
          const colTasks = columnTasks[col.id];

          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.08, duration: 0.35 }}
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: col.bg,
                border: `1px solid ${col.border}`,
                minHeight: '280px',
              }}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                style={{ borderColor: col.border }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full pulse-dot"
                    style={{ background: col.color }}
                  />
                  <span className="text-sm font-bold" style={{ color: col.color }}>
                    {col.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                    style={{ background: col.accentBg, color: col.color }}
                  >
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() => onAddTask(col.id)}
                    title={`Add task to ${col.label}`}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Task list — scrollable, constrained height */}
              <SortableContext
                items={colTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id={col.id}
                  data-droppable="true"
                  className="flex flex-col gap-2.5 p-3 overflow-y-auto flex-1"
                  style={{ maxHeight: 'calc(100vh - 340px)', minHeight: '180px' }}
                >
                  <AnimatePresence mode="popLayout">
                    {colTasks.length === 0 ? (
                      <EmptyColumn
                        key="empty"
                        onAdd={onAddTask}
                        colId={col.id}
                        color={col.color}
                      />
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onClick={() => onEditTask(task)}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </motion.div>
          );
        })}
      </div>

      {/* Drag overlay — ghost card while dragging */}
      <DragOverlay>
        {activeTask ? (
          <div className="glass rounded-xl p-4 opacity-90 shadow-2xl shadow-black/60 rotate-1 scale-105 pointer-events-none">
            <p className="text-sm font-semibold text-slate-100 line-clamp-2">
              {activeTask.title}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
