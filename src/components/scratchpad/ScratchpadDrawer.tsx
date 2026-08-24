"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileEdit, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export const ScratchpadDrawer = () => {
  const { scratchpad, setScratchpad } = useWorkspace();
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    toast.success('Scratchpad saved to workspace memory');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
        title="Quick Scratchpad"
      >
        <FileEdit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md rounded-l-3xl p-6 flex flex-col justify-between">
          <div>
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <SheetTitle className="text-xl font-bold">Workspace Scratchpad</SheetTitle>
              </div>
              <SheetDescription className="text-xs">
                Quick persistent capture for raw thoughts, links, code snippets, or draft ideas.
              </SheetDescription>
            </SheetHeader>

            <div className="py-4 space-y-2">
              <Textarea
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                rows={18}
                className="font-mono text-xs leading-relaxed rounded-2xl border-muted bg-muted/20 p-4 focus-visible:ring-indigo-500"
                placeholder="Type raw notes here..."
              />
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Auto-saved to local memory</span>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 text-xs font-semibold"
            >
              <Check className="w-4 h-4" /> Save & Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};