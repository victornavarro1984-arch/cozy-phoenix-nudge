"use client";

import React, { useState } from 'react';
import { PracticePhrase } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { useProgress } from '@/context/ProgressContext';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Info,
  CheckCircle2,
  Volume1,
  RotateCcw,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PronunciationCardProps {
  phrase: PracticePhrase;
}

export const PronunciationCard: React.FC<PronunciationCardProps> = ({ phrase }) => {
  const { isPhraseMastered, toggleMasteredPhrase, addXp } = useProgress();
  const [isRecording, setIsRecording] = useState(false);
  const [spokenResult, setSpokenResult] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);

  const isMastered = isPhraseMastered(phrase.id);

  const handlePlayAudio = (rate: number = 0.9) => {
    speechEngine.speak(phrase.english, rate);
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSpokenResult(null);
    setAccuracy(null);
    toast.info('🎙️ Escuchando tu voz... ¡Habla claro!', { duration: 2500 });

    try {
      const transcript = await speechEngine.listen();
      setIsRecording(false);
      setSpokenResult(transcript);

      const acc = speechEngine.calculateAccuracy(phrase.english, transcript);
      setAccuracy(acc);

      if (acc >= 75) {
        confetti({ particleCount: 60, spread: 65, origin: { y: 0.7 } });
        addXp(20);
        toast.success(`🎉 ¡Increíble pronunciación! Precisión: ${acc}% (+20 XP)`);
        if (!isMastered) {
          toggleMasteredPhrase(phrase.id);
        }
      } else if (acc >= 45) {
        toast.warning(`👏 ¡Muy buen intento (${acc}%)! Escucha la versión lenta y vuelve a probar.`);
      } else {
        toast.info(`💪 ¡Casi lo tienes! Escucha el audio e inténtalo otra vez.`);
      }
    } catch (err: any) {
      setIsRecording(false);
      toast.error(err.message || 'No se pudo conectar con el micrófono.');
    }
  };

  return (
    <Card className={`rounded-3xl border-2 transition-all duration-300 hover:shadow-md ${
      isMastered 
        ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-card' 
        : 'border-border/70 bg-card hover:border-indigo-500/30'
    }`}>
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Cabecera de Categoría y Marcador */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {phrase.category}
            </Badge>
            <Badge className={`text-[11px] font-bold rounded-full px-2.5 py-0.5 ${
              phrase.level === 'basic' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
            }`}>
              {phrase.level === 'basic' ? 'Básico' : 'Avanzado'}
            </Badge>
          </div>

          <button
            onClick={() => toggleMasteredPhrase(phrase.id)}
            className={`p-2 rounded-2xl transition-all active:scale-90 ${
              isMastered 
                ? 'text-emerald-600 bg-emerald-500/15 border border-emerald-500/30' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title={isMastered ? 'Frase Dominada' : 'Marcar como dominada'}
          >
            {isMastered ? <BookmarkCheck className="w-5 h-5 text-emerald-600" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Oración Objetivo */}
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
            {phrase.english}
          </h3>
          <p className="text-xs sm:text-sm font-mono font-bold text-indigo-500 dark:text-indigo-400">
            {phrase.ipa}
          </p>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            🇲🇽 {phrase.spanish}
          </p>
        </div>

        {/* Acciones e Interacción táctil cómoda */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePlayAudio(0.9)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl min-h-[44px] px-4 gap-2 text-xs sm:text-sm font-bold shadow-sm shadow-indigo-600/20 active:scale-95"
            >
              <Volume2 className="w-4 h-4" /> Escuchar
            </Button>

            <Button
              onClick={() => handlePlayAudio(0.65)}
              variant="outline"
              size="sm"
              className="rounded-2xl min-h-[44px] px-3.5 gap-1.5 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:scale-95"
              title="Escuchar a velocidad lenta"
            >
              <Volume1 className="w-4 h-4 text-indigo-500" /> Lento
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-2.5 rounded-2xl text-muted-foreground hover:bg-muted transition-colors text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <Info className="w-4 h-4 text-indigo-500" /> Tips
            </button>

            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              size="sm"
              className={`rounded-2xl min-h-[44px] px-4 gap-2 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Escuchando...' : 'Grabar Voz'}
            </Button>
          </div>
        </div>

        {/* Consejos emergentes */}
        {showTips && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
            <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              💡 Consejos de Pronunciación:
            </p>
            <p className="text-muted-foreground leading-relaxed">{phrase.tips}</p>
            <p className="text-[11px] text-muted-foreground italic pt-1">Contexto: {phrase.exampleContext}</p>
          </div>
        )}

        {/* Resultado de voz detectada y barra de puntuación animada */}
        {spokenResult && (
          <div className="space-y-2 pt-3 border-t animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-muted-foreground">Tu voz detectada:</span>
              <span className={`font-extrabold flex items-center gap-1 ${
                accuracy! >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                accuracy! >= 45 ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600'
              }`}>
                {accuracy! >= 75 && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                {accuracy}% Precisión
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold p-3 rounded-2xl bg-muted/50 border border-border/60">
              "{spokenResult}"
            </p>

            {accuracy !== null && (
              <div className="space-y-1">
                <Progress value={accuracy} className="h-2.5 rounded-full bg-muted" />
                <p className="text-[11px] font-semibold text-center pt-0.5">
                  {accuracy >= 75 ? '🌟 ¡Excelente articulación! Sigue así.' :
                   accuracy >= 45 ? '👏 ¡Buen avance! Un intento más para la perfección.' :
                   '💪 ¡No te desanimes! Vuelve a escuchar y repetir.'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};