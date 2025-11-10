import { motion } from "framer-motion";

interface SoundWaveVisualizerProps {
  isActive: boolean;
  color: string;
  frequency: number;
}

export function SoundWaveVisualizer({ isActive, color, frequency }: SoundWaveVisualizerProps) {
  return (
    <div className="flex items-end justify-center gap-1 h-20 w-full">
      {Array.from({ length: 20 }).map((_, i) => {
        const baseHeight = isActive ? 20 + (Math.sin(i * 0.5 + frequency) * 15) : 10;
        const variation = isActive ? (i % 3) * 10 : 0;
        
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{
              backgroundColor: isActive ? color : 'rgba(128, 128, 128, 0.2)',
              boxShadow: isActive ? `0 0 10px ${color}` : 'none',
            }}
            animate={{
              height: isActive ? `${baseHeight + variation}%` : '10%',
            }}
            transition={{
              duration: 0.6 + (i * 0.05),
              ease: "easeInOut",
              repeat: isActive ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        );
      })}
    </div>
  );
}
