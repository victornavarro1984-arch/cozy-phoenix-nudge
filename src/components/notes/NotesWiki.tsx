"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Note } from '@/types';
import { 
  Plus, 
  Pin, 
  Trash2, 
  BookOpen,
  Edit3,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CreateNoteModal } from '@/components/modals/CreateNoteModal';

export const NotesWiki = () => {
  const { notes, updateNote, deleteNote, searchQuery } = useWorkspace();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSelectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!activeNote) return;
    updateNote(activeNote.id, {
      title: editTitle.trim() || activeNote.title,
      content: editContent,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base & Wiki</h2>
          <p className="text-xs md:text-sm text-<dyad-write path="src/components/notes/NotesWiki.tsx" description="Complete Knowledge Base & Wiki component with inline editor, tag filters, pinning, and deletion">
"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Note } from '@/types';
import { 
  Plus, 
  Pin, 
  Trash2, 
  BookOpen,
  Edit3,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CreateNoteModal } from '@/components/modals/CreateNoteModal';

export const NotesWiki = () => {
  const { notes, updateNote, deleteNote, searchQuery } = useWorkspace();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSelectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleStartEditing = () => {
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1.5 font-semibold"
        >
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      {/* Tag pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
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
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
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
                onClick={() => handleSelectNote(note)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500/50 dark:bg-indigo-950/30 dark:border-indigo-500/50 shadow-sm'
                    : 'bg-card hover:bg-muted/30 border-border/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-bold text-muted-foreground uppercase">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNote(note.id, { pinned: !note.pinned });
                      }}
                      className={`p-1 rounded hover:bg-muted transition-colors ${
                        note.pinned ? 'text-amber-500' : 'text-muted-foreground'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                        if (activeNote?.id === note.id) setActiveNoteId(null);
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
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
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex-1 mr-4">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="font-bold text-lg rounded-lg"
                      placeholder="Note Title"
                    />
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">{activeNote.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {activeNote.category}
                        </span>
                        <span>•</span>
                        <span>Last updated {new Date(activeNote.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleStartEditing}
                      className="rounded-lg gap-1 text-xs"
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
                  className="font-mono text-sm leading-relaxed rounded-xl w-full p-4"
                  placeholder="Type your notes in Markdown..."
                />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed min-h-[350px] p-2">
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