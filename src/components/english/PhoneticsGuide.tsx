"use client";

import React, { useState } from 'react';
import { minimalPairs, phoneticSounds } from '@/data/englishData';
import { Level } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const PhoneticsGuide = () => {
  const [activeTab, setActiveTab] = useState<'minimal' | 'symbols'>('minimal');
  const [selectedLevel, setSelectedLevel] = useState<'all' | Level>('all');

  const handlePlayWord = (word: string) => {
    speechEngine.speak(word, 0.85);
  };

  const filteredPairs = minimalPairs.filter(
    (p) => selectedLevel === 'all' || p.level === selectedLevel
  );

  const filteredSounds = phoneticSounds.filter(
    (s) => selectedLevel === 'all' || s.level === selectedLevel
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Entrenamiento Fonético</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Diferencia sonidos difíciles mediante Pares Mínimos y transcripción AFI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de nivel */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="text-xs bg-card border rounded-2xl px-3 py-2 font-bold outline-none shadow-xs"
          >
            <option value="all">Todos los Niveles</option>
            <option value="basic">Nivel Básico</option>
            <option value="advanced">Nivel Avanzado</option>
          </select>

          {/* Selector de Pestaña */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border">
            <button
              onClick={() => setActiveTab('minimal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'minimal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pares Mínimos
            </button>
            <button
              onClick={() => setActiveTab('symbols')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'symbols'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Símbolos
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'minimal' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPairs.map((pair) => (
            <Card key={pair.id} className="rounded-3xl border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all bg-card">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <Badge className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold border-indigo-500/20 rounded-full px-3">
                  {pair.soundFocus}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase font-bold rounded-full">
                  {pair.level === 'basic' ? 'BÁSICO' : 'AVANZADO'}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Palabra A */}
                  <div
                    onClick={() => handlePlayWord(pair.wordA.word)}
                    className="p-4 rounded-2xl bg-muted/40 border hover:border-indigo-500/50 cursor-pointer text-center space-y-1 transition-all active:scale-95 group"
                  >
                    <p className="text-lg font-extrabold group-hover:text-indigo-600 transition-colors">
                      {pair.wordA.word}
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-500">{pair.wordA.ipa}</p>
                    <p className="text-[11px] text-muted-foreground">🇲🇽 {pair.wordA.spanish}</p>
                    <Button size="sm" variant="ghost" className="h-8 text-[11px] gap-1 font-bold mt-1">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-500" /> Escuchar
                    </Button>
                  </div>

                  {/* Palabra B */}
                  <div
                    onClick={() => handlePlayWord(pair.wordB.word)}
                    className="p-4 rounded-2xl bg-muted/40 border hover:border-indigo-500/50 cursor-pointer text-center space-y-1 transition-all active:scale-95 group"
                  >
                    <p className="text-lg font-extrabold group-hover:text-indigo-600 transition-colors">
                      {pair.wordB.word}
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-500">{pair.wordB.ipa}</p>
                    <p className="text-[11px] text-muted-foreground">🇲🇽 {pair.wordB.spanish}</p>
                    <Button size="sm" variant="ghost" className="h-8 text-[11px] gap-1 font-bold mt-1">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-500" /> Escuchar
                    </Button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-medium leading-relaxed border border-amber-500/20">
                  💡 <span className="font-bold">Diferencia Clave:</span> {pair.explanation}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSounds.map((sound) => (
            <Card key={sound.id} className="rounded-3xl border border-border/70 p-5 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-mono text-2xl font-extrabold flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                    {sound.symbol}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold">{sound.soundName}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sound.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold rounded-full">
                  {sound.level === 'basic' ? 'BÁSICO' : 'AVANZADO'}
                </Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border text-xs font-medium leading-relaxed">
                🇲🇽 <span className="font-bold">Consejo hispanohablante:</span> {sound.spanishTip}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {sound.examples.map((ex) => (
                  <button
                    key={ex.word}
                    onClick={() => handlePlayWord(ex.word)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-background border hover:border-indigo-500/50 text-left transition-all active:scale-98"
                  >
                    <div>
                      <p className="font-bold text-sm">{ex.word}</p>
                      <p className="text-xs font-mono text-indigo-500">{ex.ipa}</p>
                      <p className="text-[11px] text-muted-foreground">{ex.spanish}</p>
                    </div>
                    <Volume2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};