"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Calendar,
  Sparkles,
  Award,
  Zap,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';

const weeklyFocusData = [
  { day: 'Mon', focusMinutes: 75, tasks: 4 },
  { day: 'Tue', focusMinutes: 120, tasks: 6 },
  { day: 'Wed', focusMinutes: 90, tasks: 5 },
  { day: 'Thu', focusMinutes: 150, tasks: 8 },
  { day: 'Fri', focusMinutes: 110, tasks: 7 },
  { day: 'Sat', focusMinutes: 45, tasks: 2 },
  { day: 'Sun', focusMinutes: 60, tasks: 3 },
];

export const OverviewTab = () => {
  const { tasks, habits, focusSessions, setActiveTab, toggleHabitDay, moveTaskStatus } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === 'done');
  const pendingTasks = tasks.filter((t) => t.status !== 'done');
  const totalFocusMins = focusSessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayHabitsDone = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((todayHabitsDone / habits.length) * 100) : 0;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Distribution chart data
  const categoryCount: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workspace Score: 94 / 100 (Optimal Flow)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, Commander.
            </h1>
            <p className="text-sm md:text-base text-indigo-200 max-w-xl">
              You have <span className="text-white font-bold">{pendingTasks.length} active tasks</span> and{' '}
              <span className="text-white font-bold">{habits.length - todayHabitsDone} daily routines</span> awaiting completion today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setActiveTab('pomodoro')}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Start Focus Session
            </Button>
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-xl gap-2"
            >
              Quick Task
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Task Completion</p>
              <p className="text-2xl font-bold">{completedTasks.length} / {tasks.length}</p>
              <div className="flex items-center gap-2 pt-1">
                <Progress value={taskCompletionRate} className="h-2 w-24" />
                <span className="text-xs text-muted-foreground font-semibold">{taskCompletionRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Daily Habits Met</p>
              <p className="text-2xl font-bold">{todayHabitsDone} / {habits.length}</p>
              <div className="flex items-center gap-2 pt-1">
                <Progress value={habitCompletionRate} className="h-2 w-24" />
                <span className="text-xs text-muted-foreground font-semibold">{habitCompletionRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2<dyad-write path="src/components/dashboard/OverviewTab.tsx" description="Executive summary dashboard featuring analytics charts, productivity velocity, and quick action widgets">
"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/<dyad-write path="src/components/dashboard/OverviewTab.tsx" description="Executive summary dashboard featuring analytics charts, productivity velocity, and quick action widgets">
"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Zap,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';

const weeklyFocusData = [
  { day: 'Mon', focusMinutes: 75, tasks: 4 },
  { day: 'Tue', focusMinutes: 120, tasks: 6 },
  { day: 'Wed', focusMinutes: 90, tasks: 5 },
  { day: 'Thu', focusMinutes: 150, tasks: 8 },
  { day: 'Fri', focusMinutes: 110, tasks: 7 },
  { day: 'Sat', focusMinutes: 45, tasks: 2 },
  { day: 'Sun', focusMinutes: 60, tasks: 3 },
];

export const OverviewTab = () => {
  const { tasks, habits, focusSessions, setActiveTab, toggleHabitDay, moveTaskStatus } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === 'done');
  const pendingTasks = tasks.filter((t) => t.status !== 'done');
  const totalFocusMins = focusSessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayHabitsDone = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((todayHabitsDone / habits.length) * 100) : 0;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Distribution chart data
  const categoryCount: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workspace Score: 94 / 100 (Optimal Flow)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, Commander.
            </h1>
            <p className="text-sm md:text-base text-indigo-200 max-w-xl">
              You have <span className="text-white font-bold">{pendingTasks.length} active tasks</span> and{' '}
              <span className="text-white font-bold">{habits.length - todayHabitsDone} daily routines</span> awaiting completion today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setActiveTab('pomodoro')}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Start Focus Session
            </Button>
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-xl gap-2"
            >
              Quick Task
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Task Completion</p>
              <p className="text-2xl font-bold">{completedTasks.length} / {tasks.length}</p>
              <div className="flex items-center gap-2 pt-1">
                <Progress value={taskCompletionRate} className="h-2 w-24" />
                <span className="text-xs text-muted-foreground font-semibold">{taskCompletionRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Daily Habits Met</p>
              <p className="text-2xl font-bold">{todayHabitsDone} / {habits.length}</p>
              <div className="flex items-center gap-2 pt-1">
                <Progress value={habitCompletionRate} className="h-2 w-24" />
                <span className="text-xs text-muted-foreground font-semibold">{habitCompletionRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Deep Work Logged</p>
              <p className="text-2xl font-bold">{totalFocusMins} mins</p>
              <p className="text-xs text-muted-foreground font-medium pt-1">
                {focusSessions.length} total sessions
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Productivity Rank</p>
              <p className="text-2xl font-bold">Elite (Top 3%)</p>
              <p className="text-xs text-emerald-600 font-semibold pt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18% vs last week
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts & Habit Quick Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Velocity Chart */}
        <Card className="lg:col-span-2 rounded-2xl border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Weekly Focus Activity</CardTitle>
              <CardDescription>Minutes logged in Pomodoro work sessions per day</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              Last 7 Days
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFocusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="focusMinutes"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Category Distribution */}
        <Card className="rounded-2xl border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
            <CardDescription>Current workload allocation by domain</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col items-center justify-center">
            {categoryData.length > 0 ? (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-12">No tasks available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Immediate Priorities & Quick Habit Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Task Radar */}
        <Card className="rounded-2xl border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Top Priority Actions</CardTitle>
              <CardDescription>Upcoming deliverables requiring immediate attention</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('kanban')}
              className="text-xs text-indigo-600 dark:text-indigo-400 gap-1"
            >
              View Kanban <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => moveTaskStatus(task.id, 'done')}
                    className="h-5 w-5 rounded-md border-2 border-muted-foreground/40 hover:border-indigo-600 flex items-center justify-center transition-colors group-hover:border-indigo-500"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-transparent hover:text-indigo-600 transition-colors" />
                  </button>
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-background border text-muted-foreground font-medium">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="text-[11px] text-muted-foreground">
                          Due {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                  className="capitalize text-[10px] font-bold"
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                🎉 All tasks are completed! Enjoy your focus or take a break.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Habit Quick Check */}
        <Card className="rounded-2xl border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Today's Habit Check-in</CardTitle>
              <CardDescription>Maintain your momentum and keep streaks alive</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHabitModalOpen(true)}
              className="text-xs text-indigo-600 dark:text-indigo-400 gap-1"
            >
              + Add Habit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {habits.map((habit) => {
              const isDoneToday = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitDay(habit.id, todayStr)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isDoneToday
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-muted/40 border-border/40 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
                        isDoneToday ? 'bg-emerald-500 scale-105' : 'bg-muted-foreground/20'
                      }`}
                    >
                      {isDoneToday ? '✓' : ''}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDoneToday ? 'line-through text-muted-foreground' : ''}`}>
                        {habit.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">{habit.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border text-xs font-bold text-amber-500">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{habit.streak}d streak</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <CreateTaskModal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen} />
      <CreateHabitModal open={isHabitModalOpen} onOpenChange={setIsHabitModalOpen} />
    </div>
  );
};