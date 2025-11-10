import { useRef, useCallback, useEffect } from 'react';

const log = (msg: string) => {
  try {
    console.log("[BrinLê Neuro]", msg);
  } catch (e) {}
};

let voicesCache: SpeechSynthesisVoice[] = [];
let voicesLoadedGlobal = false;

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const loadVoices = (): SpeechSynthesisVoice[] => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesCache = voices;
    voicesLoadedGlobal = true;
    log(`🔊 Vozes carregadas: ${voices.length} vozes disponíveis`);
    
    const ptVoices = voices.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoices.length > 0) {
      log(`🔊 Vozes PT disponíveis: ${ptVoices.map(v => `${v.name} (${v.lang})`).join(', ')}`);
    } else {
      log(`🔊 ⚠️ Nenhuma voz PT-BR encontrada, usando voz padrão`);
    }
  }
  return voices;
};

const pickMaleVoice = (): SpeechSynthesisVoice | null => {
  const voices = voicesCache.length > 0 ? voicesCache : loadVoices();
  
  if (!voices || voices.length === 0) {
    log('🗣️ ⚠️ Nenhuma voz disponível');
    return null;
  }

  let voice = voices.find(v => 
    v.lang.includes("pt-BR") && 
    v.name.includes("Google") && 
    (v.name.includes("Male") || v.name.includes("Masculin"))
  );
  
  if (voice) {
    log(`🗣️ ✅ Voz masculina Google: ${voice.name}`);
    return voice;
  }

  voice = voices.find(v => 
    v.lang.includes("pt-BR") && 
    /male|masculin|homem|man/i.test(v.name)
  );
  
  if (voice) {
    log(`🗣️ ✅ Voz masculina PT-BR: ${voice.name}`);
    return voice;
  }

  voice = voices.find(v => v.lang.includes("pt-BR"));
  if (voice) {
    log(`🗣️ ✅ Voz PT-BR: ${voice.name}`);
    return voice;
  }

  voice = voices.find(v => v.lang.startsWith("pt"));
  if (voice) {
    log(`🗣️ ✅ Voz PT: ${voice.name}`);
    return voice;
  }

  if (isIOS) {
    voice = voices.find(v => v.lang.startsWith("en"));
    if (voice) {
      log(`🗣️ ⚠️ iOS: Usando voz inglesa (pt-BR não disponível): ${voice.name}`);
      return voice;
    }
  }

  log(`🗣️ Usando voz padrão do sistema: ${voices[0]?.name || 'desconhecida'}`);
  return voices[0] || null;
};

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);
  const voicesListenerRef = useRef(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      log('🗣️ Speech Synthesis não disponível');
      return;
    }

    if (!voicesListenerRef.current) {
      voicesListenerRef.current = true;
      
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };

      loadVoices();
      
      setTimeout(() => {
        loadVoices();
      }, 100);
    }

    return () => {
      if (isSpeakingRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      log('🗣️ ❌ Speech Synthesis não disponível');
      return;
    }

    log(`🗣️ 🎯 TENTANDO FALAR: "${text}"`);

    try {
      const synth = window.speechSynthesis;
      
      if (synth.speaking || synth.pending) {
        log('🗣️ ⏹️ Cancelando fala anterior');
        synth.cancel();
      }

      let voices = synth.getVoices();
      if (voices.length === 0) {
        log('🗣️ ⚠️ Nenhuma voz carregada ainda, tentando carregar...');
        loadVoices();
        voices = synth.getVoices();
      }

      log(`🗣️ 📊 Total de vozes: ${voices.length}`);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 1.0;

      const voice = pickMaleVoice();
      
      if (voice) {
        utterance.voice = voice;
        log(`🗣️ 🎙️ Usando: ${voice.name} (${voice.lang})`);
      } else {
        log(`🗣️ 🎙️ Usando voz padrão (nenhuma PT-BR encontrada)`);
      }

      utteranceRef.current = utterance;
      
      utterance.onstart = () => {
        isSpeakingRef.current = true;
        log(`🗣️ ✅ COMEÇOU A FALAR: "${text}"`);
      };
      
      utterance.onend = () => {
        isSpeakingRef.current = false;
        log(`🗣️ ✅ TERMINOU: "${text}"`);
      };
      
      utterance.onerror = (event) => {
        isSpeakingRef.current = false;
        log(`🗣️ ❌ ERRO "${event.error}" ao falar: "${text}"`);
        console.error('Speech error:', {
          error: event.error,
          text: text,
          charIndex: event.charIndex,
          elapsedTime: event.elapsedTime,
          utterance: event.utterance
        });
      };

      synth.speak(utterance);
      log(`🗣️ 🚀 Comando speak() EXECUTADO!`);
      
      setTimeout(() => {
        if (!isSpeakingRef.current && synth.speaking === false) {
          log(`🗣️ ⚠️ Fala não iniciou após 500ms - possível bloqueio do navegador`);
        }
      }, 500);
      
    } catch (error) {
      log(`🗣️ ❌ EXCEÇÃO: ${error}`);
      console.error('Speech exception:', error);
    }
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
      log('🗣️ Fala cancelada');
    }
  }, []);

  return { speak, cancel };
}
