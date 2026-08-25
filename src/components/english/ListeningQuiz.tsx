"use client";

import React, { useState, useMemo } from 'react';
import { quizQuestions } from '@/data/englishData';
import { QuizQuestion, Level } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { useProgress } from '@/context/ProgressContext';
import { 
  Volume2, 
  Volume1, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle, 
  Star, 
  ThumbsUp,
  Ear
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export const ListeningQuiz = () => {
  const { quizHistory, recordQuizAnswer } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState<'all' | Level>('all');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [failedInSession, setFailedInSession] = useState<QuizQuestion[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const prepareQuestions = (levelFilter: 'all' | Level, customPool?: QuizQuestion[]) => {
    const basePool = customPool || quizQuestions;
    const pool = levelFilter === 'all' 
      ? basePool 
      : basePool.filter((q) => q.level === levelFilter);

    const sorted = [...pool].sort((a, b) => {
      const histA = quizHistory[a.id];
      const histB = quizHistory[b.id];

      if (!histA && histB) return -1;
      if (histA && !histB) return 1;
      if (!histA && !histB) return Math.random() - 0.5;

      if (!histA.lastAnsweredCorrectly && histB.lastAnsweredCorrectly) return -1;
      if (histA.lastAnsweredCorrectly && !histB.lastAnsweredCorrectly) return 1;

      const rateA = histA.correct / Math.max(1, histA.attempts);
      const rateB = histB.correct / Math.max(1, histB.attempts);
      return rateA - rateB;
    });

    return sorted.slice(0, 7);
  };

  React.useEffect(() => {
    const active = prepareQuestions(selectedLevel);
    setSessionQuestions(active);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSessionScore(0);
    setFailedInSession([]);
    setIsFinished(false);
  }, [selectedLevel]);

  const currentQ = sessionQuestions[currentIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];
    return [...currentQ.options].sort(() => Math.random() - 0.5);
  }, [currentQ?.id]);

  const handlePlayAudio = (rate: number = 0.85) => {
    if (currentQ) {
      speechEngine.speak(currentQ.audioHint, rate);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.correctAnswer;
    recordQuizAnswer(currentQ.id, isCorrect);

    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFailedInSession((prev) => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleRestartSession = () => {
    const active = prepareQuestions(selectedLevel);
    setSessionQuestions(active);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSessionScore(0);
    setFailedInSession([]);
    setIsFinished(false);
  };

  const handleReviewFailedOnly = () => {
    if (failedInSession.length === 0) return;
    const active = prepareQuestions(selectedLevel, failedInSession);
    setSessionQuestions(active);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSessionScore(0);
    setFailedInSession([]);
    setIsFinished(false);
  };

  if (!currentQ && !isFinished) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm font-medium">
        No hay preguntas disponibles para este nivel. ¡Prueba cambiando el filtro arriba!
      </div>
    );
  }

  // Render sentence with blank or filled word
  const renderSentenceText = () => {
    if (!currentQ) return null;

    if (selectedOption === null) {
      const parts = currentQ.sentenceWithBlank.split('___');
      return (
        <p className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-relaxed">
          {parts[0]}
          <span className="inline-block px-3 py-1 my-1 mx-1 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-500 underline decoration-2 underline-offset-4 font-mono font-black">
            ___
          </span>
          {parts[1]}
        </p>
      );
    } else {
      const isCorrect = selectedOption === currentQ.correctAnswer;
      const parts = currentQ.sentenceWithBlank.split('___');
      return (
        <p className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-relaxed">
          {parts[0]}
          <span className={`inline-block px-3 py-1 my-1 mx-1 rounded-xl font-mono font-black text-white shadow-md ${
            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {selectedOption}
          </span>
          {parts[1]}
        </p>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Ear className="w-6 h-6 text-indigo-500" /> Quiz de Audición Práctica
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Escucha el audio completo y selecciona la palabra correcta que completa la oración.
          </p>
        </div>

        {/* Level filter tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border shadow-sm">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedLevel('basic')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === 'basic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setSelectedLevel('advanced')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === 'advanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {!isFinished ? (
        <Card className="rounded-3xl border-2 border-indigo-500/20 shadow-lg p-6 md:p-8 space-y-6 bg-card transition-all">
          {/* Top Progress Bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full">
                Pregunta {currentIndex + 1} de {sessionQuestions.length}
              </Badge>
              <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentQ.level === 'basic' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-indigo-500/15 text-indigo-600'
              }`}>
                {currentQ.level === 'basic' ? '🟢 BÁSICO' : '🔵 AVANZADO'}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Puntos: {sessionScore * 15}</span>
            </div>
          </div>

          {/* Fill-in-the-blank Sentence & Translation */}
          <div className="space-y-3 text-center py-2 bg-muted/30 p-5 rounded-2xl border">
            {renderSentenceText()}
            <p className="text-xs md:text-sm text-muted-foreground font-medium">🇲🇽 {currentQ.spanishPrompt}</p>
          </div>

          {/* Audio Controls (Normal & Slow) */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <Button
              onClick={() => handlePlayAudio(0.85)}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl px-5 py-3 min-h-[48px] gap-2 font-bold shadow-md shadow-indigo-600/20 text-xs md:text-sm transition-all"
            >
              <Volume2 className="w-4 h-4" /> Escuchar (Normal)
            </Button>
            <Button
              onClick={() => handlePlayAudio(0.6)}
              variant="outline"
              size="lg"
              className="rounded-2xl px-4 py-3 min-h-[48px] gap-2 font-bold text-xs md:text-sm border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-all"
            >
              <Volume1 className="w-4 h-4" /> 🐢 Escuchar (Lento)
            </Button>
          </div>

          {/* Phonetic Word Options */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wider">
              ¿Cuál palabra completa la oración?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {shuffledOptions.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnStyle = 'border-border/80 hover:border-indigo-500/60 bg-background hover:bg-muted/40';
                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-sm animate-in zoom-in-95 duration-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 font-bold animate-in shake duration-200';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={selectedOption !== null}
                    className={`min-h-[56px] p-4 rounded-2xl border text-center text-base md:text-lg font-bold font-mono transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    )}
                    {selectedOption !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Encouraging Feedback & Explanation */}
          {selectedOption !== null && (
            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {selectedOption === currentQ.correctAnswer ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-500" />
                  <span>¡Excelente oído! Identificaste la palabra correcta (+15 XP).</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  <span>¡La palabra correcta era "{currentQ.correctAnswer}"! Escucha el audio lento para afinar el oído.</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-muted/60 border text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-indigo-500" /> Nota y transcripción:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{currentQ.ipa}</span>
                </p>
                <p className="leading-relaxed pt-1">{currentQ.explanation}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 min-h-[46px] font-bold gap-2 text-sm shadow-md transition-all">
                  Siguiente Pregunta <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* Final Session Summary Card */
        <Card className="rounded-3xl border-2 border-indigo-500/30 p-8 md:p-10 text-center space-y-6 bg-card shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">¡Ronda de Audición Completada! 🎉</h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Completaste <span className="font-extrabold text-foreground">{sessionScore}</span> de{' '}
              <span className="font-extrabold text-foreground">{sessionQuestions.length}</span> ejercicios correctamente. ¡Has ganado <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">+{sessionScore * 15} XP</span>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {failedInSession.length > 0 && (
              <Button
                onClick={handleReviewFailedOnly}
                variant="outline"
                className="rounded-2xl min-h-[46px] px-5 font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 gap-2 text-xs md:text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Repasar {failedInSession.length} Fallada(s)
              </Button>
            )}

            <Button onClick={handleRestartSession} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[46px] px-6 font-bold gap-2 text-xs md:text-sm shadow-md">
              <RefreshCw className="w-4 h-4" /> Nueva Ronda Priorizada
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};