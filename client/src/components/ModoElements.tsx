import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ModoType } from "@shared/modos";

interface ModoElementsProps {
  modoId: ModoType;
  isActive: boolean;
}

export function ModoElements({ modoId, isActive }: ModoElementsProps) {
  const elements = useMemo(() => {
    switch (modoId) {
      case "criativo":
        return Array.from({ length: 12 }, (_, i) => ({
          id: i,
          type: i % 3 === 0 ? "brush" : i % 3 === 1 ? "palette" : "star",
          size: 20 + Math.random() * 30,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 8 + Math.random() * 4,
        }));
      
      case "calma":
        return Array.from({ length: 10 }, (_, i) => ({
          id: i,
          type: i % 3 === 0 ? "cloud" : i % 3 === 1 ? "butterfly" : "flower",
          size: 30 + Math.random() * 40,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 15 + Math.random() * 10,
        }));
      
      case "foco":
        return Array.from({ length: 8 }, (_, i) => ({
          id: i,
          type: i % 2 === 0 ? "circle" : "star",
          size: 25 + Math.random() * 35,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 10 + Math.random() * 5,
        }));
      
      case "energia":
        return Array.from({ length: 15 }, (_, i) => ({
          id: i,
          type: i % 3 === 0 ? "lightning" : i % 3 === 1 ? "spark" : "burst",
          size: 20 + Math.random() * 30,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 1.5,
          duration: 5 + Math.random() * 3,
        }));
      
      default:
        return [];
    }
  }, [modoId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isActive
              ? {
                  opacity: [0, 0.6, 0.6, 0],
                  scale: [0, 1, 1, 0.8],
                  y: [0, -50, -100, -150],
                  x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15],
                }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <ElementShape type={element.type} modoId={modoId} />
        </motion.div>
      ))}
    </div>
  );
}

interface ElementShapeProps {
  type: string;
  modoId: ModoType;
}

function ElementShape({ type, modoId }: ElementShapeProps) {
  switch (modoId) {
    case "criativo":
      if (type === "brush") {
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z"
              fill="url(#gradient-creative)"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient-creative" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD93D" />
                <stop offset="50%" stopColor="#C77DFF" />
                <stop offset="100%" stopColor="#FF69B4" />
              </linearGradient>
            </defs>
          </svg>
        );
      }
      if (type === "palette") {
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-purple-400 to-pink-400 opacity-70" />
        );
      }
      return (
        <div className="w-full h-full">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="#6EC1E4" opacity="0.6" />
            <circle cx="12" cy="12" r="5" fill="#90EE90" opacity="0.8" />
          </svg>
        </div>
      );

    case "calma":
      if (type === "cloud") {
        return (
          <svg viewBox="0 0 60 40" className="w-full h-full">
            <ellipse cx="30" cy="25" rx="20" ry="12" fill="#B0E0E6" opacity="0.5" />
            <ellipse cx="20" cy="20" rx="15" ry="10" fill="#E6E6FA" opacity="0.6" />
            <ellipse cx="40" cy="22" rx="15" ry="10" fill="#FFB6C1" opacity="0.5" />
          </svg>
        );
      }
      if (type === "butterfly") {
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <ellipse cx="15" cy="20" rx="10" ry="15" fill="#FFB6C1" opacity="0.6" transform="rotate(-20 15 20)" />
            <ellipse cx="25" cy="20" rx="10" ry="15" fill="#E0BBE4" opacity="0.6" transform="rotate(20 25 20)" />
            <line x1="20" y1="10" x2="20" y2="30" stroke="#D8BFD8" strokeWidth="2" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="25" r="8" fill="#FFDAB9" opacity="0.7" />
          <ellipse cx="15" cy="20" rx="5" ry="8" fill="#E6E6FA" opacity="0.6" />
          <ellipse cx="25" cy="20" rx="5" ry="8" fill="#FFB6C1" opacity="0.6" />
        </svg>
      );

    case "foco":
      if (type === "circle") {
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#6EC1E4" strokeWidth="2" opacity="0.5" />
            <circle cx="20" cy="20" r="12" fill="none" stroke="#5C73F2" strokeWidth="2" opacity="0.6" />
            <circle cx="20" cy="20" r="6" fill="#7B2FF7" opacity="0.7" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z"
            fill="#87CEFA"
            opacity="0.6"
          />
        </svg>
      );

    case "energia":
      if (type === "lightning") {
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M13 2L3 14h8l-1 8 10-12h-8z"
              fill="url(#gradient-energy)"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient-energy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FF4500" />
                <stop offset="100%" stopColor="#FF1493" />
              </linearGradient>
            </defs>
          </svg>
        );
      }
      if (type === "spark") {
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-70" />
        );
      }
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="15" fill="#FFA500" opacity="0.6" />
          <circle cx="20" cy="20" r="10" fill="#FF6347" opacity="0.7" />
          <circle cx="20" cy="20" r="5" fill="#FFD700" opacity="0.8" />
        </svg>
      );

    default:
      return null;
  }
}
