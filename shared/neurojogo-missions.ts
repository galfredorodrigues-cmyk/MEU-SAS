import { ModoType } from "./modos";

export type GameType = "story" | "context" | "sensory" | "sequence" | "speed";

export interface WordWithContext {
  word: string;
  emoji: string;
  hint: string;
  sentence: string;
  sensoryPrompt?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  mode: ModoType;
  theme: string;
  words: WordWithContext[];
  gameTypes: GameType[];
  difficulty: 1 | 2 | 3;
  reward: {
    stars: number;
    badge: string;
  };
}

export const missions: Mission[] = [
  // CRIATIVO - Missões
  {
    id: "criativo-1",
    title: "Mundo das Cores",
    description: "Descubra as cores mágicas que pintam o mundo!",
    mode: "criativo",
    theme: "cores",
    difficulty: 1,
    gameTypes: ["context", "story"],
    reward: { stars: 3, badge: "🎨" },
    words: [
      {
        word: "Pintar",
        emoji: "🎨",
        hint: "Usar tinta e pincel para fazer arte",
        sentence: "Vou pintar um lindo quadro com muitas cores!",
        sensoryPrompt: "Imagine o cheiro de tinta fresca"
      },
      {
        word: "Arco-íris",
        emoji: "🌈",
        hint: "Aparece no céu depois da chuva, tem 7 cores",
        sentence: "Que lindo arco-íris no céu após a chuva!",
        sensoryPrompt: "Feche os olhos e visualize todas as cores"
      },
      {
        word: "Colorir",
        emoji: "🖍️",
        hint: "Usar lápis de cor em um desenho",
        sentence: "Adoro colorir desenhos com meus lápis favoritos!",
        sensoryPrompt: "Sinta a textura do lápis na sua mão"
      },
      {
        word: "Brilhar",
        emoji: "✨",
        hint: "Emitir luz, ficar luminoso",
        sentence: "As estrelas brilham no céu à noite!",
        sensoryPrompt: "Imagine algo que brilha muito"
      }
    ]
  },
  {
    id: "criativo-2",
    title: "Sons e Músicas",
    description: "Explore o universo musical e seus ritmos!",
    mode: "criativo",
    theme: "musica",
    difficulty: 1,
    gameTypes: ["sensory", "context"],
    reward: { stars: 3, badge: "🎵" },
    words: [
      {
        word: "Cantar",
        emoji: "🎤",
        hint: "Fazer música com a voz",
        sentence: "Adoro cantar minhas músicas preferidas!",
        sensoryPrompt: "Cante 'lá lá lá' bem baixinho"
      },
      {
        word: "Música",
        emoji: "🎵",
        hint: "Sons organizados que fazem melodias",
        sentence: "Essa música me deixa muito feliz!",
        sensoryPrompt: "Ouça os sons ao seu redor"
      },
      {
        word: "Melodia",
        emoji: "🎶",
        hint: "A parte principal de uma música",
        sentence: "Que melodia bonita essa canção tem!",
        sensoryPrompt: "Imagine uma música suave"
      },
      {
        word: "Dançar",
        emoji: "💃",
        hint: "Mover o corpo no ritmo da música",
        sentence: "Vamos dançar e nos divertir!",
        sensoryPrompt: "Balance suavemente de um lado para o outro"
      }
    ]
  },
  {
    id: "criativo-3",
    title: "Histórias Mágicas",
    description: "Crie e conte histórias incríveis!",
    mode: "criativo",
    theme: "historias",
    difficulty: 2,
    gameTypes: ["story", "sequence"],
    reward: { stars: 4, badge: "📚" },
    words: [
      {
        word: "Imaginar",
        emoji: "💭",
        hint: "Criar ideias na sua mente",
        sentence: "Posso imaginar que sou um explorador!",
        sensoryPrompt: "Feche os olhos e imagine algo mágico"
      },
      {
        word: "História",
        emoji: "📖",
        hint: "Um conto com começo, meio e fim",
        sentence: "Vou contar uma história sobre dragões!",
        sensoryPrompt: "Pense na sua história favorita"
      },
      {
        word: "Aventura",
        emoji: "🗺️",
        hint: "Uma jornada emocionante com descobertas",
        sentence: "Que aventura incrível vivemos hoje!",
        sensoryPrompt: "Imagine explorar uma floresta"
      },
      {
        word: "Magia",
        emoji: "✨",
        hint: "Poder especial de fazer coisas extraordinárias",
        sentence: "A magia transformou a abóbora em carruagem!",
        sensoryPrompt: "Imagine ter um poder mágico"
      }
    ]
  },

  // CALMA - Missões
  {
    id: "calma-1",
    title: "Respiração Tranquila",
    description: "Aprenda a respirar e ficar em paz",
    mode: "calma",
    theme: "respiracao",
    difficulty: 1,
    gameTypes: ["sensory", "context"],
    reward: { stars: 3, badge: "🌬️" },
    words: [
      {
        word: "Respirar",
        emoji: "🌬️",
        hint: "Puxar e soltar o ar pelos pulmões",
        sentence: "Vou respirar fundo e me acalmar.",
        sensoryPrompt: "Inspire pelo nariz... expire pela boca"
      },
      {
        word: "Calma",
        emoji: "😌",
        hint: "Estado de tranquilidade e paz",
        sentence: "Quando estou calmo, me sinto muito bem!",
        sensoryPrompt: "Relaxe os ombros... sinta a calma"
      },
      {
        word: "Paz",
        emoji: "☮️",
        hint: "Sentimento de harmonia e sem conflito",
        sentence: "A paz traz felicidade para todos!",
        sensoryPrompt: "Imagine um lugar muito tranquilo"
      },
      {
        word: "Relaxar",
        emoji: "😌",
        hint: "Soltar as tensões do corpo",
        sentence: "É bom relaxar depois de um dia cheio!",
        sensoryPrompt: "Solte todos os músculos do corpo"
      }
    ]
  },
  {
    id: "calma-2",
    title: "Natureza Serena",
    description: "Conecte-se com a beleza da natureza",
    mode: "calma",
    theme: "natureza",
    difficulty: 1,
    gameTypes: ["context", "sensory"],
    reward: { stars: 3, badge: "🌿" },
    words: [
      {
        word: "Flores",
        emoji: "🌸",
        hint: "Parte colorida e perfumada das plantas",
        sentence: "As flores do jardim são lindas e cheirosas!",
        sensoryPrompt: "Imagine o perfume de uma flor"
      },
      {
        word: "Jardim",
        emoji: "🌺",
        hint: "Lugar com plantas, flores e árvores",
        sentence: "Adoro passear pelo jardim de manhã!",
        sensoryPrompt: "Visualize um jardim cheio de cores"
      },
      {
        word: "Borboleta",
        emoji: "🦋",
        hint: "Inseto colorido que voa de flor em flor",
        sentence: "A borboleta dança delicadamente no ar!",
        sensoryPrompt: "Imagine uma borboleta pousando em você"
      },
      {
        word: "Brisa",
        emoji: "🍃",
        hint: "Vento suave e refrescante",
        sentence: "A brisa fresca toca meu rosto suavemente.",
        sensoryPrompt: "Sinta o vento tocando sua pele"
      }
    ]
  },
  {
    id: "calma-3",
    title: "Noite Estrelada",
    description: "Explore a magia da noite tranquila",
    mode: "calma",
    theme: "noite",
    difficulty: 2,
    gameTypes: ["story", "context"],
    reward: { stars: 4, badge: "🌙" },
    words: [
      {
        word: "Lua",
        emoji: "🌙",
        hint: "Astro que brilha no céu à noite",
        sentence: "A lua ilumina o céu escuro da noite.",
        sensoryPrompt: "Olhe para cima e imagine a lua"
      },
      {
        word: "Estrelas",
        emoji: "⭐",
        hint: "Pontos brilhantes no céu noturno",
        sentence: "Contei tantas estrelas no céu hoje!",
        sensoryPrompt: "Imagine milhões de estrelas brilhando"
      },
      {
        word: "Sono",
        emoji: "😴",
        hint: "Estado de descanso quando dormimos",
        sentence: "O sono me deixa descansado e feliz!",
        sensoryPrompt: "Boceje e se espreguice"
      },
      {
        word: "Sonhos",
        emoji: "💭",
        hint: "Imagens e histórias que vemos dormindo",
        sentence: "Tive sonhos lindos essa noite!",
        sensoryPrompt: "Lembre de um sonho bom que teve"
      }
    ]
  },

  // FOCO - Missões
  {
    id: "foco-1",
    title: "Aventura do Aprendizado",
    description: "Descubra o poder de aprender coisas novas!",
    mode: "foco",
    theme: "aprendizado",
    difficulty: 1,
    gameTypes: ["context", "sequence"],
    reward: { stars: 3, badge: "📚" },
    words: [
      {
        word: "Aprender",
        emoji: "📚",
        hint: "Ganhar novos conhecimentos",
        sentence: "Adoro aprender coisas novas todos os dias!",
        sensoryPrompt: "Pense em algo novo que aprendeu"
      },
      {
        word: "Estudar",
        emoji: "✍️",
        hint: "Dedicar tempo para aprender",
        sentence: "Vou estudar para saber cada vez mais!",
        sensoryPrompt: "Imagine lendo um livro interessante"
      },
      {
        word: "Livros",
        emoji: "📖",
        hint: "Objeto com páginas cheias de histórias",
        sentence: "Os livros guardam tantas histórias legais!",
        sensoryPrompt: "Imagine folheando um livro"
      },
      {
        word: "Descobrir",
        emoji: "🔍",
        hint: "Encontrar algo novo ou desconhecido",
        sentence: "Vamos descobrir os segredos da natureza!",
        sensoryPrompt: "Sinta a curiosidade crescendo"
      }
    ]
  },
  {
    id: "foco-2",
    title: "Cérebro Poderoso",
    description: "Exercite seu super cérebro!",
    mode: "foco",
    theme: "cerebro",
    difficulty: 2,
    gameTypes: ["sequence", "context"],
    reward: { stars: 4, badge: "🧠" },
    words: [
      {
        word: "Cérebro",
        emoji: "🧠",
        hint: "Órgão que pensa e aprende",
        sentence: "Meu cérebro é incrível e aprende rápido!",
        sensoryPrompt: "Toque sua cabeça suavemente"
      },
      {
        word: "Pensar",
        emoji: "🤔",
        hint: "Usar a mente para ter ideias",
        sentence: "Vou pensar bem antes de responder!",
        sensoryPrompt: "Faça uma pausa e pense em algo"
      },
      {
        word: "Lembrar",
        emoji: "🧩",
        hint: "Trazer de volta uma memória",
        sentence: "Consigo lembrar do meu aniversário!",
        sensoryPrompt: "Lembre de algo bom de ontem"
      },
      {
        word: "Concentrar",
        emoji: "🎯",
        hint: "Focar toda atenção em algo",
        sentence: "Quando me concentro, faço tudo melhor!",
        sensoryPrompt: "Olhe fixamente para um ponto"
      }
    ]
  },
  {
    id: "foco-3",
    title: "Desafio dos Números",
    description: "Explore o mundo da matemática!",
    mode: "foco",
    theme: "numeros",
    difficulty: 2,
    gameTypes: ["sequence", "speed"],
    reward: { stars: 4, badge: "🔢" },
    words: [
      {
        word: "Números",
        emoji: "🔢",
        hint: "Símbolos para contar (1, 2, 3...)",
        sentence: "Os números nos ajudam a contar tudo!",
        sensoryPrompt: "Conte até 5 nos dedos"
      },
      {
        word: "Cálculo",
        emoji: "➗",
        hint: "Fazer contas matemáticas",
        sentence: "Vou fazer o cálculo para resolver!",
        sensoryPrompt: "Imagine resolvendo 2 + 2"
      },
      {
        word: "Resolver",
        emoji: "✅",
        hint: "Encontrar a solução de um problema",
        sentence: "Consegui resolver o desafio!",
        sensoryPrompt: "Sinta a satisfação de resolver algo"
      },
      {
        word: "Lógica",
        emoji: "🔢",
        hint: "Pensar de forma organizada e correta",
        sentence: "Usando lógica, tudo fica mais fácil!",
        sensoryPrompt: "Organize seus pensamentos"
      }
    ]
  },

  // ENERGIA - Missões
  {
    id: "energia-1",
    title: "Corpo em Movimento",
    description: "Mexa-se e sinta a energia fluir!",
    mode: "energia",
    theme: "movimento",
    difficulty: 1,
    gameTypes: ["speed", "sensory"],
    reward: { stars: 3, badge: "🏃" },
    words: [
      {
        word: "Correr",
        emoji: "🏃",
        hint: "Mover-se muito rápido com as pernas",
        sentence: "Adoro correr e sentir o vento!",
        sensoryPrompt: "Corra no lugar por 3 segundos"
      },
      {
        word: "Pular",
        emoji: "🤸",
        hint: "Saltar para cima com força",
        sentence: "Vou pular bem alto como um canguru!",
        sensoryPrompt: "Dê um pulinho"
      },
      {
        word: "Dançar",
        emoji: "💃",
        hint: "Mover o corpo no ritmo",
        sentence: "Dançar me deixa cheio de alegria!",
        sensoryPrompt: "Balance os braços como se dançasse"
      },
      {
        word: "Força",
        emoji: "💪",
        hint: "Poder do músculo, ser forte",
        sentence: "Tenho força para carregar minha mochila!",
        sensoryPrompt: "Mostre seus músculos"
      }
    ]
  },
  {
    id: "energia-2",
    title: "Esportes Radicais",
    description: "Explore diferentes esportes e atividades!",
    mode: "energia",
    theme: "esportes",
    difficulty: 2,
    gameTypes: ["speed", "context"],
    reward: { stars: 4, badge: "⚽" },
    words: [
      {
        word: "Futebol",
        emoji: "⚽",
        hint: "Esporte com bola e gols",
        sentence: "No futebol, chutamos a bola no gol!",
        sensoryPrompt: "Imagine chutando uma bola"
      },
      {
        word: "Natação",
        emoji: "🏊",
        hint: "Nadar na água",
        sentence: "A natação é refrescante e divertida!",
        sensoryPrompt: "Faça movimentos de nado com os braços"
      },
      {
        word: "Basquete",
        emoji: "🏀",
        hint: "Esporte de arremessar bola na cesta",
        sentence: "No basquete, jogamos a bola na cesta!",
        sensoryPrompt: "Imagine arremessando para cima"
      },
      {
        word: "Ginástica",
        emoji: "🤸‍♀️",
        hint: "Exercícios acrobáticos",
        sentence: "A ginástica desenvolve equilíbrio!",
        sensoryPrompt: "Fique em um pé só por 3 segundos"
      }
    ]
  },
  {
    id: "energia-3",
    title: "Campeões e Vitórias",
    description: "Alcance seus objetivos e vença!",
    mode: "energia",
    theme: "vitoria",
    difficulty: 2,
    gameTypes: ["speed", "sequence"],
    reward: { stars: 4, badge: "🏆" },
    words: [
      {
        word: "Campeão",
        emoji: "🏆",
        hint: "Quem vence e conquista",
        sentence: "Sou campeão quando me dedico!",
        sensoryPrompt: "Levante os braços em comemoração"
      },
      {
        word: "Vitória",
        emoji: "🏅",
        hint: "Conseguir vencer um desafio",
        sentence: "A vitória é fruto do esforço!",
        sensoryPrompt: "Sinta o orgulho de uma conquista"
      },
      {
        word: "Motivação",
        emoji: "🔋",
        hint: "Vontade de fazer e alcançar",
        sentence: "Com motivação, tudo é possível!",
        sensoryPrompt: "Diga 'Eu consigo!' com entusiasmo"
      },
      {
        word: "Energia",
        emoji: "⚡",
        hint: "Força e disposição para agir",
        sentence: "Minha energia me faz ir mais longe!",
        sensoryPrompt: "Sinta a energia em todo seu corpo"
      }
    ]
  }
];

export function getMissionsByMode(mode: ModoType): Mission[] {
  return missions.filter(m => m.mode === mode);
}

export function getMissionById(id: string): Mission | undefined {
  return missions.find(m => m.id === id);
}

export function getAllMissions(): Mission[] {
  return missions;
}
