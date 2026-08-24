"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Trophy, 
  Zap, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Award,
  TrendingUp,
  BarChart2,
  Calendar,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsView = () => {
  const { userStats, achievements, focusSessions, tasks, habits } = useWorkspace();

  const nextLevelXp = userStats.level * 250;
  const currentLevelXp = userStats.xp % 250;
  const levelProgress = Math.round((currentLevelXp / 250) * 100);

  // Focus history chart data (last 7 days focus minutes)
  const days: { day: string; dateStr: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });

    const totalMinsForDay = focusSessions
      .filter((s) => s.completedAt && s.completedAt.split('T')[0] === dateStr)
      .reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);

    days.push({ day, dateStr, minutes: totalMinsForDay });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance & Gamification</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track your XP level progression, review focus velocity, and unlock mastery achievements.
          </p>
        </div>
      </div>

      {/* Level Banner */}
      <Card className="rounded-2xl border-2 border-indigo-500/20 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl overflow-hidden relative">
        <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/20">
              {userStats.level}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                  Level {userStats.level} Operator
                </span>
                <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30 text-[10px]">
                  {userStats.xp} Total XP
                </Badge>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold">Deep Work Commander</h3>
              <p className="text-xs text-indigo-200">
                Earn +50 XP per task, +2 XP per focus minute, +20 XP per habit check-in.
              </p>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-2 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-200">Level Progress</span>
              <span className="text-amber-400">{currentLevelXp} / 250 XP</span>
            </div>
            <Progress value={levelProgress} className="h-2.5 bg-slate-800" />
            <p className="text-[10px] text-indigo-300 text-right">
              {250 - currentLevelXp} XP to Level {userStats.level + 1}
            </p>
          </div>
        </div>
      </Card>

      {/* Focus Session Velocity Chart & Session Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 rounded-2xl border border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" /> 7-Day Focus Velocity
            </CardTitle>
            <CardDescription>Minutes spent in deep work Pomodoro cycles per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="minutes" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Focus Session Recent Logs Table */}
        <Card className="lg:col-span-5 rounded-2xl border border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-500" /> Focus Log History
            </CardTitle>
            <CardDescription>Recent completed concentration sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {focusSessions.slice().reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold truncate">
                      {session.taskTitle || 'General Focus Session'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold shrink-0">
                  +{session.durationMinutes}m
                </Badge>
              </div>
            ))}

            {focusSessions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">
                No focus sessions logged yet. Start a session in the Focus Station!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Unlockable Achievements
          </h3>
          <span className="text-xs text-muted-foreground font-semibold">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              className={`rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-card border-indigo-500/40 shadow-sm'
                  : 'bg-muted/30 border-border/40 opacity-70'
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                    ach.unlocked ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {ach.unlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">{ach.title}</h4>
                    {ach.unlocked && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
                  
                  {!ach.unlocked && (
                    <div className="pt-1.5 space-y-1">
                      <Progress value={(ach.progress / ach.maxProgress) * 100} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground text-right font-medium">
                        {ach.progress} / {ach.maxProgress}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};