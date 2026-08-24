"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Note } from '@/types';
import { 
  Plus, 
  Pin, 
  Trash2, 
  Tag, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Save, 
  Copy, 
  Check, 
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreateNoteModal } from '@/components/modals/CreateNoteModal';
import { toast } from 'sonner';

export const NotesWiki = () => {
  const { notes, updateNote, deleteNote, searchQuery } = useWorkspace();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [copied, setCopied] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleStartEdit = () => {
    if (!activeNote) return;
    setEditTitle(activeNote.title);
    setEditContent(activeNote.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!activeNote) return;
    updateNote(activeNote.id, {
      title: editTitle.trim() || activeNote.title,
      content: editContent,
    });
    setIsEditing(false);
    toast.success('Note changes updated');
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(`${activeNote.title}\n\n${activeNote.content}`);
    setCopied(true);
    toast.success('Copied note to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base & Wiki</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Document architectural choices, capture brainstorms, and organize project repositories.
          </p>
        </div>

        <Button
          onClick={() => setIsNoteModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      {/* Tag pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            selectedTag === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          All Notes ({notes.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Master Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notes list sidebar */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredNotes.map((note) => {
            const isSelected = activeNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => {
                  setActiveNoteId(note.id);
                  setIsEditing(false);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500/50 dark:bg-indigo-950/40 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/20'
                    : 'bg-card hover:bg-muted/30 border-border/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-bold text-muted-foreground uppercase">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNote(note.id, { pinned: !note.pinned });
                      }}
                      className={`p-1 rounded hover:bg-muted transition-colors ${
                        note.pinned ? 'text-amber-500' : 'text-muted-foreground'
                      }`}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                        if (activeNote?.id === note.id) {
                          setActiveNoteId(null);
                        }
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold leading-snug line-clamp-1">{note.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {note.content}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {note.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground text-xs">
              No notes match your filters.
            </div>
          )}
        </div>

        {/* Note Reader / Editor pane */}
        <div className="lg:col-span-7">
          {activeNote ? (
            <Card className="rounded-2xl border border-border/70 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                <div className="space-y-1">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="font-bold text-lg rounded-lg"
                      placeholder="Note Title..."
                    />
                  ) : (
                    <h3 className="text-xl font-bold tracking-tight">{activeNote.title}</h3>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {activeNote.category}
                    </span>
                    <span>•</span>
                    <span>Last updated {new Date(activeNote.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopyNote}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg gap-1 text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>

                  {isEditing ? (
                    <Button
                      onClick={handleSaveEdit}
                      size="sm"
                      className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1 text-xs"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStartEdit}
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-lg gap-1 text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={14}
                  className="font-mono text-sm leading-relaxed rounded-xl p-3"
                  placeholder="Type note markdown..."
                />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed min-h-[350px] p-2 bg-muted/10 rounded-xl">
                  {activeNote.content}
                </div>
              )}
            </Card>
          ) : (
            <div className="h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <BookOpen className="w-8 h-8 opacity-40" />
              <p className="text-sm font-medium">Select a note from the left to view or edit</p>
            </div>
          )}
        </div>
      </div>

      <CreateNoteModal open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen} />
    </div>
  );
};