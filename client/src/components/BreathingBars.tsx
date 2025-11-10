import { motion } from "framer-motion";

interface BreathingBarsProps {
  isActive: boolean;
}

export function BreathingBars({ isActive }: BreathingBarsProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center gap-3 -z-5 pointer-events-none opacity-20">
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-32 bg-gradient-to-t from-primary via-accent to-primary rounded-full"
          animate={{
            scaleY: isActive ? [1, 2.5, 1] : [0.5, 1, 0.5],
            opacity: isActive ? [0.4, 1, 0.4] : [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
