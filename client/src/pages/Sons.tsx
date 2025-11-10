import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Play, Pause, ArrowLeft, Timer, X, Sparkles, Zap } from "lucide-react";
import * as Tone from "tone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { NeuralBackground } from "@/components/NeuralBackground";
import { NeuralParticles } from "@/components/NeuralParticles";
import { SoundWaveVisualizer } from "@/components/SoundWaveVisualizer";
import { useToast } from "@/hooks/use-toast";

interface SomConfig {
  id: string;
  titulo: string;
  frequencia: number;
  tipo: OscillatorType;
  emoji: string;
  descricao: string;
  quando: string;
  cor: string;
}

interface PresetConfig {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  sons: { id: string; volume: number }[];
  cor: string;
}

const sonsConfig: SomConfig[] = [
  {
    id: "criativo",
    titulo: "Criatividade",
    frequencia: 40,
    tipo: "sine",
    emoji: "🎨",
    descricao: "Estimula imaginação e ideias",
    quando: "Para criar, desenhar e inventar",
    cor: "#FFD93D"
  },
  {
    id: "calma",
    titulo: "Calma",
    frequencia: 38,
    tipo: "sine",
    emoji: "💗",
    descricao: "Relaxamento e tranquilidade",
    quando: "Para relaxar e respirar fundo",
    cor: "#FF69B4"
  },
  {
    id: "foco",
    titulo: "Foco",
    frequencia: 42,
    tipo: "sine",
    emoji: "🧠",
    descricao: "Atenção e concentração",
    quando: "Para estudar e aprender",
    cor: "#6EC1E4"
  },
  {
    id: "energia",
    titulo: "Energia",
    frequencia: 44,
    tipo: "sine",
    emoji: "⚡",
    descricao: "Força e disposição",
    quando: "Para brincar e se movimentar",
    cor: "#FF4500"
  }
];

const presetsConfig: PresetConfig[] = [
  {
    id: "estudo",
    nome: "Sessão de Estudo",
    descricao: "Foco profundo com calma",
    emoji: "📚",
    sons: [
      { id: "foco", volume: 0.7 },
      { id: "calma", volume: 0.3 }
    ],
    cor: "#6EC1E4"
  },
  {
    id: "criacao",
    nome: "Modo Criação",
    descricao: "Criatividade com energia",
    emoji: "🚀",
    sons: [
      { id: "criativo", volume: 0.7 },
      { id: "energia", volume: 0.4 }
    ],
    cor: "#FFD93D"
  },
  {
    id: "relaxamento",
    nome: "Relaxamento Total",
    descricao: "Calma profunda",
    emoji: "🌙",
    sons: [
      { id: "calma", volume: 0.8 }
    ],
    cor: "#FF69B4"
  },
  {
    id: "equilibrio",
    nome: "Equilíbrio Neural",
    descricao: "Todos os sons em harmonia",
    emoji: "✨",
    sons: [
      { id: "criativo", volume: 0.4 },
      { id: "calma", volume: 0.4 },
      { id: "foco", volume: 0.4 },
      { id: "energia", volume: 0.3 }
    ],
    cor: "#C77DFF"
  }
];

