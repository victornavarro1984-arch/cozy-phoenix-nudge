"use client";

import React, { useState } from 'react';
import { PracticePhrase } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Volume1,
  Award,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PronunciationCardProps {
  phrase: PracticePhrase;
  onMastered?: () => void;
}

export const PronunciationCard: React.FC<PronunciationCardProps> = ({ phrase, onMastered }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenResult, setSpokenResult] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);

  const handlePlayAudio = (rate: number = playbackSpeed) => {
    speechEngine.speak(phrase.english, rate);
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSpokenResult(null);
    setAccuracy(null);
    toast.info('🎙️ Escuchando... Habla ahora en inglés');

    try {
      const transcript = await speechEngine.listen();
      setIsRecording(false);
      setSpokenResult(transcript);

      const acc = speechEngine.calculateAccuracy(phrase.english, transcript);
      setAccuracy(acc);

      if (acc >= 75) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        toast.success(`🎉 ¡Excelente pronunciación! Precisión: ${acc}%`);
        if (onMastered) onMastered();
      } else if (acc >= 40) {
        toast.warning(`👍 Buen intento. Precisión: ${acc}%. Revisa la pista fonética.`);
      } else {
        toast.error(`💡 Precisión: ${acc}%. Escucha el audio lento y vuelve a intentarlo.`);
      }
    } catch (err: any) {
      setIsRecording(false);
      toast.error(err.message || 'Error al acceder al micrófono.');
    }
  };

  const getDifficultyBadge = () => {
    switch (phrase.difficulty) {
      case 'beginner':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/30">🟢 Principiante</Badge>;
      case 'intermediate':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-amber-500/30">🟡 Intermedio</Badge>;
      case 'advanced':
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border-indigo-500/30">🟣 Avanzado</Badge>;
    }
  };

  return (
    <Card className="rounded-2xl border-2 border-indigo-500/20 shadow-md bg-gradient-to-b from-card to-muted/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {phrase.category}
          </Badge>
          {getDifficultyBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Main English Phrase & Phonetics */}
        <div className="text-center space-y-2 bg-muted/40 p-5 rounded-2xl border border-border/50">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
            "{phrase.english}"
          </h3>
          <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">
            {phrase.ipa}
          </p>
          <p className="text-xs text-muted-foreground italic font-medium pt-1">
            🇲🇽 {phrase.spanish}
          </p>
        </div>

        {/* Pronunciation Tip */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Pista de Pronunciación:</span> {phrase.tips}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePlayAudio(0.9)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 text-xs font-bold shadow-sm"
            >
              <Volume2 className="w-4 h-4" /> Escuchar (Normal)
            </Button>
            <Button
              onClick={() => handlePlayAudio(0.65)}
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 text-xs font-semibold"
            >
              <Volume1 className="w-4 h-4 text-indigo-500" /> Despacio (Lento)
            </Button>
          </div>

          <Button
            onClick={handleStartRecording}
            disabled={isRecording}
            size="sm"
            className={`rounded-xl gap-2 font-bold text-xs transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Escuchando...' : 'Grabar Mi Voz'}
          </Button>
        </div>

        {/* Feedback / Results Section */}
        {spokenResult && (
          <div className="space-y-3 pt-2 border-t animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Tu Reconocimiento de Voz:</span>
                <span
                  className={`px-2 py-0.5 rounded-md font-extrabold ${
                    (accuracy || 0) >= 75
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {accuracy}% Precisión
                </span>
              </div>
              <p className="text-sm font-semibold p-3 rounded-xl bg-background border font-sans">
                "{spokenResult}"
              </p>
            </div>

            {accuracy !== null && (
              <Progress
                value={accuracy}
                className={`h-2.5 rounded-full ${
                  accuracy >= 75 ? 'bg-emerald-500' : accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};