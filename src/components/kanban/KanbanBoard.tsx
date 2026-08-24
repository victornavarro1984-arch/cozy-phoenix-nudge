"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Task, TaskStatus, Priority } from '@/types';
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ListChecks, 
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  badgeColor: string;
  borderColor: string;
}

const columns: ColumnDef[] = [
  { id: 'todo', title: 'To Do', badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300', borderColor: 'border-t-slate-500' },
  { id: 'in_progress', title: 'In Progress', badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300', borderColor: 'border-t-indigo-500' },
  { id: 'review', title: 'Under Review', badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', borderColor: 'border-t-amber-500' },
  { id: 'done', title: 'Completed', badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', borderColor: 'border-t-emerald-500' },
];

export const KanbanBoard = () => {
  const { tasks, moveTaskStatus, deleteTask, toggleSubtask, searchQuery } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive" className="text-[10px] font-bold">🔴 Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] text-white font-bold">🟠 High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">🟡 Med</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-[10px] text-emerald-600 font-bold">🟢 Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kanban Workflow</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Manage projects, move tasks through completion pipelines, and check off milestones. Click any card to edit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-muted/60 border rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-muted/60 border rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button
            onClick={() => setIsTaskModalOpen(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col bg-muted/30 border rounded-2xl p-3.5 border-t-4 ${col.borderColor} min-h-[500px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleOpenEdit(task)}
                      className="bg-card text-card-foreground border border-border/70 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all space-y-3 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-muted font-semibold text-muted-foreground uppercase tracking-wider">
                          {task.category}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {getPriorityBadge(task.priority)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button<dyad-write path="src/components/kanban/KanbanBoard.tsx" description="Complete Kanban board with modal editing, subtask toggling, and fast column advancement">
"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Task, TaskStatus, Priority } from '@/types';
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ListChecks, 
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  badgeColor: string;
  borderColor: string;
}

const columns: ColumnDef[] = [
  { id: 'todo', title: 'To Do', badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300', borderColor: 'border-t-slate-500' },
  { id: 'in_progress', title: 'In Progress', badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300', borderColor: 'border-t-indigo-500' },
  { id: 'review', title: 'Under Review', badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', borderColor: 'border-t-amber-500' },
  { id: 'done', title: 'Completed', badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', borderColor: 'border-t-emerald-500' },
];

export const KanbanBoard = () => {
  const { tasks, moveTaskStatus, deleteTask, toggleSubtask, searchQuery } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive" className="text-[10px] font-bold">🔴 Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] text-white font-bold">🟠 High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">🟡 Med</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-[10px] text-emerald-600 font-bold">🟢 Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kanban Workflow</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Manage projects, move tasks through completion pipelines, and check off milestones. Click any card to edit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-muted/60 border rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-muted/60 border rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button
            onClick={() => setIsTaskModalOpen(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col bg-muted/30 border rounded-2xl p-3.5 border-t-4 ${col.borderColor} min-h-[500px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleOpenEdit(task)}
                      className="bg-card text-card-foreground border border-border/70 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all space-y-3 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-muted font-semibold text-muted-foreground uppercase tracking-wider">
                          {task.category}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {getPriorityBadge(task.priority)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => handleOpenEdit(task)}>
                                <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Details
                              </DropdownMenuItem>
                              {col.id !== 'todo' && (
                                <DropdownMenuItem onClick={() => moveTaskStatus(task.id, 'todo')}>
                                  Move to To Do
                                </DropdownMenuItem>
                              )}
                              {col.id !== 'in_progress' && (
                                <DropdownMenuItem onClick={() => moveTaskStatus(task.id, 'in_progress')}>
                                  Move to In Progress
                                </DropdownMenuItem>
                              )}
                              {col.id !== 'review' && (
                                <DropdownMenuItem onClick={() => moveTaskStatus(task.id, 'review')}>
                                  Move to Review
                                </DropdownMenuItem>
                              )}
                              {col.id !== 'done' && (
                                <DropdownMenuItem onClick={() => moveTaskStatus(task.id, 'done')}>
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteTask(task.id)}
                                className="text-destructive font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Subtasks Progress */}
                      {task.subtasks.length > 0 && (
                        <div
                          className="space-y-1.5 bg-muted/40 p-2.5 rounded-lg border border-border/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ListChecks className="w-3.5 h-3.5" /> Subtasks
                            </span>
                            <span>
                              {completedSubtasks}/{task.subtasks.length}
                            </span>
                          </div>
                          <div className="space-y-1 pt-1">
                            {task.subtasks.map((st) => (
                              <div
                                key={st.id}
                                onClick={() => toggleSubtask(task.id, st.id)}
                                className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => {}}
                                  className="h-3.5 w-3.5 rounded text-indigo-600 border-border cursor-pointer"
                                />
                                <span className={`truncate ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {st.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Info */}
                      <div
                        className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.dueDate ? (
                          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                            <Clock className="w-3 h-3" /> {task.dueDate}
                          </span>
                        ) : (
                          <span>No due date</span>
                        )}

                        <div className="flex items-center gap-1">
                          {col.id !== 'done' ? (
                            <button
                              onClick={() => {
                                const nextMap: Record<TaskStatus, TaskStatus> = {
                                  todo: 'in_progress',
                                  in_progress: 'review',
                                  review: 'done',
                                  done: 'done',
                                };
                                moveTaskStatus(task.id, nextMap[col.id]);
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded transition-colors"
                            >
                              Advance →
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-xs text-muted-foreground font-medium">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateTaskModal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen} />
      <EditTaskModal task={editingTask} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
};