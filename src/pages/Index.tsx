"use client";

import React from 'react';
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext';
import { Navbar } from '@/components/layout/Navbar';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { PomodoroStation } from '@/components/pomodoro/PomodoroStation';
import { HabitMatrix } from '@/components/habits/HabitMatrix';
import { NotesWiki } from '@/components/notes/NotesWiki';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { ScratchpadDrawer } from '@/components/scratchpad/ScratchpadDrawer';
import { MadeWithDyad } from '@/components/made-with-dyad';

const MainContent = () => {
  const { activeTab } = useWorkspace();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {activeTab === 'dashboard' && <OverviewTab />}
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'pomodoro' && <PomodoroStation />}
        {activeTab === 'habits' && <HabitMatrix />}
        {activeTab === 'notes' && <NotesWiki />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      <ScratchpadDrawer />

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <WorkspaceProvider>
      <MainContent />
    </WorkspaceProvider>
  );
};

export default Index;