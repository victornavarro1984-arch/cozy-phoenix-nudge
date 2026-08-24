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
import { Textarea } from '@/components/ui/textarea';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Download, Upload, Copy, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface BackupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ open, onOpenChange }) => {
  const { tasks, habits, notes, focusSessions } = useWorkspace();
  const [importJson, setImportJson] = useState('');
  const [copied, setCopied] = useState(false);

  const getExportData = () => {
    return JSON.stringify(
      {
        version: '2.4',
        exportedAt: new Date().toISOString(),
        tasks,
        habits,
        notes,
        focusSessions,
      },
      null,
      2
    );
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(getExportData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `nexus-workspace-backup-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Workspace snapshot downloaded');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(getExportData());
    setCopied(true);
    toast.success('Backup JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        localStorage.setItem('nexus_tasks', JSON.stringify(parsed.tasks));
      }
      if (parsed.habits && Array.isArray(parsed.habits)) {
        localStorage.setItem('nexus_habits', JSON.stringify(parsed.habits));
      }
      if (parsed.notes && Array.isArray(parsed.notes)) {
        localStorage.setItem('nexus_notes', JSON.stringify(parsed.notes));
      }
      if (parsed.focusSessions && Array.isArray(parsed.focusSessions)) {
        localStorage.setItem('nexus_focus_sessions', JSON.stringify(parsed.focusSessions));
      }
      toast.success('Workspace restored successfully! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (e) {
      toast.error('Invalid JSON structure. Please verify the backup file.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <DialogTitle className="text-xl font-bold">Data Portability & Backup</DialogTitle>
          </div>
          <DialogDescription>
            Download your tasks, habits, and knowledge notes, or restore from a previous JSON backup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Export Section */}
          <div className="space-y-2 bg-muted/40 p-3.5 rounded-xl border border-border/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Export Workspace
            </h4>
            <p className="text-xs text-muted-foreground">
              Save your complete data schema including active task boards, streaks, and wiki entries.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleDownloadBackup}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download .JSON
              </Button>
              <Button
                onClick={handleCopyClipboard}
                variant="outline"
                size="sm"
                className="rounded-lg gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Schema'}
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Restore / Import Backup
            </h4>
            <Textarea
              placeholder="Paste raw Nexus JSON backup content here..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={4}
              className="rounded-lg font-mono text-xs"
            />
            <Button
              onClick={handleImport}
              disabled={!importJson.trim()}
              size="sm"
              variant="secondary"
              className="rounded-lg gap-1.5 text-xs w-full"
            >
              <Upload className="w-3.5 h-3.5" /> Restore Workspace
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};