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
  Volume1
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
    toast.info('🎙️ Escuchando tu voz en inglés...');

    try {
      const transcript = await speechEngine.listen();
      setIsRecording(false);
      setSpokenResult(transcript);

      const acc = speechEngine.calculateAccuracy(phrase.english, transcript);
      setAccuracy(acc);

      if (acc >= 75) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        addXp(20);
        toast.success(`🎉 ¡Excelente pronunciación! Precisión: ${acc}% (+20 XP)`);
        if (!isMastered) {
          toggleMasteredPhrase(phrase.id);
        }
      } else if (acc >= 40) {
        toast.warning(`👍 Buen intento (${acc}%). Escucha la versión lenta e inténtalo de nuevo.`);
      } else {
        toast.error(`💡 Precisión: ${acc}%. Intenta articular cada palabra con más claridad.`);
      }
    } catch (err: any) {
      setIsRecording(false);
      toast.error(err.message || 'Error con el micrófono.');
    }
  };

  return (
    <Card className={`rounded-2xl border-2 transition-all ${
      isMastered ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/80 bg-card'
    }`}>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold uppercase">
              {phrase.category}
            </Badge>
            <Badge className={`text-[10px] font-bold ${
              phrase.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-600' :
              phrase.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-600' :
              'bg-rose-500/10 text-rose-600'
            }`}>
              {phrase.difficulty}
            </Badge>
          </div>

          <button
            onClick={() => toggleMasteredPhrase(phrase.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isMastered ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground'
            }`}
            title={isMastered ? 'Dominada' : 'Marcar como dominada'}
          >
            {isMastered ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Target sentence */}
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight">{phrase.english}</h3>
          <p className="text-xs font-mono font-bold text-indigo-500">{phrase.ipa}</p>
          <p className="text-xs text-muted-foreground">🇲🇽 {phrase.spanish}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePlayAudio(0.9)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" /> Escuchar
            </Button>
            <Button
              onClick={() => handlePlayAudio(0.65)}
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 text-xs font-semibold"
            >
              <Volume1 className="w-4 h-4 text-indigo-500" /> Lento
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors text-xs font-bold flex items-center gap-1"
            >
              <Info className="w-4 h-4 text-indigo-500" /> Tips
            </button>

            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              size="sm"
              className={`rounded-xl gap-1.5 font-bold text-xs ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Escuchando...' : 'Grabar Voz'}
            </Button>
          </div>
        </div>

        {/* Tips box */}
        {showTips && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1 animate-in fade-in">
            <p className="font-bold text-indigo-900 dark:text-indigo-200">💡 Consejos de Pronunciación:</p>
            <p className="text-muted-foreground">{phrase.tips}</p>
            <p className="text-[11px] text-muted-foreground italic">Contexto: {phrase.exampleContext}</p>
          </div>
        )}

        {/* Result & accuracy */}
        {spokenResult && (
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Tu voz detectada:</span>
              <span className="text-emerald-600 font-extrabold">{accuracy}% Precisión</span>
            </div>
            <p className="text-xs font-semibold p-2.5 rounded-xl bg-muted/40 border">"{spokenResult}"</p>
            {accuracy !== null && (
              <Progress value={accuracy} className="h-2 rounded-full" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};