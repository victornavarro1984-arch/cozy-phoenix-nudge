"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Zap,
  CloudRain,
  Radio,
  Waves,
  Music
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ambientSound } from '@/utils/audioSynth';

type Mode = 'work' | 'short_break' | 'long_break';
type AmbientTrack = 'off' | 'rain' | 'binaural' | 'brown';

const MODE_DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const PomodoroStation = () => {
  const { tasks, addFocusSession, focusSessions } = useWorkspace();
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientTrack, setAmbientTrack] = useState<AmbientTrack>('off');

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio playback unsupported', e);
    }
  };

  const handleAmbientChange = (track: AmbientTrack) => {
    setAmbientTrack(track);
    if (track === 'off') {
      ambientSound.stop();
    } else if (track === 'rain') {
      ambientSound.playRain();
    } else if (track === 'binaural') {
      ambientSound.playBinauralBeat();
    } else if (track === 'brown') {
      ambientSound.playBrownNoise();
    }
  };

  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();

      const activeTask = tasks.find((t) => t.id === selectedTaskId);
      addFocusSession({
        type: mode,
        durationMinutes: Math.round(MODE_DURATIONS[mode] / 60),
        taskTitle: activeTask ? activeTask.title : undefined,
      });

      if (mode === 'work') {
        setMode('short_break');
        setTimeLeft(MODE_DURATIONS.short_break);
      } else {
        setMode('work');
        setTimeLeft(MODE_DURATIONS.work);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, selectedTaskId]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const pendingTasks = tasks.filter((t) => t.status !== 'done');
  const todaySessions = focusSessions.filter(
    (s) => s.completedAt.split('T')[0] === new Date().toISOString().split('T')[0]
  );
  const totalFocusMinutesToday = todaySessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Focus & Flow Station</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Calibrate deep concentration, trigger neuro-focus states, and eliminate distractions.
        </p>
      </div>

      {/* Main Timer Card */}
      <Card className="rounded-3xl border-2 border-indigo-500/20 shadow-2xl bg-gradient-to-b from-card to-muted/30 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center space-y-8 relative z-10">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-full border">
            <button
              onClick={() => handleModeChange('work')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                mode === 'work'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🎯 Deep Work (25m)
            </button>
            <button
              onClick={() => handleModeChange('short_break')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                mode === 'short_break'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ☕ Short Break (5m)
            </button>
            <button
              onClick={() => handleModeChange('long_break')}
              className={`px-5 py-2 rounded-full text-xs<dyad-write path="src/components/pomodoro/PomodoroStation.tsx" description="Pomodoro station integrated with ambient sound synthesizers and focus audio">
"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Zap,
  CloudRain,
  Radio,
  Waves,
  Music
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ambientSound } from '@/utils/audioSynth';

type Mode = 'work' | 'short_break' | 'long_break';
type AmbientTrack = 'off' | 'rain' | 'binaural' | 'brown';

const MODE_DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const PomodoroStation = () => {
  const { tasks, addFocusSession, focusSessions } = useWorkspace();
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientTrack, setAmbientTrack] = useState<AmbientTrack>('off');

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio playback unsupported', e);
    }
  };

  const handleAmbientChange = (track: AmbientTrack) => {
    setAmbientTrack(track);
    if (track === 'off') {
      ambientSound.stop();
    } else if (track === 'rain') {
      ambientSound.playRain();
    } else if (track === 'binaural') {
      ambientSound.playBinauralBeat();
    } else if (track === 'brown') {
      ambientSound.playBrownNoise();
    }
  };

  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();

      const activeTask = tasks.find((t) => t.id === selectedTaskId);
      addFocusSession({
        type: mode,
        durationMinutes: Math.round(MODE_DURATIONS[mode] / 60),
        taskTitle: activeTask ? activeTask.title : undefined,
      });

      if (mode === 'work') {
        setMode('short_break');
        setTimeLeft(MODE_DURATIONS.short_break);
      } else {
        setMode('work');
        setTimeLeft(MODE_DURATIONS.work);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, selectedTaskId]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const pendingTasks = tasks.filter((t) => t.status !== 'done');
  const todaySessions = focusSessions.filter(
    (s) => s.completedAt.split('T')[0] === new Date().toISOString().split('T')[0]
  );
  const totalFocusMinutesToday = todaySessions.reduce((acc, s) => acc + (s.type === 'work' ? s.durationMinutes : 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Focus & Flow Station</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Calibrate deep concentration, trigger neuro-focus states, and eliminate distractions.
        </p>
      </div>

      {/* Main Timer Card */}
      <Card className="rounded-3xl border-2 border-indigo-500/20 shadow-2xl bg-gradient-to-b from-card to-muted/30 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center space-y-8 relative z-10">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-full border">
            <button
              onClick={() => handleModeChange('work')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                mode === 'work'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🎯 Deep Work (25m)
            </button>
            <button
              onClick={() => handleModeChange('short_break')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                mode === 'short_break'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ☕ Short Break (5m)
            </button>
            <button
              onClick={() => handleModeChange('long_break')}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                mode === 'long_break'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🌴 Long Break (15m)
            </button>
          </div>

          {/* Time digits */}
          <div className="text-center space-y-2">
            <span className="font-mono text-7xl md:text-9xl font-extrabold tracking-tight tabular-nums text-foreground drop-shadow-sm">
              {formattedTime}
            </span>
            <div className="w-64 md:w-80 mx-auto">
              <Progress value={progressPercent} className="h-3 rounded-full bg-muted" />
            </div>
          </div>

          {/* Task Linker & Ambient Sound selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-muted-foreground">Focusing on Task</label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="rounded-xl text-xs font-medium bg-background">
                  <SelectValue placeholder="Select deliverable..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">✨ General Unbound Focus</SelectItem>
                  {pendingTasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      [{t.category}] {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-muted-foreground">Ambient Soundscape</label>
              <Select value={ambientTrack} onValueChange={(val) => handleAmbientChange(val as AmbientTrack)}>
                <SelectTrigger className="rounded-xl text-xs font-medium bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">🔇 Silence</SelectItem>
                  <SelectItem value="rain">🌧️ Gentle Rain</SelectItem>
                  <SelectItem value="binaural">⚡ 40Hz Gamma Beat</SelectItem>
                  <SelectItem value="brown">☕ Cafe Brown Noise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-6 rounded-2xl font-bold text-base gap-2 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Start Focus
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-12 w-12 rounded-2xl"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-12 w-12 rounded-2xl text-muted-foreground"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Focus Session Log and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/60 bg-card flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Today's Focus Time</p>
            <p className="text-2xl font-bold">{totalFocusMinutesToday} mins</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/60 bg-card flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Sessions Completed</p>
            <p className="text-2xl font-bold">{todaySessions.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/60 bg-card flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Streak Multiplier</p>
            <p className="text-2xl font-bold">1.5x XP</p>
          </div>
        </div>
      </div>
    </div>
  );
};