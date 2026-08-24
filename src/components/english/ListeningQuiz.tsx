"use client";

import React, { useState } from 'react';
import { quizQuestions } from '@/data/englishData';
import { speechEngine } from '@/utils/speech';
import { Volume2, CheckCircle2, XCircle, Award, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export const ListeningQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizQuestions[currentIndex];

  const handlePlayAudio = () => {
    speechEngine.speak(currentQ.audioHint, 0.85);
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null) return; // Prevent double select
    setSelectedOption(opt);

    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Quiz de Pronunciación y Audición</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Escucha con atención las pistas de voz nativa y selecciona la respuesta correcta.
        </p>
      </div>

      {!isFinished ? (
        <Card className="rounded-2xl border-2 border-indigo-500/20 shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <Badge variant="secondary" className="font-bold text-xs">
              Pregunta {currentIndex + 1} de {quizQuestions.length}
            </Badge>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Puntuación: {score}
            </span>
          </div>

          <div className="space-y-3 text-center">
            <h3 className="text-base font-bold text-foreground">{currentQ.spanishPrompt}</h3>
            
            <Button
              onClick={handlePlayAudio}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-bold shadow-md shadow-indigo-600/20"
            >
              <Volume2 className="w-5 h-5" /> Escuchar Pista de Audio
            </Button>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt) => {
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
                  <span>{opt}</span>
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

          {selectedOption !== null && (
            <div className="pt-4 border-t flex justify-end">
              <Button onClick={handleNext} className="bg-indigo-600 text-white rounded-xl gap-1.5 font-bold">
                Siguiente <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="rounded-2xl border-2 border-indigo-500/30 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold">¡Quiz Completado!</h3>
            <p className="text-sm text-muted-foreground">
              Obtuviste <span className="font-extrabold text-foreground">{score}</span> de{' '}
              <span className="font-extrabold text-foreground">{quizQuestions.length}</span> aciertos.
            </p>
          </div>

          <Button onClick={handleRestart} className="bg-indigo-600 text-white rounded-xl font-bold">
            Reiniciar Quiz
          </Button>
        </Card>
      )}
    </div>
  );
};