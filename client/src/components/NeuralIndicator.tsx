import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NeuralIndicatorProps {
  label: string;
  value: number;
  color: "primary" | "accent" | "secondary";
  icon: React.ReactNode;
}

export function NeuralIndicator({ label, value, color, icon }: NeuralIndicatorProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 500;
    const steps = 30;
    const increment = (value - displayValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue((prev) => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    primary: "from-primary to-primary/60",
    accent: "from-accent to-accent/60",
    secondary: "from-chart-3 to-chart-3/60",
  };

  const glowColors = {
    primary: "rgba(0, 229, 255, 0.4)",
    accent: "rgba(139, 92, 246, 0.4)",
    secondary: "rgba(59, 130, 246, 0.4)",
  };

  return (
    <div className="space-y-3" data-testid={`indicator-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-foreground/80">{icon}</div>
          <span className="text-lg font-semibold text-foreground tracking-wide">
            {label}
          </span>
        </div>
        <span className="text-2xl font-bold text-primary" data-testid={`value-${label.toLowerCase().replace(/\s+/g, "-")}`}>
          {Math.round(displayValue)}%
        </span>
      </div>
      <div className="relative h-4 bg-card rounded-full overflow-visible border border-border">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 15px ${glowColors[color]}`,
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
            style={{ width: `${value}%` }}
          />
        </motion.div>
      </div>
    </div>
  );
}
