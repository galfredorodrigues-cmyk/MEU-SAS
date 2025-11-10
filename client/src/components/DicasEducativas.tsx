import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModoConfig } from "@shared/modos";

interface DicasEducativasProps {
  modo: ModoConfig;
  isActive: boolean;
}

export function DicasEducativas({ modo, isActive }: DicasEducativasProps) {
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const tipIndexRef = useRef(0);

  useEffect(() => {
    if (!isActive || !modo.dicas || modo.dicas.length === 0) {
      setCurrentTip(null);
      tipIndexRef.current = 0;
      return;
    }

    const showTip = () => {
      setCurrentTip(modo.dicas[tipIndexRef.current]);
      tipIndexRef.current = (tipIndexRef.current + 1) % modo.dicas.length;
    };

    showTip();
    const interval = setInterval(showTip, 20000);

    return () => clearInterval(interval);
  }, [isActive, modo.dicas]);

  return (
    <AnimatePresence mode="wait">
      {currentTip && (
        <motion.div
          key={currentTip}
          className="fixed left-1/2 -translate-x-1/2 z-40 max-w-2xl px-4 sm:px-6 w-full bottom-[28vh] sm:bottom-[26vh] md:bottom-[24vh]"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          data-testid="dica-educativa"
        >
          <div className="relative">
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-xl opacity-60"
              style={{
                background: `linear-gradient(135deg, ${modo.cores[0]}40, ${modo.cores[1]}40, ${modo.cores[2]}40)`,
              }}
            />
            <div className="relative bg-card/90 backdrop-blur-md border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl flex-shrink-0 mt-0.5 sm:mt-1">{modo.emoji}</div>
                <p className="text-sm sm:text-base md:text-lg text-foreground font-medium leading-relaxed flex-1">
                  {currentTip}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
