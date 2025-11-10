import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Trophy, Star, Sparkles, Volume2, VolumeX, ArrowLeft, Zap, Brain, Heart, Palette } from "lucide-react";
import * as Tone from "tone";
import { useSpeech } from "@/hooks/use-speech";
import { NeuralBackground } from "@/components/NeuralBackground";
import { NeuralParticles } from "@/components/NeuralParticles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { missions, getMissionsByMode, type Mission, type WordWithContext, type GameType } from "@shared/neurojogo-missions";
import { ModoType } from "@shared/modos";
import "../neural.css";

type GameState = "modeSelect" | "missionMap" | "playing" | "result";

const modeIcons = {
  criativo: Palette,
  calma: Heart,
  foco: Brain,
  energia: Zap
};

const modeColors = {
  criativo: "from-yellow-400 via-purple-400 to-blue-400",
  calma: "from-pink-300 via-blue-200 to-purple-200",
  foco: "from-blue-400 via-blue-500 to-purple-500",
  energia: "from-yellow-400 via-orange-500 to-pink-500"
};

export default function NeuroJogo() {
  const [, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>("modeSelect");
  const [selectedMode, setSelectedMode] = useState<ModoType | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordWithContext | null>(null);
  const [options, setOptions] = useState<WordWithContext[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shakeWrong, setShakeWrong] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | null>(null);
  const [gameType, setGameType] = useState<GameType>("context");
  const [sequenceToRemember, setSequenceToRemember] = useState<WordWithContext[]>([]);
  const [sequencePhase, setSequencePhase] = useState<"show" | "test" | null>(null);
  const [selectedSequence, setSelectedSequence] = useState<WordWithContext[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [speedBonus, setSpeedBonus] = useState<number>(0);
  const [focusStreak, setFocusStreak] = useState<number>(0);
  
  const { speak, cancel } = useSpeech();
  const oscillatorRef = useRef<Tone.Oscillator | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);

  const selectMode = (mode: ModoType) => {
    setSelectedMode(mode);
    setGameState("missionMap");
  };

  const startMission = (mission: Mission) => {
    setCurrentMission(mission);
    setScore(0);
    setCombo(0);
    setFocusStreak(0);
    setCurrentRound(0);
    setGameState("playing");
  };

  const getRandomOptions = useCallback((correct: WordWithContext, allWords: WordWithContext[]): WordWithContext[] => {
    const others = allWords.filter(w => w.word !== correct.word);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    return [correct, ...selected].sort(() => Math.random() - 0.5);
  }, []);

  const startNewRound = useCallback(() => {
    if (!currentMission) return;
    
    setIsAnswered(false);
    setShowHint(false);
    setShowSentence(false);
    setSequencePhase(null);
    setBreathingPhase(null);
    
    const newGameType = currentMission.gameTypes[currentRound % currentMission.gameTypes.length];
    setGameType(newGameType);
    
    const words = currentMission.words;
    const correct = words[currentRound % words.length];
    const allOptions = getRandomOptions(correct, words);
    
    setCurrentWord(correct);
    setOptions(allOptions);
    
    if (selectedMode === "calma") {
      startBreathingExercise();
    }
    
    if (newGameType === "sequence" && selectedMode === "foco") {
      const sequenceLength = 3;
      const sequence = [...words].sort(() => Math.random() - 0.5).slice(0, sequenceLength);
      setSequenceToRemember(sequence);
      setSequencePhase("show");
      
      sequence.forEach((word, index) => {
        setTimeout(() => speak(word.word), (index + 1) * 1500);
      });
      
      setTimeout(() => {
        setSequencePhase("test");
        speak("Agora mostre a sequência!");
      }, sequenceLength * 1500 + 1000);
    } else if (newGameType === "speed" && selectedMode === "energia") {
      setTimeLeft(8);
      setSpeedBonus(0);
      setTimeout(() => speak(correct.word), 500);
    } else {
      setTimeout(() => {
        if (newGameType === "sensory" && correct.sensoryPrompt) {
          speak(correct.sensoryPrompt);
        } else {
          speak(correct.word);
        }
      }, 500);
    }
  }, [currentMission, currentRound, selectedMode, speak, getRandomOptions]);

  const startBreathingExercise = () => {
    setBreathingPhase("inhale");
    setTimeout(() => setBreathingPhase("hold"), 3000);
    setTimeout(() => setBreathingPhase("exhale"), 6000);
    setTimeout(() => setBreathingPhase(null), 9000);
  };

  const handleSequenceClick = (word: WordWithContext) => {
    if (sequencePhase !== "test") return;
    
    const newSequence = [...selectedSequence, word];
    setSelectedSequence(newSequence);
    
    if (newSequence.length === sequenceToRemember.length) {
      const isCorrect = newSequence.every((w, i) => w.word === sequenceToRemember[i].word);
      
      if (isCorrect) {
        setIsAnswered(true);
        const streakBonus = focusStreak * 3;
        const points = 10 + streakBonus;
        setScore(prev => prev + points);
        setFocusStreak(prev => prev + 1);
        setShowCelebration(true);
        
        if (soundEnabled) {
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease("C5", "0.1");
          setTimeout(() => synth.triggerAttackRelease("E5", "0.1"), 100);
          setTimeout(() => synth.triggerAttackRelease("G5", "0.15"), 200);
        }
        
        speak("Perfeito! Sequência correta!");
        
        setTimeout(() => {
          setShowCelebration(false);
          setSelectedSequence([]);
          if (currentRound < 5) {
            setCurrentRound(prev => prev + 1);
          } else {
            setGameState("result");
            cancel();
          }
        }, 2000);
      } else {
        setFocusStreak(0);
        setSelectedSequence([]);
        
        if (soundEnabled) {
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease("C3", "0.2");
        }
        
        speak("Ops! Tente novamente a sequência!");
        
        setTimeout(() => {
          setSequencePhase("show");
          sequenceToRemember.forEach((word, index) => {
            setTimeout(() => speak(word.word), (index + 1) * 1500);
          });
          
          setTimeout(() => {
            setSequencePhase("test");
            speak("Agora mostre a sequência!");
          }, sequenceToRemember.length * 1500 + 1000);
        }, 1500);
      }
    }
  };

  const handleAnswer = (selectedWord: WordWithContext) => {
    if (!currentWord || isAnswered) return;
    if (gameType === "sequence" && selectedMode === "foco") {
      handleSequenceClick(selectedWord);
      return;
    }
    
    const isCorrect = selectedWord.word === currentWord.word;
    
    if (isCorrect) {
      setIsAnswered(true);
      
      let points = 10;
      
      if (selectedMode === "criativo") {
        const comboBonus = Math.min(combo * 2, 10);
        points += comboBonus;
        setCombo(prev => prev + 1);
      }
      
      if (selectedMode === "energia" && timeLeft > 0) {
        const timeBonus = Math.floor(timeLeft * 2);
        points += timeBonus;
        setSpeedBonus(timeBonus);
      }
      
      setScore(prev => prev + points);
      setShowCelebration(true);
      
      if (soundEnabled) {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C5", "0.1");
        setTimeout(() => synth.triggerAttackRelease("E5", "0.1"), 100);
        setTimeout(() => synth.triggerAttackRelease("G5", "0.15"), 200);
      }
      
      speak("Muito bem!");
      
      setTimeout(() => {
        setShowCelebration(false);
        setSpeedBonus(0);
        if (currentRound < 5) {
          setCurrentRound(prev => prev + 1);
        } else {
          setGameState("result");
          cancel();
        }
      }, 2000);
    } else {
      if (selectedMode === "criativo") {
        setCombo(0);
      }
      const wrongIndex = options.findIndex(opt => opt.word === selectedWord.word);
      setShakeWrong(wrongIndex);
      
      if (soundEnabled) {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C3", "0.2");
      }
      
      speak("Tente novamente!");
      setTimeout(() => setShakeWrong(null), 500);
    }
  };

  const repeatWord = () => {
    if (currentWord) {
      if (gameType === "sensory" && currentWord.sensoryPrompt) {
        speak(currentWord.sensoryPrompt);
      } else {
        speak(currentWord.word);
      }
    }
  };

  const toggleSound = async () => {
    if (soundEnabled && oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.dispose();
      gainRef.current?.dispose();
      oscillatorRef.current = null;
      gainRef.current = null;
    } else if (!soundEnabled) {
      await Tone.start();
      const osc = new Tone.Oscillator(40, "sine");
      const gain = new Tone.Gain(0.03);
      osc.connect(gain);
      gain.toDestination();
      osc.start();
      oscillatorRef.current = osc;
      gainRef.current = gain;
    }
    setSoundEnabled(!soundEnabled);
  };

  useEffect(() => {
    if (gameState === "playing" && currentRound >= 0 && currentMission) {
      startNewRound();
    }
  }, [gameState, currentRound, currentMission, startNewRound]);

  useEffect(() => {
    if (gameState === "playing" && gameType === "speed" && selectedMode === "energia" && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, gameType, selectedMode, timeLeft, isAnswered]);

  useEffect(() => {
    if (gameState === "playing" && soundEnabled) {
      const startSound = async () => {
        await Tone.start();
        const osc = new Tone.Oscillator(40, "sine");
        const gain = new Tone.Gain(0.03);
        osc.connect(gain);
        gain.toDestination();
        osc.start();
        oscillatorRef.current = osc;
        gainRef.current = gain;
      };
      startSound();
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.dispose();
        gainRef.current?.dispose();
      }
      cancel();
    };
  }, [gameState, soundEnabled, cancel]);

  useEffect(() => {
    document.body.classList.remove('inicio');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-auto relative">
      <NeuralBackground isActive={gameState === "playing"} />
      <NeuralParticles isActive={gameState === "playing"} />

      <motion.button
        className="back-button"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => {
          cancel();
          if (gameState === "missionMap") {
            setGameState("modeSelect");
          } else if (gameState === "playing") {
            setGameState("missionMap");
          } else {
            setLocation('/');
          }
        }}
        data-testid="button-voltar"
      >
        ← Voltar
      </motion.button>

      <div className="relative z-10 text-center px-4 py-8 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === "modeSelect" && (
            <motion.div
              key="modeSelect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.div
                className="neuro-icon-pulse mx-auto mb-8"
                data-testid="icon-neuro"
              >
                🎮
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Neuro Odysseia
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Escolha seu modo e embarque em missões de aprendizado! 🚀
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(["criativo", "calma", "foco", "energia"] as ModoType[]).map((mode) => {
                  const Icon = modeIcons[mode];
                  const modeMissions = getMissionsByMode(mode);
                  return (
                    <Card
                      key={mode}
                      className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                      onClick={() => selectMode(mode)}
                      data-testid={`button-${mode}`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${modeColors[mode]} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 capitalize">{mode}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {modeMissions.length} missões disponíveis
                      </p>
                      <div className="flex justify-center gap-1">
                        {modeMissions.map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500" fill="none" />
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameState === "missionMap" && selectedMode && (
            <motion.div
              key="missionMap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${modeColors[selectedMode]} flex items-center justify-center`}>
                  {(() => {
                    const Icon = modeIcons[selectedMode];
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <h2 className="text-4xl font-bold capitalize">{selectedMode}</h2>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                Escolha uma missão para começar! 🎯
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getMissionsByMode(selectedMode).map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all h-full"
                      onClick={() => startMission(mission)}
                      data-testid={`mission-${mission.id}`}
                    >
                      <div className="text-4xl mb-3">{mission.reward.badge}</div>
                      <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">
                          Nível {mission.difficulty}
                        </Badge>
                        <Badge variant="secondary">
                          {mission.words.length} palavras
                        </Badge>
                      </div>

                      <div className="flex justify-center gap-1">
                        {[...Array(mission.reward.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500" fill="none" />
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "playing" && currentMission && currentWord && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-primary" data-testid="text-score">
                    ⭐ {score}
                  </div>
                  {selectedMode === "criativo" && combo > 0 && (
                    <Badge className="text-lg animate-pulse">
                      🎨 Combo x{combo}
                    </Badge>
                  )}
                  {selectedMode === "foco" && focusStreak > 0 && (
                    <Badge className="text-lg animate-pulse">
                      🧠 Sequência x{focusStreak}
                    </Badge>
                  )}
                  {selectedMode === "calma" && breathingPhase && (
                    <Badge className="text-lg">
                      🌬️ Respirando...
                    </Badge>
                  )}
                  {selectedMode === "energia" && gameType === "speed" && (
                    <Badge className="text-lg bg-orange-500">
                      ⚡ Velocidade!
                    </Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleSound}
                  data-testid="button-toggle-sound"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
              </div>

              <Progress value={(currentRound / 6) * 100} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Rodada {currentRound + 1} de 6
              </div>

              <Card className="p-8 mb-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {currentMission.title}
                </div>
                
                {gameType === "context" && (
                  <>
                    <p className="text-xl mb-4">Encontre o emoji para:</p>
                    <motion.div
                      className="text-5xl font-extrabold mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      data-testid="text-current-word"
                    >
                      {currentWord.word}
                    </motion.div>
                  </>
                )}

                {gameType === "sensory" && (
                  <>
                    <p className="text-xl mb-4">Siga a instrução e encontre:</p>
                    <motion.div
                      className="text-lg italic mb-4 text-muted-foreground"
                      data-testid="text-sensory-prompt"
                    >
                      "{currentWord.sensoryPrompt}"
                    </motion.div>
                    {breathingPhase && (
                      <motion.div
                        className="text-3xl mb-4"
                        animate={{ scale: breathingPhase === "inhale" ? [1, 1.3] : breathingPhase === "exhale" ? [1.3, 1] : 1 }}
                        transition={{ duration: 3 }}
                      >
                        {breathingPhase === "inhale" && "Inspire... 🌬️"}
                        {breathingPhase === "hold" && "Segure... ⏸️"}
                        {breathingPhase === "exhale" && "Expire... 💨"}
                      </motion.div>
                    )}
                  </>
                )}

                {gameType === "story" && (
                  <>
                    <p className="text-xl mb-4">Complete a frase:</p>
                    <motion.div
                      className="text-lg italic mb-4"
                      data-testid="text-sentence"
                    >
                      "{currentWord.sentence}"
                    </motion.div>
                  </>
                )}

                {gameType === "sequence" && selectedMode === "foco" && (
                  <>
                    {sequencePhase === "show" && (
                      <>
                        <p className="text-xl mb-4">🧠 Memorize a sequência:</p>
                        <div className="flex justify-center gap-4 mb-4">
                          {sequenceToRemember.map((word, i) => (
                            <motion.div
                              key={i}
                              className="text-6xl"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.3 }}
                            >
                              {word.emoji}
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Memorize a ordem...</p>
                      </>
                    )}
                    {sequencePhase === "test" && (
                      <>
                        <p className="text-xl mb-4">Agora mostre a sequência!</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Clique nos emojis na ordem correta ({selectedSequence.length}/{sequenceToRemember.length})
                        </p>
                        {selectedSequence.length > 0 && (
                          <div className="flex justify-center gap-2 mb-4">
                            {selectedSequence.map((word, i) => (
                              <div key={i} className="text-3xl">{word.emoji}</div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {gameType === "speed" && selectedMode === "energia" && (
                  <>
                    <p className="text-xl mb-4">⚡ Rápido! Encontre:</p>
                    <motion.div
                      className="text-5xl font-extrabold mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      data-testid="text-current-word"
                    >
                      {currentWord.word}
                    </motion.div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-3xl font-bold text-orange-500">⏱️ {timeLeft}s</span>
                      {speedBonus > 0 && (
                        <Badge className="text-lg bg-orange-500">+{speedBonus} bônus!</Badge>
                      )}
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={repeatWord}
                    data-testid="button-repeat"
                  >
                    🔊 Repetir
                  </Button>
                  
                  {!showHint && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowHint(true);
                        speak(currentWord.hint);
                      }}
                      data-testid="button-hint"
                    >
                      💡 Dica
                    </Button>
                  )}
                </div>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-accent/20 rounded-lg text-sm"
                  >
                    💡 {currentWord.hint}
                  </motion.div>
                )}
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    className="relative bg-card hover-elevate active-elevate-2 border-2 border-border rounded-2xl p-8 transition-all"
                    style={{
                      opacity: isAnswered ? 0.5 : 1,
                      pointerEvents: isAnswered ? "none" : "auto"
                    }}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ 
                      scale: shakeWrong === index ? [1, 1.1, 0.9, 1.1, 1] : 1,
                      rotate: shakeWrong === index ? [0, -5, 5, -5, 0] : 0
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    onClick={() => handleAnswer(option)}
                    data-testid={`button-option-${index}`}
                  >
                    <div className="text-7xl md:text-8xl">
                      {option.emoji}
                    </div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="text-9xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      🎉
                    </motion.div>
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-4xl"
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          scale: 0,
                          rotate: Math.random() * 360
                        }}
                        animate={{ 
                          x: (Math.random() - 0.5) * 1000,
                          y: (Math.random() - 0.5) * 1000,
                          scale: [0, 1, 0],
                          rotate: Math.random() * 720
                        }}
                        transition={{ duration: 1.5 }}
                      >
                        {["⭐", "✨", "🌟", "💫"][Math.floor(Math.random() * 4)]}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === "result" && currentMission && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                className="neuro-icon-pulse mx-auto mb-8"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Trophy className="w-32 h-32 text-accent" />
              </motion.div>

              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Missão Concluída! 🎉
              </h2>

              <Card className="p-12 mb-8">
                <div className="text-4xl mb-4">{currentMission.reward.badge}</div>
                <h3 className="text-2xl font-bold mb-4">{currentMission.title}</h3>
                <p className="text-lg mb-6">Sua pontuação:</p>
                <motion.div
                  className="text-8xl font-extrabold text-accent mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  data-testid="text-final-score"
                >
                  {score}
                </motion.div>
                <div className="flex items-center justify-center gap-2">
                  {[...Array(currentMission.reward.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8"
                      fill={i < Math.floor(score / 20) ? "#FFD700" : "none"}
                      stroke={i < Math.floor(score / 20) ? "#FFD700" : "currentColor"}
                    />
                  ))}
                </div>
              </Card>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  onClick={() => startMission(currentMission)}
                  data-testid="button-play-again"
                >
                  🔄 Jogar Novamente
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setGameState("missionMap")}
                  data-testid="button-missions"
                >
                  🗺️ Outras Missões
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setGameState("modeSelect")}
                  data-testid="button-modes"
                >
                  🎨 Trocar Modo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
