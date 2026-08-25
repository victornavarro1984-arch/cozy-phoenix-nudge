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
  Star,
  RotateCcw
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
    toast.info('🎙️ ¡Te escucho! Habla claro frente al micrófono...');

    try {
      const transcript = await speechEngine.listen();
      setIsRecording(false);
      setSpokenResult(transcript);

      const acc = speechEngine.calculateAccuracy(phrase.english, transcript);
      setAccuracy(acc);

      if (acc >= 75) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        addXp(20);
        toast.success(`🎉 ¡Fantástico! Excelente pronunciación (${acc}%). ¡+20 XP!`);
        if (!isMastered) {
          toggleMasteredPhrase(phrase.id);
        }
      } else if (acc >= 40) {
        toast.warning(`💪 ¡Muy buen intento! (${acc}%). Escucha la velocidad lenta y pruébalo otra vez.`);
      } else {
        toast.error(`🎧 Precisión: ${acc}%. ¡No te preocupes! Vuelve a escuchar e inténtalo sin prisa.`);
      }
    } catch (err: any) {
      setIsRecording(false);
      toast.error(err.message || 'Error con el micrófono. Verifica los permisos.');
    }
  };

  return (
    <Card className={`rounded-3xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
      isMastered ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20' : 'border-border/80 bg-card'
    }`}>
      <CardContent className="p-5 md:p-6 space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border-muted-foreground/30">
              {phrase.category}
            </Badge>
            <Badge className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              phrase.difficulty === 'beginner' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
              phrase.difficulty === 'intermediate' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30' :
              'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
            }`}>
              {phrase.difficulty === 'beginner' ? '🟢 Básico' : phrase.difficulty === 'intermediate' ? '🟡 Intermedio' : '🔵 Avanzado'}
            </Badge>
          </div>

          <button
            onClick={() => toggleMasteredPhrase(phrase.id)}
            className={`p-2 rounded-full transition-all duration-200 active:scale-90 ${
              isMastered ? 'text-emerald-500 bg-emerald-500/15 shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title={isMastered ? 'Frase dominada' : 'Marcar como dominada'}
          >
            {isMastered ? <BookmarkCheck className="w-5 h-5 stroke-[2.5]" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Target sentence */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-snug">{phrase.english}</h3>
          <p className="text-xs md:text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{phrase.ipa}</p>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">🇲🇽 {phrase.spanish}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePlayAudio(0.9)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl px-4 py-2.5 min-h-[44px] gap-2 text-xs font-bold shadow-sm transition-all"
            >
              <Volume2 className="w-4 h-4" /> Escuchar
            </Button>
            <Button
              onClick={() => handlePlayAudio(0.65)}
              variant="outline"
              size="sm"
              className="rounded-2xl px-3.5 py-2.5 min-h-[44px] gap-1.5 text-xs font-semibold hover:bg-indigo-500/10 hover:text-indigo-600 transition-all"
            >
              <Volume1 className="w-4 h-4 text-indigo-500" /> Lento
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-2.5 rounded-2xl text-muted-foreground hover:bg-muted transition-colors text-xs font-bold flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-indigo-500" /> Consejos
            </button>

            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              size="sm"
              className={`rounded-2xl px-4 py-2.5 min-h-[44px] gap-2 font-bold text-xs transition-all active:scale-95 shadow-md ${
                isRecording
                  ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? '¡Escuchando!' : 'Grabar Voz'}
            </Button>
          </div>
        </div>

        {/* Tips Box */}
        {showTips && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1">
            <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Guía de Pronunciación:
            </p>
            <p className="text-muted-foreground leading-relaxed">{phrase.tips}</p>
            <p className="text-[11px] text-muted-foreground/80 italic pt-1">💡 Uso común: {phrase.exampleContext}</p>
          </div>
        )}

        {/* Audio Result & Visual Score */}
        {spokenResult && (
          <div className="space-y-2 pt-2 border-t animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground flex items-center gap-1">
                🗣️ Tu voz detectada:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                (accuracy ?? 0) >= 75 ? 'bg-emerald-500/15 text-emerald-600' :
                (accuracy ?? 0) >= 40 ? 'bg-amber-500/15 text-amber-600' : 'bg-rose-500/15 text-rose-600'
              }`}>
                {accuracy}% Precisión
              </span>
            </div>
            <p className="text-xs font-semibold p-3 rounded-2xl bg-muted/50 border leading-relaxed">"{spokenResult}"</p>
            {accuracy !== null && (
              <Progress value={accuracy} className="h-2.5 rounded-full bg-muted" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};