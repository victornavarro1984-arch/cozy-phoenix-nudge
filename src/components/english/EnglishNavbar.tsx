"use client";

import React, { useEffect, useState } from 'react';
import { 
  Volume2, 
  Mic, 
  Award, 
  Layers, 
  Flame,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useProgress } from '@/context/ProgressContext';

interface EnglishNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const EnglishNavbar: React.FC<EnglishNavbarProps> = ({ activeTab, setActiveTab }) => {
  const { xp, streak } = useProgress();
  const [animateXp, setAnimateXp] = useState(false);

  useEffect(() => {
    setAnimateXp(true);
    const timeout = setTimeout(() => setAnimateXp(false), 700);
    return () => clearTimeout(timeout);
  }, [xp]);

  const navItems = [
    { id: 'practice', label: 'Práctica de Voz', icon: Mic },
    { id: 'flashcards', label: 'Tarjetas', icon: BookOpen },
    { id: 'phonetics', label: 'Fonética', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <Volume2 className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                FLUENT VOICE
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 rounded-full px-2">
                PRO
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block font-medium">Laboratorio de Voz e Inglés Práctico</p>
          </div>
        </div>

        {/* User stats widget */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streak} <span className="hidden sm:inline">Días</span></span>
          </div>

          <div className={`flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm transition-all duration-300 ${
            animateXp ? 'scale-110 bg-indigo-500/25 border-indigo-500 ring-2 ring-indigo-500/30' : ''
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{xp} XP</span>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex px-4 md:px-8 border-t bg-muted/20 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};