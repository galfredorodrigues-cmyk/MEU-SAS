import { NeuralIndicator } from "../NeuralIndicator";
import { Activity, Brain, Sparkles } from "lucide-react";

export default function NeuralIndicatorExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-2xl space-y-8">
        <NeuralIndicator
          label="Ondas Neurais"
          value={78}
          color="primary"
          icon={<Activity className="w-6 h-6" />}
        />
        <NeuralIndicator
          label="Nível de Foco"
          value={65}
          color="accent"
          icon={<Brain className="w-6 h-6" />}
        />
        <NeuralIndicator
          label="Flow State"
          value={92}
          color="secondary"
          icon={<Sparkles className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}
