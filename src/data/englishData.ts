import { PracticePhrase, MinimalPair, PhoneticSound, QuizQuestion, ConversationScenario } from '@/types/english';

export const fontData = {};

export const practicePhrases: PracticePhrase[] = [
  {
    id: 'p1',
    english: 'Could you please slow down a bit?',
    spanish: '¿Podrías hablar un poco más despacio, por favor?',
    ipa: '/kʊd juː pliːz sləʊ daʊn ə bɪt/',
    difficulty: 'beginner',
    category: 'Daily Life',
    tips: 'La "L" en "could" es muda. No digas "culd", pronuncia /kʊd/.',
    exampleContext: 'Úsalo cuando hables con un hablante nativo y hable demasiado rápido.',
  },
  {
    id: 'p2',
    english: 'I would like to order a coffee to go.',
    spanish: 'Me gustaría pedir un café para llevar.',
    ipa: '/aɪ wʊd laɪk tə ˈɔːdər ə ˈkɒfi tə ɡəʊ/',
    difficulty: 'beginner',
    category: 'Travel & Food',
    tips: 'Une "would like" pronunciándolo suavemente como "I\'d like".',
    exampleContext: 'Frase imprescindible en cafeterías y restaurantes.',
  },
  {
    id: 'p3',
    english: 'I think this is a great opportunity.',
    spanish: 'Creo que esta es una gran oportunidad.',
    ipa: '/aɪ θɪŋk ðɪs ɪz ə ɡreɪt ˌɒpəˈtjuːnəti/',
    difficulty: 'intermediate',
    category: 'Business',
    tips: 'Coloca la lengua entre los dientes para la "TH" en "think" (/θ/) y "this" (/ð/).',
    exampleContext: 'Excelente frase para reuniones de trabajo o entrevistas.',
  },
  {
    id: 'p4',
    english: 'Let\'s call it a day and continue tomorrow.',
    spanish: 'Dejémoslo por hoy y continuemos mañana.',
    ipa: '/lets kɔːl ɪt ə deɪ ənd kənˈtɪnjuː təˈmɒrəʊ/',
    difficulty: 'intermediate',
    category: 'Idioms',
    tips: '"Call it a day" es un modismo común que significa terminar de trabajar por la jornada.',
    exampleContext: 'Se usa al final de una reunión o día laboral.',
  },
  {
    id: 'p5',
    english: 'Could you provide more details regarding the project deadline?',
    spanish: '¿Podrías proporcionar más detalles sobre la fecha límite del proyecto?',
    ipa: '/kʊd juː prəˈvaɪd mɔː ˈdiːteɪlz rɪˈɡɑːdɪŋ ðə ˈprɒdʒekt ˈdedlaɪn/',
    difficulty: 'advanced',
    category: 'Business',
    tips: 'Acentúa "DEADline" en la primera sílaba y mantén la "R" suave en "regarding".',
    exampleContext: 'Ideal para comunicación profesional formal.',
  },
  {
    id: 'p6',
    english: 'Where is the nearest subway station?',
    spanish: '¿Dónde está la estación de metro más cercana?',
    ipa: '/weər ɪz ðə ˈnɪərɪst ˈsʌbweɪ ˈsteɪʃn/',
    difficulty: 'beginner',
    category: 'Travel & Food',
    tips: 'En "station" (/steɪʃn/), la "ti" suena como "sh" (/ʃ/).',
    exampleContext: 'Muy útil al viajar por ciudades grandes.',
  }
];

export const minimalPairs: MinimalPair[] = [
  {
    id: 'mp1',
    soundFocus: 'Vocal corta /ɪ/ vs. Vocal larga /iː/',
    wordA: { word: 'Ship', ipa: '/ʃɪp/', spanish: 'Barco' },
    wordB: { word: 'Sheep', ipa: '/ʃiːp/', spanish: 'Oveja' },
    explanation: 'La /ɪ/ en "ship" es relajada y corta (casi entre E e I). La /iː/ en "sheep" es tensa y larga como sonriendo.',
  },
  {
    id: 'mp2',
    soundFocus: 'Sonido "TH" sordo /θ/ vs. Sonido "S" /s/',
    wordA: { word: 'Think', ipa: '/θɪŋk/', spanish: 'Pensar' },
    wordB: { word: 'Sink', ipa: '/sɪŋk/', spanish: 'Fregadero / Hundirse' },
    explanation: 'Para "Think", la lengua toca los dientes frontales dejando salir el aire. En "Sink", la lengua queda detrás de los dientes.',
  },
  {
    id: 'mp3',
    soundFocus: 'Sonido "B" /b/ vs. Sonido "V" labiodental /v/',
    wordA: { word: 'Berry', ipa: '/ˈberi/', spanish: 'Baya / Fruta' },
    wordB: { word: 'Very', ipa: '/ˈveri/', spanish: 'Muy' },
    explanation: 'En "Very", los dientes superiores apoyan suavemente sobre el labio inferior produciendo una pequeña vibración.',
  },
  {
    id: 'mp4',
    soundFocus: 'Vocal /æ/ vs. Vocal /ʌ/',
    wordA: { word: 'Cat', ipa: '/kæt/', spanish: 'Gato' },
    wordB: { word: 'Cut', ipa: '/kʌt/', spanish: 'Cortar' },
    explanation: '"Cat" abre la boca ampliamente tirando las comisuras hacia atrás. "Cut" abre la boca relajada y corta.',
  }
];

