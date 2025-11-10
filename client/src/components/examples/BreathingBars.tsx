import { useState } from "react";
import { BreathingBars } from "../BreathingBars";
import { Button } from "@/components/ui/button";

export default function BreathingBarsExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <BreathingBars isActive={isActive} />
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Breathing Bars Demo
        </h1>
        <Button onClick={() => setIsActive(!isActive)} size="lg">
          {isActive ? "Desativar" : "Ativar"} Barras
        </Button>
      </div>
    </div>
  );
}
