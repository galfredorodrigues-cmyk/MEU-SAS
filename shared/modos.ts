export type ModoType = "criativo" | "foco" | "calma" | "energia";

export interface ModoConfig {
  id: ModoType;
  titulo: string;
  icon: string;
  emoji: string;
  palavras: string[];
  cores: string[];
  dicas: string[];
  som: {
    tipo: OscillatorType;
    frequencia: number;
    volume: number;
  };
}

export const modosConfig: Record<ModoType, ModoConfig> = {
  criativo: {
    id: "criativo",
    titulo: "Criatividade",
    icon: "Palette",
    emoji: "🎨",
    palavras: [
      "Criar", "Imaginar", "Desenhar", "Inventar", "Colorir", "Pintar", "Brincar", "Sonhar", "Explorar", "Descobrir",
      "Fazer", "Construir", "Cantar", "Dançar", "Rir", "Sorrir", "Contar", "Voar", "Brilhar", "Transformar",
      "Arte", "Música", "História", "Alegria", "Fantasiar", "Jogar", "Compartilhar", "Expressar", "Celebrar", "Admirar",
      "Cores", "Formas", "Ideias", "Magia", "Aventura", "Animais", "Estrelas", "Arco-íris", "Flores", "Borboletas"
    ],
    cores: ["#FFD93D", "#C77DFF", "#6EC1E4", "#90EE90", "#FF69B4", "#FFA07A", "#87CEEB", "#DDA0DD"],
    dicas: [
      "💡 Criatividade é usar sua imaginação para criar coisas novas e especiais!",
      "🎨 Você pode desenhar, pintar, inventar histórias ou criar músicas!",
      "✨ Não existe certo ou errado quando você cria - seja você mesmo!",
      "🌈 Misture cores, sons e ideias para fazer algo único!",
      "🦋 Sua imaginação pode te levar a lugares mágicos!",
      "⭐ Cada criação sua é especial e importante!",
      "🎭 Brincar de faz de conta ajuda você a ser mais criativo!",
      "🖍️ Experimente coisas novas sem medo - isso é criar!"
    ],
    som: {
      tipo: "sine",
      frequencia: 40,
      volume: 0.05
    }
  },
  calma: {
    id: "calma",
    titulo: "Calma",
    icon: "Cloud",
    emoji: "💗",
    palavras: [
      "Paz", "Amor", "Carinho", "Abraço", "Calma", "Respirar", "Relaxar", "Sorrir", "Gentileza", "Cuidar",
      "Natureza", "Flores", "Sol", "Lua", "Estrelas", "Nuvens", "Mar", "Borboleta", "Pássaros", "Jardim",
      "Doce", "Suave", "Tranquilo", "Silêncio", "Ouvir", "Sentir", "Aconchego", "Esperança", "Luz", "Harmonia",
      "Família", "Amigos", "Casa", "Sono", "Sonhos", "Beleza", "Gratidão", "Bem", "Bondade", "Coração"
    ],
    cores: ["#FFB6C1", "#B0E0E6", "#E6E6FA", "#F0E68C", "#E0BBE4", "#FFDAB9", "#D8BFD8", "#B0C4DE"],
    dicas: [
      "💗 Respirar devagar ajuda você a ficar calmo e feliz!",
      "🌸 Quando você está calmo, consegue ouvir melhor e pensar com clareza!",
      "☁️ Feche os olhos e imagine um lugar tranquilo - isso traz paz!",
      "🦋 A calma é como uma borboleta: delicada e linda!",
      "🌙 Dormir bem ajuda você a ter um dia calmo e cheio de energia!",
      "💙 Sentir amor e carinho te deixa mais tranquilo!",
      "🌺 A natureza nos ensina a ser calmos como as flores!",
      "✨ Momentos de silêncio são presentes especiais para o coração!"
    ],
    som: {
      tipo: "sine",
      frequencia: 38,
      volume: 0.05
    }
  },
  foco: {
    id: "foco",
    titulo: "Foco",
    icon: "Brain",
    emoji: "🧠",
    palavras: [
      "Foco", "Pensar", "Aprender", "Estudar", "Ler", "Ouvir", "Observar", "Entender", "Descobrir", "Praticar",
      "Atenção", "Organizar", "Resolver", "Lembrar", "Concentrar", "Completar", "Terminar", "Fazer", "Crescer", "Evoluir",
      "Números", "Letras", "Palavras", "Livros", "Perguntas", "Respostas", "Ideias", "Cérebro", "Memória", "Conhecer",
      "Olhar", "Escutar", "Sentir", "Tocar", "Experimentar", "Tentar", "Conseguir", "Treinar", "Melhorar", "Avançar"
    ],
    cores: ["#6EC1E4", "#0A84FF", "#5C73F2", "#7B2FF7", "#87CEFA", "#4169E1", "#6A5ACD", "#9370DB"],
    dicas: [
      "🧠 Seu cérebro é como um super computador incrível!",
      "📚 Quanto mais você presta atenção, mais você aprende!",
      "🎯 Fazer uma coisa de cada vez ajuda você a fazer melhor!",
      "👀 Olhar e ouvir com atenção é o segredo do aprendizado!",
      "⭐ Praticar todos os dias faz você ficar cada vez melhor!",
      "🔍 Fazer perguntas é muito importante para aprender!",
      "💪 Seu cérebro fica mais forte quando você o exercita!",
      "🌟 Terminar o que você começou é uma super conquista!"
    ],
    som: {
      tipo: "sine",
      frequencia: 42,
      volume: 0.05
    }
  },
  energia: {
    id: "energia",
    titulo: "Energia",
    icon: "Zap",
    emoji: "⚡",
    palavras: [
      "Energia", "Correr", "Pular", "Dançar", "Brincar", "Mover", "Agitar", "Saltar", "Vibrar", "Acelerar",
      "Força", "Poder", "Vencer", "Conquistar", "Subir", "Voar", "Crescer", "Evoluir", "Brilhar", "Explorar",
      "Alegria", "Risada", "Festa", "Animação", "Empolgação", "Diversão", "Ação", "Velocidade", "Aventura", "Desafio",
      "Sol", "Raio", "Trovão", "Fogo", "Vento", "Explosão", "Foguete", "Super", "Herói", "Campeão"
    ],
    cores: ["#FFD700", "#FF4500", "#FF1493", "#00FFFF", "#90EE90", "#FFA500", "#FF6347", "#32CD32"],
    dicas: [
      "⚡ Energia é o que faz você se mover, brincar e crescer forte!",
      "🏃 Correr, pular e dançar deixam seu corpo cheio de energia!",
      "☀️ Comer bem e dormir direito te dá energia para o dia todo!",
      "💪 Seu corpo é uma máquina incrível cheia de energia!",
      "🎉 Quando você está feliz, sua energia aumenta ainda mais!",
      "🚀 Energia te ajuda a fazer tudo que você gosta!",
      "⭐ Movimentar o corpo todos os dias te deixa forte e saudável!",
      "🌟 Energia positiva faz você e seus amigos felizes!"
    ],
    som: {
      tipo: "sine",
      frequencia: 44,
      volume: 0.05
    }
  }
};
