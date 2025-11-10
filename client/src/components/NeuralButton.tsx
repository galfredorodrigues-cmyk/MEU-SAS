import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface NeuralButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function NeuralButton({ isActive, onClick }: NeuralButtonProps) {
  return (
    <motion.div
      animate={
        isActive
          ? {}
          : {
              scale: [1, 1.02, 1],
            }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Button
        size="lg"
        onClick={onClick}
        data-testid="button-neural-activation"
        className={`
          relative overflow-visible px-12 py-8 text-2xl font-bold uppercase tracking-wider
          ${isActive ? "bg-primary" : "bg-primary/90"}
        `}
        style={{
          boxShadow: isActive
            ? "0 0 40px rgba(0, 229, 255, 0.6), 0 0 80px rgba(139, 92, 246, 0.4)"
            : "0 0 20px rgba(0, 229, 255, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        }}
      >
        <motion.div
          className="flex items-center gap-4"
          animate={
            isActive
              ? {}
              : {
                  opacity: [1, 0.8, 1],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Zap className="w-8 h-8" />
          <span>{isActive ? "Sessão Ativa" : "Iniciar Sessão Neural"}</span>
          <Zap className="w-8 h-8" />
        </motion.div>
      </Button>
    </motion.div>
  );
}
