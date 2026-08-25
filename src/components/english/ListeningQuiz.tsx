"use client";

import React, { useState, useMemo } from 'react';
import { quizQuestions } from '@/data/englishData';
import { QuizQuestion, Level } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { useProgress } from '@/context/ProgressContext';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle,
  PartyPopper,
  ThumbsUp
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

  // Ordena preguntas priorizando las no intentadas y falladas previamente
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
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
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
        No hay preguntas disponibles para este nivel.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Encabezado y Selector de Nivel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Quiz Adaptativo de Escucha</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Preguntas inteligentes que priorizan reforzar tus áreas de oportunidad.
          </p>
        </div>

        {/* Pestañas de nivel táctiles */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border">
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
        <Card className="rounded-3xl border-2 border-indigo-500/20 shadow-xl p-5 sm:p-7 space-y-6 bg-card transition-all duration-300">
          {/* Barra superior de progreso */}
          <div className="flex items-center justify-between border-b pb-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-bold text-xs rounded-full px-3 py-0.5">
                Pregunta {currentIndex + 1} de {sessionQuestions.length}
              </Badge>
              <Badge className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                currentQ.level === 'basic' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
              }`}>
                {currentQ.level === 'basic' ? 'BÁSICO' : 'AVANZADO'}
              </Badge>
            </div>

            <span className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Score: {sessionScore}
            </span>
          </div>

          {/* Pregunta & Botón de Audio Grande */}
          <div className="space-y-4 text-center">
            <h3 className="text-base sm:text-xl font-extrabold text-foreground leading-relaxed">
              {currentQ.spanishPrompt}
            </h3>
            
            <Button
              onClick={handlePlayAudio}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[52px] px-6 gap-2.5 font-bold shadow-md shadow-indigo-600/25 active:scale-95 text-sm sm:text-base"
            >
              <Volume2 className="w-5 h-5" /> Escuchar Audio Pista
            </Button>
          </div>

          {/* Opciones de Respuesta Táctiles */}
          <div className="space-y-3 pt-2">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'border-border/80 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 bg-background';
              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30 animate-in zoom-in-95 duration-200';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/15 border-rose-400 text-rose-700 dark:text-rose-300 font-bold animate-in fade-in duration-200';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full min-h-[52px] sm:min-h-[56px] p-4 rounded-2xl border text-left text-sm sm:text-base font-semibold transition-all active:scale-98 flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
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

          {/* Banner de retroalimentación motivadora */}
          {selectedOption !== null && (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 ${
                selectedOption === currentQ.correctAnswer 
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30'
              }`}>
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <PartyPopper className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>¡Respuesta Correcta! ¡Excelente oído! 🌟 (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>¡Casi lo tienes! Repasar te ayudará a dominarlo 💪</span>
                  </>
                )}
              </div>

              {currentQ.explanation && (
                <div className="p-3.5 rounded-2xl bg-muted/60 border text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> Explicación:
                  </p>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <div className="pt-2 border-t flex justify-end">
                <Button 
                  onClick={handleNext} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[48px] px-6 gap-2 font-bold shadow-md shadow-indigo-600/25 active:scale-95"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* Pantalla de Fin de Quiz */
        <Card className="rounded-3xl border-2 border-indigo-500/30 p-8 text-center space-y-6 bg-card shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">¡Excelente Trabajo!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Completaste la ronda con <span className="font-extrabold text-foreground">{sessionScore}</span> de{' '}
              <span className="font-extrabold text-foreground">{sessionQuestions.length}</span> aciertos (+{sessionScore * 15} XP).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {failedInSession.length > 0 && (
              <Button
                onClick={handleReviewFailedOnly}
                variant="outline"
                className="rounded-2xl min-h-[48px] px-5 font-bold border-amber-500/40 text-amber-600 hover:bg-amber-500/10 gap-2 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Repasar {failedInSession.length} Fallada(s)
              </Button>
            )}

            <Button 
              onClick={handleRestartSession} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[48px] px-6 font-bold gap-2 shadow-md shadow-indigo-600/25 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Nueva Ronda Priorizada
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};