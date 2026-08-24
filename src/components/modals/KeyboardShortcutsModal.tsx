"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard, Command, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onOpenChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger with Shift + ? when not typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const shortcuts = [
    { key: '⌘ + K', desc: 'Open Command Palette & Universal Search' },
    { key: '?', desc: 'Open Keyboard Shortcuts Guide' },
    { key: 'ESC', desc: 'Close any active modal or side drawer' },
    { key: 'Tab', desc: 'Navigate focusable controls & fields' },
    { key: 'Space', desc: 'Toggle habit checks or focus timer' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-600" />
            <DialogTitle className="text-xl font-bold">Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Accelerate your workflow with instant keyboard bindings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-3">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs"
            >
              <span className="font-medium text-foreground">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-background border shadow-sm font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg text-xs"
          >
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};