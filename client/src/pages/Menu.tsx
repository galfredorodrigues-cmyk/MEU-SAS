import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Palette, Brain, Cloud, Zap, Gamepad2, Volume2 } from "lucide-react";
import { modosConfig } from "@shared/modos";
import { NeuralBackground } from "@/components/NeuralBackground";
import { NeuralParticles } from "@/components/NeuralParticles";
import { LogoutButton } from "@/components/LogoutButton";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import "../neural.css";

const iconMap = {
  Palette,
  Brain,
  Cloud,
  Zap,
};

export default function Menu() {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const noiseRef = useRef<Tone.Noise | null>(null);
  const lfoRef = useRef<Tone.LFO | null>(null);
  const filterLfoRef = useRef<Tone.LFO | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const mainGainRef = useRef<Tone.Gain | null>(null);
  
  useEffect(() => {
    document.body.classList.add('inicio');
    return () => {
      document.body.classList.remove('inicio');
    };
  }, []);

  // Não limpar recursos de áudio ao desmontar - deixar o som continuar
  // O som só para quando o usuário clicar novamente no ícone

  const toggleSound = async () => {
    if (isPlaying) {
      // Parar o ruído e LFOs
      if (noiseRef.current) {
        noiseRef.current.stop();
        noiseRef.current.dispose();
        noiseRef.current = null;
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.dispose();
        lfoRef.current = null;
      }
      if (filterLfoRef.current) {
        filterLfoRef.current.stop();
        filterLfoRef.current.dispose();
        filterLfoRef.current = null;
      }
      
      // Limpar filtro e gain
      if (filterRef.current) {
        filterRef.current.dispose();
        filterRef.current = null;
      }
      if (mainGainRef.current) {
        mainGainRef.current.dispose();
        mainGainRef.current = null;
      }
      
      setIsPlaying(false);
      localStorage.setItem('menu_sound_playing', 'false');
    } else {
      // Iniciar o som do mar
      try {
        await Tone.start();
        
        if (Tone.context.state === 'suspended') {
          await Tone.context.resume();
        }

        // Som do mar: ruído branco filtrado com modulação de ondas
        const noise = new Tone.Noise("white");
        
        // Filtro passa-baixa para suavizar o ruído (som do mar)
        const filter = new Tone.Filter({
          type: "lowpass",
          frequency: 800,
          rolloff: -24,
          Q: 1
        });
        
        // Gain principal (volume reduzido)
        const mainGain = new Tone.Gain(0.15);
        
        // LFO para modular o volume (efeito de ondas indo e vindo)
        const lfo = new Tone.LFO({
          frequency: 0.15,
          min: 0.05,
          max: 0.2
        });
        
        // LFO para modular o filtro (ondas mais dinâmicas)
        const filterLfo = new Tone.LFO({
          frequency: 0.08,
          min: 400,
          max: 1200
        });

        // Conectar: ruído -> filtro -> gain -> saída
        noise.connect(filter);
        filter.connect(mainGain);
        mainGain.toDestination();
        
        // LFOs modulam o volume e a frequência do filtro
        lfo.connect(mainGain.gain);
        filterLfo.connect(filter.frequency);
        
        noise.start();
        lfo.start();
        filterLfo.start();

        // Guardar todas as referências
        noiseRef.current = noise;
        lfoRef.current = lfo;
        filterLfoRef.current = filterLfo;
        filterRef.current = filter;
        mainGainRef.current = mainGain;
        
        setIsPlaying(true);
        localStorage.setItem('menu_sound_playing', 'true');
      } catch (err) {
        console.error("Erro ao iniciar som:", err);
      }
    }
  };

  // Restaurar som ao voltar para a página
  useEffect(() => {
    const savedState = localStorage.getItem('menu_sound_playing');
    if (savedState === 'true' && !noiseRef.current) {
      // Só reiniciar se não houver som tocando já
      const startSound = async () => {
        try {
          await Tone.start();
          
          if (Tone.context.state === 'suspended') {
            await Tone.context.resume();
          }

          // Recriar o som do mar
          const noise = new Tone.Noise("white");
          
          const filter = new Tone.Filter({
            type: "lowpass",
            frequency: 800,
            rolloff: -24,
            Q: 1
          });
          
          const mainGain = new Tone.Gain(0.15);
          
          const lfo = new Tone.LFO({
            frequency: 0.15,
            min: 0.05,
            max: 0.2
          });
          
          const filterLfo = new Tone.LFO({
            frequency: 0.08,
            min: 400,
            max: 1200
          });

          noise.connect(filter);
          filter.connect(mainGain);
          mainGain.toDestination();
          
          lfo.connect(mainGain.gain);
          filterLfo.connect(filter.frequency);
          
          noise.start();
          lfo.start();
          filterLfo.start();

          noiseRef.current = noise;
          lfoRef.current = lfo;
          filterLfoRef.current = filterLfo;
          filterRef.current = filter;
          mainGainRef.current = mainGain;
          
          setIsPlaying(true);
        } catch (err) {
          console.error("Erro ao reiniciar som:", err);
        }
      };
      
      startSound();
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-auto relative">
      <LogoutButton />
      <NeuralBackground isActive={false} />
      <NeuralParticles isActive={false} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-4 py-12 max-w-6xl mx-auto w-full">
        <motion.div
          className={`neuro-icon-pulse mx-auto mb-6 cursor-pointer ${isPlaying ? 'active' : ''}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isPlaying ? [1, 1.05, 1] : 1, 
            opacity: 1 
          }}
          transition={{ 
            duration: isPlaying ? 2 : 0.8, 
            ease: "easeOut",
            repeat: isPlaying ? Infinity : 0
          }}
          onClick={toggleSound}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          data-testid="icon-neuro"
          title={isPlaying ? "Clique para parar o som de 40Hz" : "Clique para ouvir o som de 40Hz"}
        >
          ∞
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            animate={{
              backgroundColor: isPlaying ? ["#00E5FF", "#C77DFF", "#00E5FF"] : "rgba(255, 255, 255, 0.3)",
              boxShadow: isPlaying ? ["0 0 15px #00E5FF", "0 0 15px #C77DFF", "0 0 15px #00E5FF"] : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-muted-foreground font-medium" data-testid="text-sound-status">
            {isPlaying ? "Som de 40Hz ativo - Ondas suaves" : "Clique no ∞ para ouvir o som de 40Hz"}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <h1
            className="text-6xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(0, 229, 255, 0.3))',
              letterSpacing: '0.05em'
            }}
            data-testid="text-title"
          >
            BrinLê Neuro
          </h1>
          <motion.div
            className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium"
          style={{ letterSpacing: '0.02em' }}
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          data-testid="text-subtitle"
        >
          Escolha seu modo mental:
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {Object.values(modosConfig).map((modo, index) => {
            const Icon = iconMap[modo.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={modo.id}
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120
                }}
              >
                <motion.button
                  className="w-full menu-card-button group"
                  aria-label={`Modo ${modo.titulo}`}
                  title={`Modo ${modo.titulo}`}
                  data-testid={`button-modo-${modo.id}`}
                  onClick={() => setLocation(`/modo/${modo.id}`)}
                  whileHover={{ scale: 1.03, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="menu-card-glow" />
                  <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                    <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {modo.emoji}
                    </div>
                    <span className="text-xl font-bold text-foreground">{modo.titulo}</span>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.9, 
              duration: 0.6,
              type: "spring",
              stiffness: 120
            }}
          >
            <motion.button
              className="w-full menu-card-button group"
              aria-label="NeuroJogo"
              title="NeuroJogo"
              data-testid="button-neurojogo"
              onClick={() => setLocation('/neurojogo')}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="menu-card-glow" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <Gamepad2 className="w-12 h-12 text-accent mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-bold text-foreground">NeuroJogo</span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.0, 
              duration: 0.6,
              type: "spring",
              stiffness: 120
            }}
          >
            <motion.button
              className="w-full menu-card-button group"
              aria-label="Sessão de Sons"
              title="Sessão de Sons"
              data-testid="button-sons"
              onClick={() => setLocation('/sons')}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="menu-card-glow" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <Volume2 className="w-12 h-12 text-primary mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-bold text-foreground">Sessão de Sons</span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 120
            }}
          >
            <motion.button
              className="w-full menu-card-button group"
              aria-label="Músicas Educativas"
              title="Músicas Educativas"
              data-testid="button-musicas"
              onClick={() => setLocation('/musicas')}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="menu-card-glow" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <div className="w-12 h-12 flex items-center justify-center text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  🎶
                </div>
                <span className="text-lg font-bold text-foreground">Músicas Educativas</span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
