import { motion } from "framer-motion";

interface NeuralParticlesProps {
  isActive: boolean;
}

export function NeuralParticles({ isActive }: NeuralParticlesProps) {
  const particleCount = 60;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(particleCount)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const duration = 10 + Math.random() * 12;
        const delay = Math.random() * 8;
        const leftPos = Math.random() * 100;
        const isGlow = i % 3 === 0;
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isGlow 
                ? 'bg-primary shadow-[0_0_8px_rgba(0,229,255,0.6)]' 
                : 'bg-primary/50'
            }`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${leftPos}%`,
              top: `${100 + Math.random() * 20}%`,
              filter: isGlow ? 'blur(0.5px)' : 'none',
            }}
            animate={{
              y: [0, -window.innerHeight - 300],
              opacity: isActive 
                ? [0.1, isGlow ? 1 : 0.8, 0.1] 
                : [0.05, isGlow ? 0.5 : 0.3, 0.05],
              scale: isActive 
                ? [0.8, isGlow ? 2 : 1.5, 0.8] 
                : [0.5, 1, 0.5],
              x: [
                0, 
                Math.sin(delay) * 30,
                Math.cos(delay) * -20,
                0
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
              x: {
                duration: duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          />
        );
      })}
      
      {isActive && [...Array(15)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-2 h-2 bg-accent/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
