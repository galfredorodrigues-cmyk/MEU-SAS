import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tone from "tone";
import "../neural.css";

const palavrasNeuro = [
  "Aprender", "Criar", "Pensar", "Brincar", "Sonhar", "Imaginar", "Rir",
  "Amar", "Confiar", "Descobrir", "Explorar", "Viver", "Sorrir", "Acreditar",
  "Crescer", "Ver", "Ouvir", "Focar", "Concentrar", "Inventar", "Sentir",
  "Compartilhar", "Amizade", "Alegria", "Luz", "Paz", "Esperança", "Gentileza",
  "Ler", "Escrever", "Desenhar", "Cantar", "Dançar", "Correr", "Pular",
  "Abraçar", "Cuidar", "Respeitar", "Ajudar", "Imaginar", "Transformar"
];

const cores = [
  "#FFD93D", // amarelo vibrante
  "#C77DFF", // roxo-lilás
  "#6EC1E4", // azul claro
  "#90EE90", // verde menta
  "#FF69B4"  // rosa vibrante
];

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordColor, setWordColor] = useState(cores[0]);
  const [wordPosition, setWordPosition] = useState({ x: 50, y: 50 });
  
  const noiseRef = useRef<Tone.Noise | null>(null);
  const lfoRef = useRef<Tone.LFO | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const autoActivatedRef = useRef(false);

  // Memoize particle positions to avoid re-renders
  const particleStyles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${8 + Math.random() * 5}s`
    }));
  }, []);

  // Ativar automaticamente ao carregar
  useEffect(() => {
    if (!autoActivatedRef.current) {
      autoActivatedRef.current = true;
      
      const timer = setTimeout(async () => {
        await Tone.start();

        // Som do mar: ruído branco filtrado com modulação de ondas
        const noise = new Tone.Noise("white");
        
        // Filtro passa-baixa para suavizar o ruído (som do mar)
        const filter = new Tone.Filter({
          type: "lowpass",
          frequency: 800,
          rolloff: -24,
          Q: 1
        });
        
        // Gain principal
        const mainGain = new Tone.Gain(0.3);
        
        // LFO para modular o volume (efeito de ondas indo e vindo)
        const lfo = new Tone.LFO({
          frequency: 0.15,
          min: 0.1,
          max: 0.4
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

        noiseRef.current = noise;
        lfoRef.current = lfo;
        filterRef.current = filter;
        gainRef.current = mainGain;
        setIsActive(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

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
    };
  }, [isActive]);

  const cycleWords = () => {
    const showWord = () => {
      // Clear any existing timeout before creating new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const randomWord = palavrasNeuro[Math.floor(Math.random() * palavrasNeuro.length)];
      const randomColor = cores[Math.floor(Math.random() * cores.length)];
      
      // Evita o centro (área de 35-65% horizontal e vertical)
      let randomX: number;
      let randomY: number;
      do {
        randomX = 10 + Math.random() * 80;
        randomY = 10 + Math.random() * 80;
      } while (randomX > 35 && randomX < 65 && randomY > 35 && randomY < 65);
      
      setCurrentWord(randomWord);
      setWordColor(randomColor);
      setWordPosition({ x: randomX, y: randomY });
      
      // Schedule word removal
      timeoutRef.current = window.setTimeout(() => {
        setCurrentWord(null);
        timeoutRef.current = null;
      }, 5500); // Slightly less than interval to ensure smooth transition
    };
    
    showWord();
    intervalRef.current = window.setInterval(showWord, 6000);
  };

  const handleActivation = async () => {
    await Tone.start();

    if (!isActive) {
      // Som do mar: ruído branco filtrado com modulação de ondas
      const noise = new Tone.Noise("white");
      
      // Filtro passa-baixa para suavizar o ruído (som do mar)
      const filter = new Tone.Filter({
        type: "lowpass",
        frequency: 800,
        rolloff: -24,
        Q: 1
      });
      
      // Gain principal
      const mainGain = new Tone.Gain(0.3);
      
      // LFO para modular o volume (efeito de ondas indo e vindo)
      const lfo = new Tone.LFO({
        frequency: 0.15,
        min: 0.1,
        max: 0.4
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

      noiseRef.current = noise;
      lfoRef.current = lfo;
      filterRef.current = filter;
      gainRef.current = mainGain;
      setIsActive(true);
    } else {
      noiseRef.current?.stop();
      noiseRef.current?.dispose();
      lfoRef.current?.stop();
      lfoRef.current?.dispose();
      filterRef.current?.dispose();
      gainRef.current?.dispose();
      
      noiseRef.current = null;
      lfoRef.current = null;
      filterRef.current = null;
      gainRef.current = null;
      setIsActive(false);
    }
  };

  return (
    <div className="neuro-container">
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
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 1.1],
              x: '-50%',
              y: ['-50%', 'calc(-50% - 10px)', 'calc(-50% - 10px)', 'calc(-50% - 20px)']
            }}
            transition={{ 
              duration: 5.5,
              times: [0, 0.18, 0.85, 1],
              ease: "easeInOut",
              y: {
                duration: 5.5,
                times: [0, 0.3, 0.7, 1],
                repeat: 0,
                ease: "easeInOut"
              }
            }}
          >
            {currentWord}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`infinity-icon ${isActive ? "active" : ""}`}
        onClick={handleActivation}
        whileTap={{ scale: 0.95 }}
        data-testid="button-neuro-toggle"
      >
        <div className="infinity-symbol">∞</div>
      </motion.div>

      <motion.div
        className="instruction-text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        data-testid="text-instruction"
      >
        {isActive 
          ? "Modo Neuro Ativo — Deixe as palavras fluírem" 
          : "Toque o símbolo infinito para ativar"}
      </motion.div>

      <div className="status-indicator" data-testid="text-status">
        <motion.div 
          className={`status-dot ${isActive ? "active" : ""}`}
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span>{isActive ? "Sessão Neural em Andamento" : "Aguardando Ativação"}</span>
      </div>

      <div className="app-title" data-testid="text-title">
        BrinLê Neuro
      </div>
    </div>
  );
}
