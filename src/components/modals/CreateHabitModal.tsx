"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkspace } from '@/context/WorkspaceContext';

interface CreateHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorPalette = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EF4444', // Red
];

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ open, onOpenChange }) => {
  const { addHabit } = useWorkspace();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');
  const [targetDays, setTargetDays] = useState(5);
  const [color, setColor] = useState(colorPalette[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      category,
      frequency,
      color,
      targetDaysPerWeek: Number(targetDays),
    });

    setTitle('');
    setCategory('Wellness');
    setFrequency('daily');
    setTargetDays(5);
    setColor(colorPalette[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Build a New Habit</DialogTitle>
          <DialogDescription>
            Form positive feedback loops, track streak consistency, and build discipline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="habit-title" className="text-xs font-semibold">
              Habit Name *
            </Label>
            <Input
              id="habit-title"
              placeholder="e.g., Read 20 pages of technical literature"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wellness">Wellness & Health</SelectItem>
                  <SelectItem value="Engineering">Engineering / Code</SelectItem>
                  <SelectItem value="Focus">Deep Focus</SelectItem>
                  <SelectItem value="Mindset">Mindset & Reading</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cadence</Label>
              <Select value={frequency} onValueChange={(val) => setFrequency(val as any)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Every Day</SelectItem>
                  <SelectItem value="weekdays">Weekdays Only</SelectItem>
                  <SelectItem value="weekends">Weekends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Accent Theme Color</Label>
            <div className="flex items-center gap-2 pt-1">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary' : 'hover:opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Track Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};