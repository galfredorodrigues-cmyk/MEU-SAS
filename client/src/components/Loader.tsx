import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Tone from "tone";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [audioReady, setAudioReady] = useState(false);

  // Inicializar áudio no primeiro toque/clique (necessário para mobile)
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Tone.start();
        if (Tone.context.state === 'suspended') {
          await Tone.context.resume();
        }
        setAudioReady(true);
        console.log('[BrinLê Neuro] AudioContext iniciado com sucesso');
      } catch (err) {
        console.error('[BrinLê Neuro] Erro ao iniciar áudio:', err);
      }
    };

    // Tentar iniciar automaticamente
    initAudio();

    // Listener para primeiro toque/clique (fallback para mobile)
    const handleInteraction = () => {
      if (!audioReady) {
        initAudio();
      }
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [audioReady]);

  useEffect(() => {
    let intervalId: number | null = null;
    let completeTimeoutId: number | null = null;
    
    const timer = setTimeout(() => {
      intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalId !== null) {
              clearInterval(intervalId);
              intervalId = null;
            }
            completeTimeoutId = window.setTimeout(() => onComplete(), 700);
            return 100;
          }
          return prev + 2;
        });
      }, 18);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      if (completeTimeoutId !== null) {
        clearTimeout(completeTimeoutId);
      }
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      data-testid="loader-container"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(123, 47, 247, 0.9), rgba(26, 0, 54, 0.95))",
            boxShadow: "0 0 25px rgba(123, 47, 247, 0.6)",
          }}
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 0 25px rgba(123, 47, 247, 0.6)",
              "0 0 45px rgba(0, 229, 255, 0.8)",
              "0 0 25px rgba(123, 47, 247, 0.6)",
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          data-testid="loader-pulse"
        >
          <span
            className="text-6xl font-bold"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #00E5FF 50%, #C77DFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))",
            }}
          >
            ∞
          </span>
        </motion.div>

        <motion.p
          className="text-lg text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          data-testid="loader-text"
        >
          {audioReady ? 'Iniciando sua mente...' : 'Toque na tela...'}
        </motion.p>

        <div className="w-64 h-1 bg-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            data-testid="loader-progress"
          />
        </div>
      </div>
    </motion.div>
  );
}
