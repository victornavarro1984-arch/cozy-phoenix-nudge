"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  CheckSquare, 
  Flame, 
  Clock, 
  Search, 
  Plus, 
  Sparkles,
  LayoutDashboard,
  Kanban,
  FileText,
  Timer,
  Activity,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';
import { CreateNoteModal } from '@/components/modals/CreateNoteModal';
import { CommandPaletteModal } from '@/components/modals/CommandPaletteModal';
import { BackupModal } from '@/components/modals/BackupModal';

export const Navbar = () => {
  const { activeTab, setActiveTab, tasks, habits, focusSessions, searchQuery, setSearchQuery } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalMinutes = focusSessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);
  const activeHabitStreaks = habits.reduce((acc, h) => acc + h.streak, 0);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban', icon: Kanban, badge: tasks.filter(t => t.status !== 'done').length },
    { id: 'pomodoro', label: 'Focus Station', icon: Timer },
    { id: 'habits', label: 'Habits', icon: Activity },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                NEXUS
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">Productivity Command Center</p>
          </div>
        </div>

        {/* Global Quick Search Button that opens Command Palette */}
        <div
          onClick={() => setIsCmdOpen(true)}
          className="relative max-w-xs md:max-w-md w-full hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-full bg-muted/50 hover:bg-muted/80 border text-xs text-muted-foreground cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search tasks, notes, habits or jump to tab...</span>
          </div>
          <kbd className="text-[10px] bg-background border px-1.5 py-0.5 rounded font-mono font-bold shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Action Widgets & Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-4 bg-muted/40 px-3.5 py-1.5 rounded-full border border-border/50 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{completedTasks} Done</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-amber-500">
              <Flame className="w-3.5 h-3.5" />
              <span>{activeHabitStreaks} Streak</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{totalMinutes}m Focus</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsBackupOpen(true)}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Backup & Restore Data"
          >
            <Database className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => setIsTaskModalOpen(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full gap-1.5 shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* Navigation tabs row */}
      <div className="flex px-4 md:px-8 border-t bg-muted/20 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="secondary"
                    className={`ml-1 px-1.5 py-0 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted-foreground/15 text-muted-foreground'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <CreateTaskModal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen} />
      <CreateHabitModal open={isHabitModalOpen} onOpenChange={setIsHabitModalOpen} />
      <CreateNoteModal open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen} />
      <CommandPaletteModal
        open={isCmdOpen}
        onOpenChange={setIsCmdOpen}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />
      <BackupModal open={isBackupOpen} onOpenChange={setIsBackupOpen} />
    </header>
  );
};