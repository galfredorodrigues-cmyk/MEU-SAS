import { useState } from "react";
import { NeuralParticles } from "../NeuralParticles";
import { Button } from "@/components/ui/button";

export default function NeuralParticlesExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <NeuralParticles isActive={isActive} />
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Neural Particles Demo
        </h1>
        <Button onClick={() => setIsActive(!isActive)} size="lg">
          {isActive ? "Desativar" : "Ativar"} Partículas
        </Button>
      </div>
    </div>
  );
}
