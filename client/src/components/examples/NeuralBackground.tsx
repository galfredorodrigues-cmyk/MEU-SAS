import { useState } from "react";
import { NeuralBackground } from "../NeuralBackground";
import { Button } from "@/components/ui/button";

export default function NeuralBackgroundExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <NeuralBackground isActive={isActive} />
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Neural Background Demo
        </h1>
        <Button onClick={() => setIsActive(!isActive)} size="lg">
          {isActive ? "Desativar" : "Ativar"} Animação
        </Button>
      </div>
    </div>
  );
}
