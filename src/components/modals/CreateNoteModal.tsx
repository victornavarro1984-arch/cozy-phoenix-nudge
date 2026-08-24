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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkspace } from '@/context/WorkspaceContext';

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ open, onOpenChange }) => {
  const { addNote } = useWorkspace();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Planning');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addNote({
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags.length > 0 ? tags : ['General'],
      pinned: false,
    });

    setTitle('');
    setContent('');
    setCategory('Planning');
    setTagsInput('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Knowledge Note</DialogTitle>
          <DialogDescription>
            Document architecture decisions, meeting notes, research, and quick thoughts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="note-title" className="text-xs font-semibold">
              Title *
            </Label>
            <Input
              id="note-title"
              placeholder="e.g., 💡 Edge Compute Architecture RFC"
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
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-tags" className="text-xs font-semibold">
                Tags (comma separated)
              </Label>
              <Input
                id="note-tags"
                placeholder="RFC, Security, Q3"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note-content" className="text-xs font-semibold">
              Note Body
            </Label>
            <Textarea
              id="note-content"
              placeholder="Write Markdown or plain text thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="rounded-lg font-mono text-sm leading-relaxed"
            />
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
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};