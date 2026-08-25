"use client";

import React, { useState, useMemo } from 'react';
import { quizQuestions } from '@/data/englishData';
import { QuizQuestion, Level } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { useProgress } from '@/context/ProgressContext';
import { Volume2, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, RefreshCw, Filter, HelpCircle } from 'lucide-react';
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

  // Build sorted questions prioritizing: 
  // 1. Never attempted
  // 2. Previously failed or lowest success rate
  // 3. Mastered / answered correctly
  const prepareQuestions = (levelFilter: 'all' | Level, customPool?: QuizQuestion[]) => {
    const basePool = customPool || quizQuestions;
    const pool = levelFilter === 'all' 
      ? basePool 
      : basePool.filter((q) => q.level === levelFilter);

    const sorted = [...pool].sort((a, b) => {
      const histA = quizHistory[a.id];
      const histB = quizHistory[b.id];

      // Unattempted come first
      if (!histA && histB) return -1;
      if (histA && !histB) return 1;
      if (!histA && !histB) return Math.random() - 0.5;

      // Previously failed come next
      if (!histA.lastAnsweredCorrectly && histB.lastAnsweredCorrectly) return -1;
      if (histA.lastAnsweredCorrectly && !histB.lastAnsweredCorrectly) return 1;

      // Lower success rate priority
      const rateA = histA.correct / Math.max(1, histA.attempts);
      const rateB = histB.correct / Math.max(1, histB.attempts);
      return rateA - rateB;
    });

    return sorted.slice(0, 7); // Take top 7 prioritized questions
  };

  // Initialize or update on mount / level change
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

  // Randomize response choices so the correct answer isn't always in index 0
  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];
    return [...currentQ.options].sort(() => Math.random() - 0.5);
  }, [currentQ?.id]);

  const handlePlayAudio = () => {
    if (currentQ) {
      speechEngine.speak(currentQ.audioHint, 0.85);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.correctAnswer;
    recordQuizAnswer(currentQ.id, isCorrect);

    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
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
      <div className="text-center py-12 text-muted-foreground">
        No hay preguntas disponibles para este nivel.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Level Selection & Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Quiz Adaptativo Inteligente</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Prioriza preguntas no intentadas o falladas en intentos anteriores.
          </p>
        </div>

        {/* Level filter tabs */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLevel === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedLevel('basic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLevel === 'basic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setSelectedLevel('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLevel === 'advanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {!isFinished ? (
        <Card className="rounded-2xl border-2 border-indigo-500/20 shadow-lg p-6 space-y-6 bg-card">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-bold text-xs">
                Pregunta {currentIndex + 1} de {sessionQuestions.length}
              </Badge>
              <Badge className={`text-[10px] font-bold ${
                currentQ.level === 'basic' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-indigo-600'
              }`}>
                {currentQ.level.toUpperCase()}
              </Badge>
              {quizHistory[currentQ.id] && !quizHistory[currentQ.id].lastAnsweredCorrectly && (
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">
                  ⚠️ Repaso Requerido
                </Badge>
              )}
            </div>

            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              Score: {sessionScore}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-4 text-center">
            <h3 className="text-base md:text-lg font-bold text-foreground">{currentQ.spanishPrompt}</h3>
            
            <Button
              onClick={handlePlayAudio}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-bold shadow-md shadow-indigo-600/20"
            >
              <Volume2 className="w-5 h-5" /> Escuchar Pista
            </Button>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5 pt-2">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'border-border/70 hover:border-indigo-500/50 bg-background';
              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="pr-2">{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {selectedOption !== null && currentQ.explanation && (
            <div className="p-3.5 rounded-xl bg-muted/60 border text-xs text-muted-foreground space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" /> Explicación Gramatical:
              </p>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="pt-2 border-t flex justify-end">
              <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 font-bold">
                Siguiente <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      ) : (
        /* Results View */
        <Card className="rounded-2xl border-2 border-indigo-500/30 p-8 text-center space-y-6 bg-card">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold">¡Ronda Completada!</h3>
            <p className="text-sm text-muted-foreground">
              Obtuviste <span className="font-extrabold text-foreground">{sessionScore}</span> de{' '}
              <span className="font-extrabold text-foreground">{sessionQuestions.length}</span> aciertos en esta sesión (+{sessionScore * 15} XP).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {failedInSession.length > 0 && (
              <Button
                onClick={handleReviewFailedOnly}
                variant="outline"
                className="rounded-xl font-bold border-amber-500/40 text-amber-600 hover:bg-amber-500/10 gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Repasar {failedInSession.length} Pregunta(s) Fallada(s)
              </Button>
            )}

            <Button onClick={handleRestartSession} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold gap-1.5">
              <RefreshCw className="w-4 h-4" /> Nueva Ronda Priorizada
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};