export const phoneticSounds: PhoneticSound[] = [
  {
    id: 'ps1',
    symbol: '/θ/',
    soundName: 'TH Sorda (Unvoiced TH)',
    description: 'Sonido producido colocando la punta de la lengua suavemente entre los dientes incisivos sin usar las cuerdas vocales.',
    spanishTip: 'Semejante a la "Z" en el español de España (como en "zapato"). Se sopla aire con la lengua entre los dientes.',
    examples: [
      { word: 'Think', ipa: '/θɪŋk/', spanish: 'Pensar' },
      { word: 'Three', ipa: '/θriː/', spanish: 'Tres' },
      { word: 'Thank you', ipa: '/θæŋk juː/', spanish: 'Gracias' },
    ]
  },
  {
    id: 'ps2',
    symbol: '/ð/',
    soundName: 'TH Sonora (Voiced TH)',
    description: 'Misma posición de la lengua que /θ/, pero haciendo vibrar las cuerdas vocales.',
    spanishTip: 'Imagina la "D" suave en español cuando dices "cada" o "nada", pero tocando los dientes con la lengua.',
    examples: [
      { word: 'This', ipa: '/ðɪs/', spanish: 'Este/Esta' },
      { word: 'Mother', ipa: '/ˈmʌðər/', spanish: 'Madre' },
      { word: 'Weather', ipa: '/ˈweðər/', spanish: 'Clima' },
    ]
  },
  {
    id: 'ps3',
    symbol: '/r/',
    soundName: 'R Americana Suave',
    description: 'La lengua se curva ligeramente hacia atrás sin tocar jamás el paladar ni los dientes.',
    spanishTip: 'A diferencia de la "R" fuerte o suave en español, la "R" en inglés NUNCA vibra ni toca el techo de la boca.',
    examples: [
      { word: 'Red', ipa: '/red/', spanish: 'Rojo' },
      { word: 'Right', ipa: '/raɪt/', spanish: 'Correcto / Derecha' },
      { word: 'Car', ipa: '/kɑːr/', spanish: 'Coche' },
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    targetEnglish: 'Could you please slow down a bit?',
    spanishPrompt: '¿Cómo pedirías amablemente que hablen más despacio?',
    ipa: '/kʊd juː pliːz sləʊ daʊn ə bɪt/',
    options: [
      'Could you please slow down a bit?',
      'Can you speak more fast please?',
      'Speak low down a bit please.',
      'Could you stop talking so quickly?'
    ],
    correctAnswer: 'Could you please slow down a bit?',
    audioHint: 'Could you please slow down a bit?'
  },
  {
    id: 'q2',
    targetEnglish: 'Ship',
    spanishPrompt: '¿Cuál palabra significa "Barco" con el sonido de vocal corta /ɪ/?',
    ipa: '/ʃɪp/',
    options: ['Sheep', 'Ship', 'Shape', 'Shop'],
    correctAnswer: 'Ship',
    audioHint: 'Ship'
  },
  {
    id: 'q3',
    targetEnglish: 'I think this is a great opportunity.',
    spanishPrompt: 'Selecciona la frase correcta con pronunciación de "TH":',
    ipa: '/aɪ θɪŋk ðɪs ɪz ə ɡreɪt ˌɒpəˈtjuːnəti/',
    options: [
      'I think this is a great opportunity.',
      'I sink dis is a great opportunity.',
      'I tink tis is a great opportunity.',
      'I thought this is a big opportunity.'
    ],
    correctAnswer: 'I think this is a great opportunity.',
    audioHint: 'I think this is a great opportunity.'
  }
];

export const conversationScenarios: ConversationScenario[] = [
  {
    id: 'sc1',
    title: '☕ Pedir Café en una Cafetería',
    description: 'Practica pedir tu bebida favorita y responde al cajero en un entorno cotidiano.',
    category: 'Travel & Food',
    difficulty: 'beginner',
    dialogue: [
      {
        id: 'd1',
        speaker: 'AI',
        english: 'Hi there! Welcome to Star Coffee. What can I get started for you today?',
        spanish: '¡Hola! Bienvenido a Star Coffee. ¿Qué puedo prepararte hoy?',
        ipa: '/haɪ ðeər! ˈwelkəm tə stɑː ˈkɒfi. wɒt kæn aɪ ɡet ˈstɑːtɪd fɔː juː təˈdeɪ?/',
      },
      {
        id: 'd2',
        speaker: 'User',
        english: 'Hi, I would like a large iced coffee with oat milk, please.',
        spanish: 'Hola, me gustaría un café helado grande con leche de avena, por favor.',
        ipa: '/haɪ, aɪ wʊd laɪk ə lɑːdʒ aɪst ˈkɒfi wɪð əʊt mɪlk, pliːz/',
        promptTip: 'Pronuncia "iced" (/aɪst/) claramente con el sonido final /t/.',
      },
      {
        id: 'd3',
        speaker: 'AI',
        english: 'Great choice! Would you like any pastry or muffin with that?',
        spanish: '¡Gran elección! ¿Te gustaría algún pastel o muffin para acompañar?',
        ipa: '/ɡreɪt tʃɔɪs! wʊd juː laɪk ˈeni ˈpeɪstri ɔː ˈmʌfɪn wɪð ðæt?/',
      },
      {
        id: 'd4',
        speaker: 'User',
        english: 'No thanks, just the coffee to go.',
        spanish: 'No gracias, solo el café para llevar.',
        ipa: '/nəʊ θæŋks, dʒʌst ðə ˈkɒfi tə ɡəʊ/',
        promptTip: 'Asegura el sonido /θ/ en "thanks".',
      },
    ],
  },
  {
    id: 'sc2',
    title: '🏨 Check-in en el Hotel',
    description: 'Simula el registro de entrada en la recepción de un hotel internacional.',
    category: 'Travel & Food',
    difficulty: 'intermediate',
    dialogue: [
      {
        id: 'd1',
        speaker: 'AI',
        english: 'Good afternoon! Welcome to the Grand Plaza. How may I assist you?',
        spanish: '¡Buenas tardes! Bienvenido al Grand Plaza. ¿En qué puedo ayudarle?',
        ipa: '/ɡʊd ˌɑːftəˈnuːn! ˈwelkəm tə ðə ɡrænd ˈplɑːzə. haʊ meɪ aɪ əˈsɪst juː?/',
      },
      {
        id: 'd2',
        speaker: 'User',
        english: 'Hello, I have a reservation under the name of Garcia.',
        spanish: 'Hola, tengo una reservación a nombre de García.',
        ipa: '/həˈləʊ, aɪ hæv ə ˌrezəˈveɪʃn ˈʌndər ðə neɪm əv ɡɑːˈsiːə/',
        promptTip: 'Acentúa "reserVAtion" (/ˌrezəˈveɪʃn/).',
      },
      {
        id: 'd3',
        speaker: 'AI',
        english: 'Perfect. May I please see your passport and a credit card for incidentals?',
        spanish: 'Perfecto. ¿Podría ver su pasaporte y una tarjeta de crédito para gastos imprevistos?',
        ipa: '/ˈpɜːfɪkt. meɪ aɪ pliːz siː jɔː ˈpɑːspɔːt ənd ə ˈkredɪt kɑːd fɔːr ˌɪnsɪˈdentlz?/',
      },
      {
        id: 'd4',
        speaker: 'User',
        english: 'Sure, here you go. Is breakfast included in the booking?',
        spanish: 'Claro, aquí tiene. ¿El desayuno está incluido en la reserva?',
        ipa: '/ʃʊər, hɪər juː ɡəʊ. ɪz ˈbrekfəst ɪnˈkluːdɪd ɪn ðə ˈbʊkɪŋ?/',
        promptTip: 'Pronuncia "breakfast" como /ˈbrekfəst/ (no brekFAST).',
      },
    ],
  },
];
</dyad-data>

<dyad-write path="src/components/english/ConversationPractice.tsx" description="Interactive AI dialogue roleplay component with live speech evaluation">
"use client";

import React, { useState } from 'react';
import { conversationScenarios } from '@/data/englishData';
import { ConversationScenario, DialogueTurn } from '@/types/english';
import { speechEngine } from '@/utils/speech';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw,
  Bot,
  User,
  Volume1
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const ConversationPractice = () => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario>(conversationScenarios[0]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [completedTurns, setCompletedTurns] = useState<number[]>([]);

  const turn = selectedScenario.dialogue[currentTurnIndex];

  const handlePlayTurnAudio = (text: string, rate: number = 0.9) => {
    speechEngine.speak(text, rate);
  };

  const handleRecordUserTurn = async () => {
    if (!turn || turn.speaker !== 'User') return;

    setIsRecording(true);
    setSpokenText(null);
    setAccuracy(null);
    toast.info('🎙️ Escuchando... Di tu frase en inglés');

    try {
      const transcript = await speechEngine.listen();
      setIsRecording(false);
      setSpokenText(transcript);

      const acc = speechEngine.calculateAccuracy(turn.english, transcript);
      setAccuracy(acc);

      if (acc >= 70) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        toast.success(`🎉 ¡Excelente! Precisión: ${acc}%`);
        if (!completedTurns.includes(currentTurnIndex)) {
          setCompletedTurns([...completedTurns, currentTurnIndex]);
        }
      } else {
        toast.warning(`👍 Intento registrado (${acc}% precisión). Practica la frase y repite.`);
      }
    } catch (err: any) {
      setIsRecording(false);
      toast.error(err.message || 'Error al usar el micrófono.');
    }
  };

  const handleNextTurn = () => {
    if (currentTurnIndex + 1 < selectedScenario.dialogue.length) {
      const nextIdx = currentTurnIndex + 1;
      setCurrentTurnIndex(nextIdx);
      setSpokenText(null);
      setAccuracy(null);

      // Auto play if next speaker is AI
      const nextTurn = selectedScenario.dialogue[nextIdx];
      if (nextTurn && nextTurn.speaker === 'AI') {
        setTimeout(() => {
          handlePlayTurnAudio(nextTurn.english);
        }, 300);
      }
    }
  };

  const handleRestartScenario = () => {
    setCurrentTurnIndex(0);
    setSpokenText(null);
    setAccuracy(null);
    setCompletedTurns([]);
    if (selectedScenario.dialogue[0]?.speaker === 'AI') {
      handlePlayTurnAudio(selectedScenario.dialogue[0].english);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Práctica de Conversación y Diálogo</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Simula situaciones de la vida real interactuando turno a turno con voz en inglés.
          </p>
        </div>

        {/* Scenario selector */}
        <select
          value={selectedScenario.id}
          onChange={(e) => {
            const sc = conversationScenarios.find((s) => s.id === e.target.value);
            if (sc) {
              setSelectedScenario(sc);
              setCurrentTurnIndex(0);
              setSpokenText(null);
              setAccuracy(null);
              setCompletedTurns([]);
            }
          }}
          className="text-xs bg-card border rounded-xl px-3 py-2 font-bold shadow-sm outline-none"
        >
          {conversationScenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.category})
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Progress Header */}
      <Card className="rounded-2xl border-2 border-indigo-500/20 shadow-md p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg">{selectedScenario.title}</h3>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {selectedScenario.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{selectedScenario.description}</p>
          </div>

          <Button
            onClick={handleRestartScenario}
            variant="outline"
            size="sm"
            className="rounded-xl gap-1 text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
          </Button>
        </div>

        {/* Dialogue Stream */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {selectedScenario.dialogue.map((d, idx) => {
            const isCurrent = idx === currentTurnIndex;
            const isAI = d.speaker === 'AI';

            return (
              <div
                key={d.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  isCurrent
                    ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-muted/30 border-border/50 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isAI ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isAI ? 'Interlocutor (IA)' : 'Tu Turno (Usuario)'}
                    </span>
                  </div>

                  <Button
                    onClick={() => handlePlayTurnAudio(d.english)}
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Reproducir
                  </Button>
                </div>

                <p className="font-extrabold text-base md:text-lg tracking-tight">"{d.english}"</p>
                {d.ipa && <p className="text-xs font-mono text-indigo-500 font-bold">{d.ipa}</p>}
                <p className="text-xs text-muted-foreground">🇲🇽 {d.spanish}</p>

                {d.promptTip && (
                  <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg">
                    💡 <span className="font-bold">Consejo:</span> {d.promptTip}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar for Current Turn */}
        {turn && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {turn.speaker === 'AI' ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePlayTurnAudio(turn.english, 0.9)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" /> Escuchar Voz IA
                  </Button>
                  <Button
                    onClick={() => handlePlayTurnAudio(turn.english, 0.65)}
                    variant="outline"
                    className="rounded-xl gap-1.5 text-xs font-semibold"
                  >
                    <Volume1 className="w-4 h-4" /> Escuchar Lento
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRecordUserTurn}
                  disabled={isRecording}
                  className={`rounded-xl gap-2 font-bold text-xs shadow-md ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Escuchando tu respuesta...' : 'Grabar Mi Respuesta'}
                </Button>
              )}

              {currentTurnIndex + 1 < selectedScenario.dialogue.length && (
                <Button
                  onClick={handleNextTurn}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 text-xs font-bold"
                >
                  Siguiente Turno <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {spokenText && (
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Tu Transcripción:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{accuracy}% Precisión</span>
                </div>
                <p className="text-xs font-semibold p-2.5 rounded-xl bg-muted/40 border">"{spokenText}"</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};