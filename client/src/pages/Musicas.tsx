import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Play, Pause, ArrowLeft, Music, SkipForward, Music2, Music3, Music4, Disc, Disc3, Radio, Headphones, Mic2, Guitar, Piano, Drum, Volume2, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NeuralBackground } from "@/components/NeuralBackground";
import { NeuralParticles } from "@/components/NeuralParticles";

interface MusicaConfig {
  id: string;
  titulo: string;
  arquivo: string;
  icon: any;
  cor: string;
}

const musicasConfig: MusicaConfig[] = [
  {
    id: "ba",
    titulo: "Ba Be Bi Bo Bu",
    arquivo: "/sounds/ba-be-bi-bo-bu.mp3",
    icon: Music2,
    cor: "#C77DFF"
  },
  {
    id: "pa",
    titulo: "Pa Pe Pi Po Pu",
    arquivo: "/sounds/pa-pe-pi-po-pu.mp3",
    icon: Disc,
    cor: "#6EC1E4"
  },
  {
    id: "la",
    titulo: "La Le Li Lo Lu",
    arquivo: "/sounds/la-le-li-lo-lu.mp3",
    icon: Music3,
    cor: "#90EE90"
  },
  {
    id: "fa",
    titulo: "Fa Fe Fi Fo Fu",
    arquivo: "/sounds/fa-fe-fi-fo-fu.mp3",
    icon: Radio,
    cor: "#FFD93D"
  },
  {
    id: "sa",
    titulo: "Sa Se Si So Su",
    arquivo: "/sounds/sa-se-si-so-su.mp3",
    icon: Headphones,
    cor: "#FF69B4"
  },
  {
    id: "ca",
    titulo: "Ca Ce Ci Co Cu",
    arquivo: "/sounds/ca-ce-ci-co-cu.mp3",
    icon: Mic2,
    cor: "#FF8C42"
  },
  {
    id: "ta",
    titulo: "Ta Te Ti To Tu",
    arquivo: "/sounds/ta-te-ti-to-tu.mp3",
    icon: Music4,
    cor: "#4A90E2"
  },
  {
    id: "da",
    titulo: "Da De Di Do Du",
    arquivo: "/sounds/da-de-di-do-du.mp3",
    icon: Guitar,
    cor: "#9B59B6"
  },
  {
    id: "ma",
    titulo: "Ma Me Mi Mo Mu",
    arquivo: "/sounds/ma-me-mi-mo-mu.mp3",
    icon: Piano,
    cor: "#2ECC71"
  },
  {
    id: "na",
    titulo: "Na Ne Ni No Nu",
    arquivo: "/sounds/na-ne-ni-no-nu.mp3",
    icon: Drum,
    cor: "#A0826D"
  },
  {
    id: "ra",
    titulo: "Ra Re Ri Ro Ru",
    arquivo: "/sounds/ra-re-ri-ro-ru.mp3",
    icon: Volume2,
    cor: "#E74C3C"
  },
  {
    id: "ga",
    titulo: "Ga Ge Gi Go Gu",
    arquivo: "/sounds/ga-ge-gi-go-gu.mp3",
    icon: Disc3,
    cor: "#5DADE2"
  },
  {
    id: "za",
    titulo: "Za Ze Zi Zo Zu",
    arquivo: "/sounds/za-ze-zi-zo-zu.mp3",
    icon: Waves,
    cor: "#F7B7D0"
  }
];

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Musicas() {
  const [, setLocation] = useLocation();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState<Record<string, number>>({});
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const updateProgress = (id: string) => (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      setCurrentTime(prev => ({ ...prev, [id]: audio.currentTime }));
    };

    const updateDuration = (id: string) => (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      setDuration(prev => ({ ...prev, [id]: audio.duration }));
    };

    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      audio.addEventListener('timeupdate', updateProgress(id));
      audio.addEventListener('loadedmetadata', updateDuration(id));
    });

    return () => {
      Object.entries(audioRefs.current).forEach(([id, audio]) => {
        audio.removeEventListener('timeupdate', updateProgress(id));
        audio.removeEventListener('loadedmetadata', updateDuration(id));
      });
    };
  }, []);

  const playNextSong = () => {
    if (!playingId) return;
    
    const currentIndex = musicasConfig.findIndex(m => m.id === playingId);
    if (currentIndex < musicasConfig.length - 1) {
      const nextMusica = musicasConfig[currentIndex + 1];
      handlePlayStop(nextMusica);
    } else {
      setPlayingId(null);
    }
  };

  const handlePlayStop = (musica: MusicaConfig) => {
    if (playingId === musica.id) {
      const audio = audioRefs.current[musica.id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingId(null);
    } else {
      if (playingId) {
        const currentAudio = audioRefs.current[playingId];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      const audio = audioRefs.current[musica.id];
      if (audio) {
        audio.play();
        setPlayingId(musica.id);
      }
    }
  };

  const handleAudioEnded = (id: string) => {
    if (playingId === id) {
      if (autoPlayNext) {
        playNextSong();
      } else {
        setPlayingId(null);
      }
    }
  };

  const handleProgressClick = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    if (!audio || !duration[id]) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration[id];
  };

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <NeuralBackground isActive={false} />
      <NeuralParticles isActive={false} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="back-button mb-6"
            onClick={() => setLocation('/')}
            data-testid="button-voltar"
            whileHover={{ x: -6 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Voltar
          </motion.button>

          <div className="text-center mb-12">
            <motion.div
              className="relative inline-block mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  backdropFilter: 'blur(40px)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(199, 125, 255, 0.3)'
                }}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Music className="w-12 h-12 md:w-14 md:h-14 text-primary" />
              </motion.div>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" 
              style={{
                filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.3))',
                letterSpacing: '0.02em'
              }}
              data-testid="text-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Músicas Educativas
            </motion.h1>

            <motion.div
              className="w-32 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground font-medium mb-8" 
              data-testid="text-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Toque e cante junto para aprender as sílabas!
            </motion.p>

            <motion.div 
              className="flex items-center justify-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button
                variant={autoPlayNext ? "default" : "outline"}
                onClick={() => setAutoPlayNext(!autoPlayNext)}
                className="font-semibold"
                size="lg"
                data-testid="button-autoplay"
              >
                <SkipForward className="mr-2 h-5 w-5" />
                Sequência: {autoPlayNext ? "Ativada" : "Desativada"}
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {musicasConfig.map((musica, index) => {
              const isPlaying = playingId === musica.id;
              const progress = duration[musica.id] 
                ? (currentTime[musica.id] || 0) / duration[musica.id] * 100 
                : 0;

              return (
                <motion.div
                  key={musica.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <div 
                    className="music-card-premium h-full relative overflow-hidden group"
                    data-testid={`card-musica-${musica.id}`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      backdropFilter: 'blur(40px)',
                      border: `2px solid ${isPlaying ? musica.cor + '40' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '24px',
                      boxShadow: isPlaying 
                        ? `0 8px 32px ${musica.cor}30, 0 0 80px ${musica.cor}20`
                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div className="music-card-glow-effect" style={{
                      background: `linear-gradient(135deg, ${musica.cor}40, ${musica.cor}20)`,
                      opacity: isPlaying ? 0.6 : 0
                    }} />

                    <div className="relative z-10 p-6">
                      <div className="text-center mb-4">
                        <motion.div
                          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative"
                          style={{
                            background: `linear-gradient(135deg, ${musica.cor}20, ${musica.cor}10)`,
                            boxShadow: isPlaying ? `0 0 30px ${musica.cor}40` : 'none'
                          }}
                          animate={isPlaying ? { 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ 
                            duration: 1.2, 
                            repeat: isPlaying ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          <musica.icon 
                            className="w-10 h-10" 
                            style={{ 
                              color: musica.cor,
                              filter: isPlaying ? `drop-shadow(0 0 8px ${musica.cor})` : 'none'
                            }}
                          />
                        </motion.div>
                        <h3 
                          className="text-2xl font-bold mb-1"
                          style={{ 
                            color: musica.cor,
                            textShadow: isPlaying ? `0 0 20px ${musica.cor}60` : 'none'
                          }}
                        >
                          {musica.titulo}
                        </h3>
                      </div>

                      <audio
                        ref={(el) => {
                          if (el) audioRefs.current[musica.id] = el;
                        }}
                        src={musica.arquivo}
                        onEnded={() => handleAudioEnded(musica.id)}
                        preload="metadata"
                      />

                      <div className="space-y-3 mb-4">
                        <div 
                          className="relative cursor-pointer group/progress"
                          onClick={(e) => handleProgressClick(musica.id, e)}
                        >
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${musica.cor}, ${musica.cor}CC)`,
                                boxShadow: `0 0 10px ${musica.cor}60`
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span data-testid={`time-current-${musica.id}`}>
                            {formatTime(currentTime[musica.id] || 0)}
                          </span>
                          <span data-testid={`time-duration-${musica.id}`}>
                            {formatTime(duration[musica.id] || 0)}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePlayStop(musica)}
                        className="w-full text-base h-12 font-bold"
                        size="lg"
                        variant={isPlaying ? "destructive" : "default"}
                        data-testid={`button-play-${musica.id}`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="mr-2 h-5 w-5" />
                            Parar
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Ouvir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(40px)',
              border: '2px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 229, 255, 0.1)'
            }}
          >
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
              <h3 className="font-extrabold mb-6 text-3xl md:text-4xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Como Usar
              </h3>
              <ul className="space-y-4 text-base md:text-lg text-foreground max-w-3xl mx-auto">
                <motion.li 
                  className="flex items-start gap-4 p-4 rounded-xl hover-elevate"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-3xl flex-shrink-0">🎵</span>
                  <span>Escolha uma música com as sílabas que você quer aprender</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-4 p-4 rounded-xl hover-elevate"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-3xl flex-shrink-0">▶️</span>
                  <span>Clique em "Ouvir" para tocar a música</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-4 p-4 rounded-xl hover-elevate"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-3xl flex-shrink-0">⏱️</span>
                  <span>Acompanhe o progresso na barra e clique nela para pular</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-4 p-4 rounded-xl hover-elevate"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <span className="text-3xl flex-shrink-0">🔄</span>
                  <span>Ative a sequência para tocar todas automaticamente!</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
