"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Plus, 
  Flame, 
  Trash2, 
  Award, 
  Check, 
  CalendarDays,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';

export const HabitMatrix = () => {
  const { habits, toggleHabitDay, deleteHabit, searchQuery } = useWorkspace();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  // Generate last 7 days array
  const days: { label: string; dateStr: string; dayName: string; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    days.push({
      label: `${dayName} ${dayNum}`,
      dayName,
      dateStr,
      isToday: i === 0,
    });
  }

  const filteredHabits = habits.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Habit & Routine Matrix</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track daily micro-habits, build discipline streaks, and maintain high personal standards.
          </p>
        </div>

        <Button
          onClick={() => setIsHabitModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </Button>
      </div>

      {/* Habit Matrix Table / Grid */}
      <Card className="rounded-2xl border border-border/70 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="py-3.5 px-4 min-w-[200px]">Habit & Discipline</th>
                <th className="py-3.5 px-3 text-center min-w-[80px]">Streak</th>
                {days.map((day) => (
                  <th
                    key={day.dateStr}
                    className={`py-3.5 px-2 text-center min-w-[50px] ${
                      day.isToday ? 'bg-indigo-500/10 text-indigo-600 font-bold' : ''
                    }`}
                  >
                    <div>{day.dayName}</div>
                    <div className="text-[10px] text-muted-foreground font-normal">
                      {day.label.split(' ')[1]}
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {filteredHabits.map((habit) => (
                <tr key={habit.id} className="hover:bg-muted/20 transition-colors">
                  {/* Habit Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{habit.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                            {habit.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            • {habit.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Streak */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{habit.streak}d</span>
                    </div>
                  </td>

                  {/* 7-Day Matrix Checkboxes */}
                  {days.map((day) => {
                    const isChecked = habit.completedDates.includes(day.dateStr);
                    return (
                      <td
                        key={day.dateStr}
                        className={`py-4 px-2 text-center ${day.isToday ? 'bg-indigo-500/5' : ''}`}
                      >
                        <button
                          onClick={() => toggleHabitDay(habit.id, day.dateStr)}
                          className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center transition-all ${
                            isChecked
                              ? 'text-white shadow-md scale-105'
                              : 'bg-muted/60 hover:bg-muted text-transparent border border-border/60 hover:scale-95'
                          }`}
                          style={{
                            backgroundColor: isChecked ? habit.color : undefined,
                          }}
                        >
                          <Check className={`w-4 h-4 stroke-[3] ${isChecked ? 'text-white' : ''}`} />
                        </button>
                      </td>
                    );
                  })}

                  {/* Delete Action */}
                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredHabits.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground text-sm">
                    No habits found. Click "+ Add Habit" to kickstart your daily routines!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateHabitModal open={isHabitModalOpen} onOpenChange={setIsHabitModalOpen} />
    </div>
  );
};