import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WordFlow({ active }: { active: boolean }) {
  const words = [
    "casa","cama","mesa","bola","livro","lápis","escola","porta","rua","roupa",
    "mãe","pai","amigo","bebê","amor","abraço","sorriso","feliz","calma","brincar",
    "gato","cachorro","peixe","sapo","vaca","porco","pato","cavalo","leão","coelho",
    "sol","lua","céu","flor","árvore","vento","mar","chuva","estrela","folha",
    "azul","verde","rosa","amarelo","vermelho",
    "correr","pular","nadar","dançar","voar","sorrir","dormir","comer","cantar","brincar",
    "pão","leite","água","fruta","bolo","banana","maçã","arroz","feijão","suco",
    "pensar","aprender","ouvir","ver","sentir","sonho","luz","som","energia","foco",
    "mágico","história","estrela","riso","fantasia","descobrir","viagem","desenho","jogo","brincar",
    "paz","amor","respeito","gratidão","alegria","coragem","bondade","esperança","carinho","amizade",
    "terra","mar","cidade","escola","mundo"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [active, words.length]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-7xl font-extrabold"
          style={{
            color: ["#7BE2FF","#C47BFF","#A4FFDA","#FFD580"][index % 4],
            textShadow: "0 0 25px rgba(255,255,255,0.3)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
