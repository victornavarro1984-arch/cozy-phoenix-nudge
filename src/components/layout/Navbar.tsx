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
  Database,
  Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';
import { CreateNoteModal } from '@/components/modals/CreateNoteModal';
import { BackupModal } from '@/components/modals/BackupModal';
import { CommandPaletteModal } from '@/components/modals/CommandPaletteModal';

export const Navbar = () => {
  const { activeTab, setActiveTab, tasks, habits, focusSessions, searchQuery, setSearchQuery } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalMinutes = focusSessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);
  const activeHabitStreaks = habits.reduce((acc, h) => acc + h.streak, 0);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban', icon: Kanban, badge: tasks.filter(t => t.status !== 'done').length },
    { id: 'pomodoro', label: 'Focus Station', icon: Timer },
    { id: 'habits', label: 'Habits', icon: Activity },
    { id: 'notes', label: 'Notes Wiki', icon: FileText },
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

        {/* Global Quick Search / Cmd+K trigger */}
        <div className="relative max-w-xs md:max-w-md w-full hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workspace (or press ⌘K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-14 bg-muted/40 rounded-full border-muted text-sm focus-visible:ring-indigo-500 focus-visible:bg-background transition-all"
          />
          <button
            onClick={() => setIsCmdOpen(true)}
            className="absolute right-3 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono font-bold flex items-center gap-0.5"
          >
            <Command className="w-2.5 h-2.5" /> K
          </button>
        </div>

        {/* Action Widgets & Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBackupModalOpen(true)}
            className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Database className="w-3.5 h-3.5" /> Backup
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
      <BackupModal open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen} />
      <CommandPaletteModal
        open={isCmdOpen}
        onOpenChange={setIsCmdOpen}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />
    </header>
  );
};