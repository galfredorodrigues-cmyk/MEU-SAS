import { motion } from "framer-motion";
import neuralBg from "../assets/generated_images/Neural_network_background_pattern_a0a300e6.png";

interface NeuralBackgroundProps {
  isActive: boolean;
}

export function NeuralBackground({ isActive }: NeuralBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0D1B2A] to-[#050510]" />
      
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${neuralBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{
          scale: isActive ? [1, 1.08, 1] : 1,
          opacity: isActive ? [0.15, 0.25, 0.15] : 0.15,
        }}
        transition={{
          duration: 5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0, 229, 255, 0.12) 0%, transparent 60%)",
        }}
        animate={{
          opacity: isActive ? [0.4, 0.8, 0.4] : 0.3,
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, rgba(199, 125, 255, 0.1) 0%, transparent 55%)",
        }}
        animate={{
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.25,
          x: isActive ? [0, 30, 0] : 0,
          y: isActive ? [0, -20, 0] : 0,
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
        }}
        animate={{
          opacity: isActive ? [0.2, 0.5, 0.2] : 0.2,
          x: isActive ? [0, -25, 0] : 0,
          y: isActive ? [0, 25, 0] : 0,
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 229, 255, 0.05) 2px,
            rgba(0, 229, 255, 0.05) 4px
          )`,
        }}
      />
    </div>
  );
}