export default function Sons() {
  const [, setLocation] = useLocation();
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { toast } = useToast();
  
  const oscillatorsRef = useRef<Record<string, Tone.Oscillator>>({});
  const gainsRef = useRef<Record<string, Tone.Gain>>({});
  const lfosRef = useRef<Record<string, Tone.Oscillator>>({});
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedVolumes: Record<string, number> = {};
    sonsConfig.forEach(som => {
      const saved = localStorage.getItem(`volume_${som.id}`);
      savedVolumes[som.id] = saved !== null ? parseFloat(saved) : 0.5;
    });
    setVolumes(savedVolumes);
  }, []);

  const handleVolumeChange = (id: string, value: number[]) => {
    const newVolume = value[0];
    setVolumes(prev => ({ ...prev, [id]: newVolume }));
    localStorage.setItem(`volume_${id}`, newVolume.toString());
    
    if (gainsRef.current[id]) {
      gainsRef.current[id].gain.rampTo(newVolume, 0.1);
    }
  };

  const startSound = async (som: SomConfig, volume?: number) => {
    await Tone.start();

    const oscillator = new Tone.Oscillator({
      type: som.tipo,
      frequency: som.frequencia
    });
    
    const userGain = new Tone.Gain(volume ?? volumes[som.id] ?? 0.6);
    const lfoGain = new Tone.Gain(0.25);
    
    const lfo = new Tone.Oscillator({
      type: "sine",
      frequency: 0.12
    });

    oscillator.connect(lfoGain);
    lfoGain.connect(userGain);
    userGain.toDestination();
    lfo.connect(lfoGain.gain);
    
    oscillator.start();
    lfo.start();

    oscillatorsRef.current[som.id] = oscillator;
    gainsRef.current[som.id] = userGain;
    lfosRef.current[som.id] = lfo;
  };

  const stopSound = (id: string) => {
    if (oscillatorsRef.current[id]) {
      oscillatorsRef.current[id].stop();
      oscillatorsRef.current[id].dispose();
      delete oscillatorsRef.current[id];
    }
    if (lfosRef.current[id]) {
      lfosRef.current[id].stop();
      lfosRef.current[id].dispose();
      delete lfosRef.current[id];
    }
    if (gainsRef.current[id]) {
      gainsRef.current[id].dispose();
      delete gainsRef.current[id];
    }
  };

  const toggleSound = async (som: SomConfig) => {
    if (activeSounds.has(som.id)) {
      stopSound(som.id);
      setActiveSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(som.id);
        return newSet;
      });
    } else {
      await startSound(som);
      setActiveSounds(prev => new Set(prev).add(som.id));
    }
  };

  const stopAllSounds = () => {
    activeSounds.forEach(id => stopSound(id));
    setActiveSounds(new Set());
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimer(null);
    setTimeRemaining(0);
  };

  const loadPreset = async (preset: PresetConfig) => {
    stopAllSounds();
    
    await Tone.start();
    
    for (const somConfig of preset.sons) {
      const som = sonsConfig.find(s => s.id === somConfig.id);
      if (som) {
        await startSound(som, somConfig.volume);
        setActiveSounds(prev => new Set(prev).add(som.id));
        setVolumes(prev => ({ ...prev, [som.id]: somConfig.volume }));
      }
    }

    toast({
      title: `${preset.emoji} ${preset.nome}`,
      description: preset.descricao,
    });
  };

  const startTimer = (minutes: number) => {
    setTimer(minutes);
    setTimeRemaining(minutes * 60);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopAllSounds();
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimer(null);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      Object.values(oscillatorsRef.current).forEach(osc => {
        osc.stop();
        osc.dispose();
      });
      Object.values(lfosRef.current).forEach(lfo => {
        lfo.stop();
        lfo.dispose();
      });
      Object.values(gainsRef.current).forEach(gain => {
        gain.dispose();
      });
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <NeuralBackground isActive={activeSounds.size > 0} />
      <NeuralParticles isActive={activeSounds.size > 0} />

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6"
            data-testid="button-voltar"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Menu
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" data-testid="text-title">
              🎵 Mixer Neural de Sons 🎵
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-6" data-testid="text-subtitle">
              Combine sons e crie sua atmosfera perfeita
            </p>

            {activeSounds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap gap-3 justify-center items-center mb-4"
              >
                <Badge variant="default" className="px-4 py-2 text-lg">
                  <Zap className="w-4 h-4 mr-2" />
                  {activeSounds.size} som{activeSounds.size > 1 ? 's' : ''} ativo{activeSounds.size > 1 ? 's' : ''}
                </Badge>
                
                {timer && (
                  <Badge variant="secondary" className="px-4 py-2 text-lg">
                    <Timer className="w-4 h-4 mr-2" />
                    {formatTime(timeRemaining)}
                  </Badge>
                )}
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopAllSounds}
                  data-testid="button-stop-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Parar Tudo
                </Button>
              </motion.div>
            )}
          </div>

          {/* Presets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Combinações Prontas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetsConfig.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card 
                    className="hover-elevate cursor-pointer h-full"
                    onClick={() => loadPreset(preset)}
                    data-testid={`card-preset-${preset.id}`}
                  >
                    <CardHeader className="text-center pb-3">
                      <motion.div
                        className="text-5xl mb-2"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {preset.emoji}
                      </motion.div>
                      <CardTitle className="text-lg md:text-xl">{preset.nome}</CardTitle>
                      <CardDescription className="text-sm">{preset.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {preset.sons.map(s => {
                          const som = sonsConfig.find(sc => sc.id === s.id);
                          return som ? (
                            <Badge key={s.id} variant="outline" className="text-xs">
                              {som.emoji}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Temporizador */}
          {activeSounds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    Temporizador Automático
                  </CardTitle>
                  <CardDescription>
                    Os sons vão parar automaticamente após o tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {!timer ? (
                      <>
                        <Button
                          onClick={() => startTimer(5)}
                          variant="outline"
                          data-testid="button-timer-5"
                        >
                          5 min
                        </Button>
                        <Button
                          onClick={() => startTimer(10)}
                          variant="outline"
                          data-testid="button-timer-10"
                        >
                          10 min
                        </Button>
                        <Button
                          onClick={() => startTimer(15)}
                          variant="outline"
                          data-testid="button-timer-15"
                        >
                          15 min
                        </Button>
                        <Button
                          onClick={() => startTimer(20)}
                          variant="outline"
                          data-testid="button-timer-20"
                        >
                          20 min
                        </Button>
                        <Button
                          onClick={() => startTimer(30)}
                          variant="outline"
                          data-testid="button-timer-30"
                        >
                          30 min
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Badge variant="default" className="text-xl px-4 py-2">
                          {formatTime(timeRemaining)}
                        </Badge>
                        <Button
                          onClick={cancelTimer}
                          variant="outline"
                          size="sm"
                          data-testid="button-cancel-timer"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Sons Individuais */}
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center">
            Sons Individuais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sonsConfig.map((som, index) => {
              const isActive = activeSounds.has(som.id);
              return (
                <motion.div
                  key={som.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <Card 
                    className="hover-elevate"
                    style={{
                      borderColor: isActive ? som.cor : undefined,
                      borderWidth: isActive ? '2px' : undefined,
                    }}
                    data-testid={`card-som-${som.id}`}
                  >
                    <CardHeader className="text-center pb-3">
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                        className="text-6xl mb-2"
                      >
                        {som.emoji}
                      </motion.div>
                      <CardTitle className="text-2xl md:text-3xl mb-2">
                        {som.titulo}
                      </CardTitle>
                      <CardDescription className="text-base md:text-lg">
                        {som.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Visualizador de Ondas */}
                      <SoundWaveVisualizer
                        isActive={isActive}
                        color={som.cor}
                        frequency={som.frequencia}
                      />

                      {/* Controle de Volume */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            Volume
                          </span>
                          <Badge variant="outline">
                            {Math.round((volumes[som.id] ?? 0.5) * 100)}%
                          </Badge>
                        </div>
                        <Slider
                          value={[volumes[som.id] ?? 0.5]}
                          onValueChange={(value) => handleVolumeChange(som.id, value)}
                          min={0}
                          max={1}
                          step={0.01}
                          className="w-full"
                          data-testid={`slider-volume-${som.id}`}
                        />
                      </div>

                      {/* Botão Play/Pause */}
                      <Button
                        onClick={() => toggleSound(som)}
                        className="w-full text-lg md:text-xl h-14 font-bold"
                        size="lg"
                        variant={isActive ? "destructive" : "default"}
                        data-testid={`button-toggle-${som.id}`}
                      >
                        {isActive ? (
                          <>
                            <Pause className="mr-2 h-5 w-5" />
                            Parar
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Tocar
                          </>
                        )}
                      </Button>

                      {/* Quando usar */}
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-foreground/80">
                          {som.quando}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Instruções */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 md:p-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg border-2 border-primary/20"
          >
            <h3 className="font-bold mb-4 text-2xl md:text-3xl text-center">✨ Como Usar ✨</h3>
            <ul className="space-y-3 text-base md:text-lg text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <span>Escolha uma "Combinação Pronta" ou crie sua própria mix</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <span>Toque vários sons ao mesmo tempo para criar sua atmosfera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <span>Ajuste o volume de cada som com o controle deslizante</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <span>Use o temporizador para parar automaticamente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <span>Use fones de ouvido para a melhor experiência!</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
