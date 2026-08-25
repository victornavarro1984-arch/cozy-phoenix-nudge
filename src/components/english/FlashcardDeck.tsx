"use client";

import React, { useState } from 'react';
import { flashcards } from '@/data/englishData';
import { speechEngine } from '@/utils/speech';
import { useProgress } from '@/context/ProgressContext';
import { 
  Volume2, 
  RotateCw, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export const FlashcardDeck = () => {
  const { isFlashcardMastered, toggleMasteredFlashcard, masteredFlashcards } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = flashcards[currentIndex];

  const handlePlayWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speechEngine.speak(card.word, 0.85);
  };

  const handleToggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasMastered = isFlashcardMastered(card.id);
    toggleMasteredFlashcard(card.id);
    if (!wasMastered) {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const isMastered = isFlashcardMastered(card.id);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Título & Progreso */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Mazo de Vocabulario</h2>
          <p className="text-xs text-muted-foreground">
            Toca la tarjeta para voltearla y revisar la definición.
          </p>
        </div>

        <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full border">
          {masteredFlashcards.length} / {flashcards.length} Dominadas
        </Badge>
      </div>

      {/* Contenedor de la Tarjeta con Volteo 3D */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 sm:h-84 cursor-pointer [perspective:1000px] group select-none"
      >
        <div
          className={`relative w-full h-full rounded-3xl transition-all duration-500 [transform-style:preserve-3d] shadow-xl border-2 border-indigo-500/20 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* FRENTE */}
          <Card className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center [backface-visibility:hidden] bg-gradient-to-b from-card via-card to-muted/40">
            <div className="flex items-center justify-between w-full">
              <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-full px-2.5">
                {card.category}
              </Badge>
              <button
                onClick={handleToggleMastered}
                className={`p-2 rounded-2xl transition-all active:scale-90 ${
                  isMastered ? 'text-emerald-600 bg-emerald-500/15 border border-emerald-500/30' : 'text-muted-foreground hover:text-emerald-500'
                }`}
                title={isMastered ? 'Dominada' : 'Marcar como Dominada'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-2">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{card.word}</h3>
              <p className="text-sm font-mono text-indigo-500 dark:text-indigo-400 font-bold">{card.ipa}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                ({card.partOfSpeech})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlayWord}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[44px] px-4 gap-2 text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> Escuchar
              </Button>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                <RotateCw className="w-3.5 h-3.5 text-indigo-500" /> Voltear
              </span>
            </div>
          </Card>

          {/* REVERSO */}
          <Card className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-b from-slate-900 to-indigo-950 text-white shadow-xl">
            <div className="w-full text-right">
              <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                Traducción & Contexto
              </span>
            </div>

            <div className="space-y-3 py-2">
              <h4 className="text-xl sm:text-2xl font-extrabold text-amber-400">{card.definitionSpanish}</h4>
              <p className="text-xs sm:text-sm italic text-indigo-200 leading-relaxed max-w-sm mx-auto">
                "{card.exampleSentence}"
              </p>
            </div>

            <Button
              onClick={handlePlayWord}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white rounded-2xl min-h-[44px] px-4 gap-2 text-xs font-bold border border-white/20 active:scale-95"
            >
              <Volume2 className="w-4 h-4" /> Pronunciación
            </Button>
          </Card>
        </div>
      </div>

      {/* Navegación táctil inferior */}
      <div className="flex items-center justify-between pt-2">
        <Button
          onClick={handlePrev}
          variant="outline"
          size="sm"
          className="rounded-2xl min-h-[44px] px-4 gap-2 text-xs font-bold active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </Button>

        <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border">
          {currentIndex + 1} / {flashcards.length}
        </span>

        <Button
          onClick={handleNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[44px] px-4 gap-2 text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95"
        >
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};