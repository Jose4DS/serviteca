import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Idioma } from '../types';

interface AccessibilityContextValue {
  idioma: Idioma;
  setIdioma: (lang: Idioma) => void;
  ttsActive: boolean;
  toggleTTS: () => void;
  brailleActive: boolean;
  toggleBraille: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('es');
  const [ttsActive, setTtsActive] = useState(false);
  const [brailleActive, setBrailleActive] = useState(false);

  const toggleTTS = () => setTtsActive(v => !v);
  const toggleBraille = () => setBrailleActive(v => !v);

  const speak = useCallback((text: string) => {
    if (!ttsActive) return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = idioma === 'es' ? 'es-CO' : 'en-US';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  }, [ttsActive, idioma]);

  return (
    <AccessibilityContext.Provider value={{
      idioma, setIdioma,
      ttsActive, toggleTTS,
      brailleActive, toggleBraille,
      speak,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be inside AccessibilityProvider');
  return ctx;
}
