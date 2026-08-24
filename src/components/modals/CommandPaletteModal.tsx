"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Search, 
  LayoutDashboard, 
  Kanban, 
  Timer, 
  Activity, 
  FileText, 
  Plus, 
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
  onOpenNoteModal: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onOpenTaskModal,
  onOpenHabitModal,
  onOpenNoteModal,
}) => {
  const { setActiveTab, tasks, notes, habits } = useWorkspace();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    onOpenChange(false);
  };

  const filteredTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredNotes = notes.filter(
    (n) => n.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl border bg-card">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b bg-muted/20">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search tasks, or jump to view..."
            className="border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent p-0 h-auto"
            autoFocus
          />
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono font-bold">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
              Quick Actions
            </p>
            <button
              onClick={() => {
                onOpenChange(false);
                onOpenTaskModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">Create New Task</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Action</span>
            </button>

            <button
              onClick={() => {
                onOpenChange(false);
                onOpenHabitModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">Track New Habit</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Action</span>
            </button>

            <button
              onClick={() => {
                onOpenChange(false);
                onOpenNoteModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-semibold">Draft Knowledge Note</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Action</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
              Jump to View
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelectTab('dashboard')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted font-medium text-left"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" /> Overview
              </button>
              <button
                onClick={() => handleSelectTab('kanban')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted font-medium text-left"
              >
                <Kanban className="w-3.5 h-3.5 text-muted-foreground" /> Kanban
              </button>
              <button
                onClick={() => handleSelectTab('pomodoro')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted font-medium text-left"
              >
                <Timer className="w-3.5 h-3.5 text-muted-foreground" /> Focus Timer
              </button>
              <button
                onClick={() => handleSelectTab('habits')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted font-medium text-left"
              >
                <Activity className="w-3.5 h-3.5 text-muted-foreground" /> Habit Matrix
              </button>
            </div>
          </div>

          {/* Matching Tasks */}
          {filteredTasks.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Matching Tasks
              </p>
              {filteredTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTab('kanban')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{t.title}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted uppercase shrink-0">
                    {t.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Matching Notes */}
          {filteredNotes.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Matching Notes
              </p>
              {filteredNotes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelectTab('notes')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="truncate font-medium">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{n.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};