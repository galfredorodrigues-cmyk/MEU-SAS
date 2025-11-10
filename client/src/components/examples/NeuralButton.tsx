import { useState } from "react";
import { NeuralButton } from "../NeuralButton";

export default function NeuralButtonExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <NeuralButton
        isActive={isActive}
        onClick={() => {
          setIsActive(!isActive);
          console.log("Neural button clicked, active:", !isActive);
        }}
      />
    </div>
  );
}
