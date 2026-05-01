import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
    CheckSquare,
    Clock,
    ListTodo,
    Layers,
    Plus,
    RefreshCw,
    Rocket,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import StatsCard from "../components/tasks/StatsCard";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskModal from "../components/tasks/TaskModal";
import { KanbanSkeleton } from "../components/ui/Loader";
import { useTasks } from "../hooks/useTasks";

const EMPTY_FORM = {
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
};

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { tasks, setTasks, loading, fetchTasks, createTask, updateTask } =
        useTasks();

    // ── Initial Load ──
    useEffect(() => {
        safeFetchTasks();
    }, []);

    const safeFetchTasks = async () => {
        try {
            setError(null);
            await fetchTasks();
        } catch (err) {
            console.error(err);
            setError("Failed to load tasks");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await safeFetchTasks();
        setRefreshing(false);
    };

    // ── Stats ──
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;

    const stats = [
        {
            icon: Layers,
            label: "Total Tasks",
            value: total,
            color: "#7c3aed",
            trend: 12,
            trendLabel: "vs last week",
        },
        {
            icon: CheckSquare,
            label: "Completed",
            value: completed,
            color: "#10b981",
            trend: 8,
            trendLabel: "tasks done",
        },
        {
            icon: Clock,
            label: "In Progress",
            value: inProgress,
            color: "#f59e0b",
            trendLabel: "active now",
        },
        {
            icon: ListTodo,
            label: "To Do",
            value: todo,
            color: "#64748b",
            trendLabel: "queued",
        },
    ];

    // ── Modal helpers ──
    const openAddModal = (defaultStatus = "todo") => {
        setForm({ ...EMPTY_FORM, status: defaultStatus });
        setModalOpen(true);
    };

    const openEditModal = (task) => {
        setForm({
            _id: task._id,
            title: task.title ?? "",
            description: task.description ?? "",
            status: task.status ?? "todo",
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => setForm(EMPTY_FORM), 300);
    };

    // ── Submit handler ──
    // NOTE: useTasks.createTask and useTasks.updateTask already call setTasks internally.
    // We do NOT call setTasks again here to avoid double-updates.
    const handleSubmit = async (data) => {
        try {
            setSubmitting(true);
            setError(null);

            if (data._id) {
                const { _id, ...updates } = data;
                await updateTask(_id, updates);
            } else {
                await createTask(data);
            }

            closeModal();
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        /* Root shell: full viewport height, no overflow at this level */
        <div className="flex h-screen bg-[#0a0a14] overflow-hidden">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e1e3f",
                        color: "#f1f5f9",
                        border: "1px solid rgba(255,255,255,0.1)",
                    },
                }}
            />

            {/* Sidebar — fixed width on desktop, drawer on mobile */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content column — min-w-0 prevents flex child from overflowing */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Sticky Navbar */}
                <Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

                {/* Scrollable page body */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                        {/* ── Page Header ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center justify-between gap-3 mb-8"
                        >
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                    Dashboard{" "}
                                    <span className="text-violet-400">👋</span>
                                </h1>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Refresh */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing || loading}
                                    title="Refresh tasks"
                                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                                >
                                    <RefreshCw
                                        size={16}
                                        className={refreshing ? "animate-spin" : ""}
                                    />
                                </button>

                                {/* New Task */}
                                <button
                                    onClick={() => openAddModal("todo")}
                                    className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"
                                >
                                    <Plus size={16} />
                                    <span className="hidden sm:inline">New Task</span>
                                    <span className="sm:hidden">New</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Error Banner ── */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {/* ── Stats Grid ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="h-full"
                                >
                                    <StatsCard {...s} />
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Section label ── */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                Task Board
                            </h2>
                            {tasks.length > 0 && (
                                <span className="text-xs text-slate-500">
                                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                                </span>
                            )}
                        </div>

                        {/* ── Kanban / Skeleton / Empty ── */}
                        {loading ? (
                            <KanbanSkeleton />
                        ) : tasks.length === 0 ? (
                            <EmptyState onAdd={() => openAddModal("todo")} />
                        ) : (
                            <KanbanBoard
                                tasks={tasks}
                                setTasks={setTasks}
                                updateTask={updateTask}
                                onAddTask={openAddModal}
                                onEditTask={openEditModal}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Task Create / Edit Modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={submitting}
                form={form}
                setForm={setForm}
            />
        </div>
    );
}

/* ── Rich empty state ── */
function EmptyState({ onAdd }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5">
                <Rocket size={36} className="text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tasks yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
                Get started by creating your first task. You can organise them across
                To Do, In Progress, and Done columns.
            </p>
            <button
                onClick={onAdd}
                className="btn-primary flex items-center gap-2 px-6 py-3"
            >
                <Plus size={16} />
                Create First Task
            </button>
        </motion.div>
    );
}