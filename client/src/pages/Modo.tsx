import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation } from "wouter";
import { Palette, Brain, Cloud, Zap } from "lucide-react";
import * as Tone from "tone";
import { modosConfig, type ModoType } from "@shared/modos";
import { NeuralParticles } from "@/components/NeuralParticles";
import { ModoElements } from "@/components/ModoElements";
import { useSpeech } from "@/hooks/use-speech";
import "../neural.css";

const log = (msg: string) => {
  try {
    console.log("[BrinLê Neuro]", msg);
  } catch (e) {}
};

const iconMap = {
  Palette,
  Brain,
  Cloud,
  Zap,
};

export default function Modo() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const modoId = params.modo as ModoType;
  const modo = modosConfig[modoId];

  const [isActive, setIsActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordColor, setWordColor] = useState(modo?.cores[0] || "#FFD93D");
  const [wordPosition, setWordPosition] = useState({ x: 50, y: 50 });
  
  const oscRef = useRef<Tone.Oscillator | null>(null);
  const lfoRef = useRef<Tone.Oscillator | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { speak, cancel: cancelSpeech } = useSpeech();
  const autoActivatedRef = useRef(false);
  const wordAlternateRef = useRef(false);

  useEffect(() => {
    document.body.classList.remove('inicio');
    document.body.style.background = '#000';
    log(`Modo ${modoId} carregado`);
    
    return () => {};
  }, [modoId, modo]);

  const particleStyles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${8 + Math.random() * 5}s`
    }));
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        log("Aba oculta - pausando sessão");
        setIsActive(false);
        if (oscRef.current) {
          oscRef.current.stop();
          oscRef.current.dispose();
          oscRef.current = null;
        }
        if (lfoRef.current) {
          lfoRef.current.stop();
          lfoRef.current.dispose();
          lfoRef.current = null;
        }
        if (gainRef.current) {
          gainRef.current.dispose();
          gainRef.current = null;
        }
        cancelSpeech();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, cancelSpeech]);

  useEffect(() => {
    if (isActive) {
      cycleWords();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCurrentWord(null);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.dispose();
        oscRef.current = null;
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.dispose();
        lfoRef.current = null;
      }
      if (gainRef.current) {
        gainRef.current.dispose();
        gainRef.current = null;
      }
    };
  }, [isActive, modoId]);

  const cycleWords = () => {
    if (!modo) return;

    const showWord = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const randomWord = modo.palavras[Math.floor(Math.random() * modo.palavras.length)];
      const randomColor = modo.cores[Math.floor(Math.random() * modo.cores.length)];
      
      const isMobile = window.innerWidth <= 768;
      let randomX: number;
      let randomY: number;
      
      wordAlternateRef.current = !wordAlternateRef.current;
      const isTop = wordAlternateRef.current;
      
      if (isMobile) {
        randomX = 50;
        if (isTop) {
          randomY = 25 + Math.random() * 5;
        } else {
          randomY = 70 + Math.random() * 5;
        }
      } else {
        randomX = 40 + Math.random() * 20;
        if (isTop) {
          randomY = 25 + Math.random() * 8;
        } else {
          randomY = 67 + Math.random() * 8;
        }
      }
      
      setCurrentWord(randomWord);
      setWordColor(randomColor);
      setWordPosition({ x: randomX, y: randomY });
      
      speak(randomWord);
      
      timeoutRef.current = window.setTimeout(() => {
        setCurrentWord(null);
        timeoutRef.current = null;
      }, 2500);
    };
    
    showWord();
    intervalRef.current = window.setInterval(showWord, 3500);
  };

  const handleToggle = async () => {
    if (!modo) return;

    try {
      if ('speechSynthesis' in window) {
        log("🗣️ Inicializando Speech synthesis no toque do usuário (iOS fix)");
        
        window.speechSynthesis.cancel();
        
        const voices = window.speechSynthesis.getVoices();
        log(`🗣️ ${voices.length} vozes disponíveis no momento do toque`);
        
        if (voices.length > 0) {
          const ptVoices = voices.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
          log(`🗣️ Vozes PT encontradas: ${ptVoices.map(v => v.name).join(', ')}`);
        }
        
        const dummyUtterance = new SpeechSynthesisUtterance(' ');
        dummyUtterance.volume = 0;
        dummyUtterance.rate = 10;
        dummyUtterance.lang = 'pt-BR';
        window.speechSynthesis.speak(dummyUtterance);
        
        log("🗣️ ✅ Dummy utterance enviado para ativar iOS");
      }

      if (!isActive) {
        log("✅ Ativando modo " + modo.titulo + " (visual e palavras apenas)");
        setIsActive(true);
      } else {
        log("⏸️ Pausando modo " + modo.titulo);
        cancelSpeech();
        setIsActive(false);
      }
    } catch (err) {
      console.error("[BrinLê Neuro] Erro ao ativar:", err);
    }
  };

  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-not-found">
            Modo não encontrado
          </h1>
          <motion.button
            className="menu-button inline-flex"
            data-testid="button-voltar-menu"
            onClick={() => setLocation('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Voltar ao Menu
          </motion.button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[modo.icon as keyof typeof iconMap];

  const modoGradients = {
    criativo: "linear-gradient(135deg, #FFD93D20 0%, #C77DFF20 50%, #FF69B420 100%)",
    calma: "linear-gradient(135deg, #FFB6C120 0%, #B0E0E620 50%, #E6E6FA20 100%)",
    foco: "linear-gradient(135deg, #6EC1E420 0%, #5C73F220 50%, #7B2FF720 100%)",
    energia: "linear-gradient(135deg, #FFD70020 0%, #FF450020 50%, #FF149320 100%)",
  };

  return (
    <div className="neuro-container" style={{ background: modoGradients[modoId] }}>
      <NeuralParticles isActive={isActive} />
      <ModoElements modoId={modoId} isActive={isActive} />

      <motion.button
        className="back-button"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setLocation('/')}
        data-testid="button-voltar"
      >
        ← Voltar
      </motion.button>

      <motion.div
        className="fixed top-[12vh] left-0 right-0 mx-auto max-w-4xl text-center px-6 md:px-6 z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="text-[0.65rem] sm:text-sm md:text-base text-muted-foreground leading-snug" data-testid="text-hint">
          Clique em {modo.emoji} para ligar/desligar. Ouça e repita as palavras com a criança.
        </p>
      </motion.div>

      <div className="particles-container">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="particle-drift"
            style={style}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentWord && (
          <motion.div
            key={currentWord}
            className="floating-word"
            style={{
              left: `${wordPosition.x}%`,
              top: `${wordPosition.y}%`,
              color: wordColor,
              textShadow: `0 0 30px ${wordColor}80, 0 0 60px ${wordColor}40`,
            }}
            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            animate={{ 
              opacity: [0, 1, 1, 0.8, 0],
              scale: [0.8, 1, 1, 1.05, 1.1],
              x: '-50%',
              y: ['-50%', 'calc(-50% - 8px)', 'calc(-50% - 8px)', 'calc(-50% - 15px)', 'calc(-50% - 25px)']
            }}
            transition={{ 
              duration: 3.5,
              times: [0, 0.25, 0.7, 0.9, 1],
              ease: "easeInOut",
            }}
            data-testid="floating-word"
          >
            {currentWord}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`infinity-icon ${isActive ? "active" : ""}`}
        onClick={handleToggle}
        whileTap={{ scale: 0.96 }}
        data-testid="button-neuro-toggle"
        style={{
          cursor: 'pointer'
        }}
      >
        <div className="infinity-symbol">{modo.emoji}</div>
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(0, 229, 255, 0.4)',
              }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ 
                scale: [1, 1.15, 1], 
                opacity: [0.6, 0.2, 0.6] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid rgba(199, 125, 255, 0.3)',
              }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.5, 0.1, 0.5] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </>
        )}
      </motion.div>

      <motion.div
        className="instruction-text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        data-testid="text-instruction"
      >
        {isActive 
          ? `Modo ${modo.titulo} Ativo — Deixe as palavras fluírem` 
          : `Toque ${modo.emoji} para ativar`}
      </motion.div>

      <div className="status-indicator" data-testid="text-status">
        <motion.div 
          className={`status-dot ${isActive ? "active" : ""}`}
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span>
          {isActive 
            ? `Sessão de ${modo.titulo} em Andamento` 
            : "Aguardando Ativação"}
        </span>
      </div>

      <div className="app-title" data-testid="text-title">
        <div className="flex items-center justify-center gap-3">
          <span>BrinLê Neuro</span>
          <Icon className="w-8 h-8" />
          <span>{modo.titulo}</span>
        </div>
      </div>
    </div>
  );
}
