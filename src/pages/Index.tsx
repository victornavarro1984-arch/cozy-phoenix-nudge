"use client";

import React, { useState } from 'react';
import { EnglishNavbar } from '@/components/english/EnglishNavbar';
import { PronunciationCard } from '@/components/english/PronunciationCard';
import { PhoneticsGuide } from '@/components/english/PhoneticsGuide';
import { ListeningQuiz } from '@/components/english/ListeningQuiz';
import { FlashcardDeck } from '@/components/english/FlashcardDeck';
import { practicePhrases } from '@/data/englishData';
import { Level } from '@/types/english';
import { useProgress } from '@/context/ProgressContext';
import { Sparkles, Search, Award, BookOpen, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MadeWithDyad } from '@/components/made-with-dyad';

export default function Index() {
  const { masteredPhrases, quizHistory } = useProgress();
  const [activeTab, setActiveTab] = useState<string>('practice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | Level>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPhrases = practicePhrases.filter((p) => {
    const matchesSearch =
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spanish.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesLvl = selectedLevel === 'all' || p.level === selectedLevel;
    return matchesSearch && matchesCat && matchesLvl;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500 selection:text-white">
      <EnglishNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 container max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Hero */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Laboratorio de Pronunciación en Vivo</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Perfecciona tu Habla y Dicción en Inglés
                </h1>
                <p className="text-xs md:text-sm text-indigo-200 max-w-xl">
                  Escucha la pronunciación nativa, graba tu voz con el micrófono y recibe retroalimentación inmediata sobre tu precisión.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-indigo-200">Dominadas</p>
                  <p className="text-lg font-extrabold">{masteredPhrases.length} / {practicePhrases.length}</p>
                </div>
                <div className="h-8 w-px bg-white/20 mx-1" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-indigo-200">Quizzes Intentados</p>
                  <p className="text-lg font-extrabold">{Object.keys(quizHistory).length}</p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/70 shadow-sm">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar frase o traducción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl text-xs bg-muted/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as any)}
                  className="text-xs bg-muted/60 border rounded-xl px-3 py-2 font-semibold outline-none"
                >
                  <option value="all">Todos los Niveles</option>
                  <option value="basic">Nivel Básico</option>
                  <option value="advanced">Nivel Avanzado</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs bg-muted/60 border rounded-xl px-3 py-2 font-semibold outline-none"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="Daily Life">Vida Cotidiana</option>
                  <option value="Travel & Food">Viajes y Comida</option>
                  <option value="Business">Negocios</option>
                  <option value="Linking & Reductions">Reducciones e Ilación</option>
                  <option value="Idioms">Modismos</option>
                </select>
              </div>
            </div>

            {/* Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPhrases.map((phrase) => (
                <PronunciationCard key={phrase.id} phrase={phrase} />
              ))}

              {filteredPhrases.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-2xl">
                  No se encontraron frases con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && <FlashcardDeck />}

        {activeTab === 'phonetics' && <PhoneticsGuide />}

        {activeTab === 'quiz' && <ListeningQuiz />}
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <MadeWithDyad />
      </footer>
    </div>
  );
}