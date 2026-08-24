"use client";

import React, { useState } from 'react';
import { minimalPairs, phoneticSounds } from '@/data/englishData';
import { speechEngine } from '@/utils/speech';
import { Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const PhoneticsGuide = () => {
  const [activeTab, setActiveTab] = useState<'minimal' | 'symbols'>('minimal');

  const handlePlayWord = (word: string) => {
    speechEngine.speak(word, 0.85);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Entrenamiento de Oído y Fonética</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Aprende a diferenciar sonidos difíciles del inglés mediante Pares Mínimos y transcripción fonética AFI.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border">
          <button
            onClick={() => setActiveTab('minimal')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'minimal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pares Mínimos
          </button>
          <button
            onClick={() => setActiveTab('symbols')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'symbols'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Símbolos Fonéticos
          </button>
        </div>
      </div>

      {activeTab === 'minimal' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {minimalPairs.map((pair) => (
            <Card key={pair.id} className="rounded-2xl border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all">
              <CardHeader className="pb-2">
                <Badge className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold border-indigo-500/30">
                  {pair.soundFocus}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Word A */}
                  <div
                    onClick={() => handlePlayWord(pair.wordA.word)}
                    className="p-3.5 rounded-xl bg-muted/40 border hover:border-indigo-500/50 cursor-pointer text-center space-y-1 transition-all group"
                  >
                    <p className="text-lg font-extrabold group-hover:text-indigo-600 transition-colors">
                      {pair.wordA.word}
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-500">{pair.wordA.ipa}</p>
                    <p className="text-[11px] text-muted-foreground">🇲🇽 {pair.wordA.spanish}</p>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 font-bold">
                      <Volume2 className="w-3 h-3" /> Escuchar
                    </Button>
                  </div>

                  {/* Word B */}
                  <div
                    onClick={() => handlePlayWord(pair.wordB.word)}
                    className="p-3.5 rounded-xl bg-muted/40 border hover:border-indigo-500/50 cursor-pointer text-center space-y-1 transition-all group"
                  >
                    <p className="text-lg font-extrabold group-hover:text-indigo-600 transition-colors">
                      {pair.wordB.word}
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-500">{pair.wordB.ipa}</p>
                    <p className="text-[11px] text-muted-foreground">🇲🇽 {pair.wordB.spanish}</p>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 font-bold">
                      <Volume2 className="w-3 h-3" /> Escuchar
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-medium">
                  💡 <span className="font-bold">Diferencia Clave:</span> {pair.explanation}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {phoneticSounds.map((sound) => (
            <Card key={sound.id} className="rounded-2xl border border-border/70 p-5 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-mono text-2xl font-extrabold flex items-center justify-center shadow-md shadow-indigo-600/30">
                  {sound.symbol}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">{sound.soundName}</h3>
                  <p className="text-xs text-muted-foreground">{sound.description}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border text-xs font-medium">
                🇲🇽 <span className="font-bold">Consejo para hispanohablantes:</span> {sound.spanishTip}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {sound.examples.map((ex) => (
                  <button
                    key={ex.word}
                    onClick={() => handlePlayWord(ex.word)}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border hover:border-indigo-500/50 text-left transition-all"
                  >
                    <div>
                      <p className="font-bold text-sm">{ex.word}</p>
                      <p className="text-xs font-mono text-indigo-500">{ex.ipa}</p>
                      <p className="text-[10px] text-muted-foreground">{ex.spanish}</p>
                    </div>
                    <Volume2 className="w-4 h-4 text-indigo-500" />
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