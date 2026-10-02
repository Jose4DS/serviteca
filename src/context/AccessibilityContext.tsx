import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { textToBraille } from '../utils/braille';

interface AccessibilityContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  brailleEnabled: boolean;
  toggleBraille: () => void;
  ttsActive: boolean;
  toggleTTS: () => void;
  speak: (text: string, force?: boolean) => void;
  stopSpeech: () => void;
  t: (key: string, fallback?: string) => string;
  renderText: (text: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const LANGUAGE_LOCALES: Record<Language, string> = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  pt: 'pt-PT',
  de: 'de-DE',
  it: 'it-IT',
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('serviteca_lang') as Language;
      return saved && TRANSLATIONS[saved] ? saved : 'es';
    } catch {
      return 'es';
    }
  });

  const [brailleEnabled, setBrailleEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('serviteca_braille') === 'true';
    } catch {
      return false;
    }
  });

  const [ttsActive, setTtsActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('serviteca_tts') === 'true';
    } catch {
      return false;
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('serviteca_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleBraille = () => {
    setBrailleEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('serviteca_braille', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleTTS = () => {
    setTtsActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('serviteca_tts', String(next));
      } catch {
        // ignore
      }
      if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, force = false) => {
      if ((!ttsActive && !force) || !text) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = LANGUAGE_LOCALES[language] || 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    },
    [ttsActive, language]
  );

  // Stop speech if unmounting or language changed
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Translate string & optionally format in Braille
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = TRANSLATIONS[language] || TRANSLATIONS['es'];
      const raw = langDict[key] || TRANSLATIONS['es'][key] || fallback || key;
      if (brailleEnabled) {
        return textToBraille(raw);
      }
      return raw;
    },
    [language, brailleEnabled]
  );

  // Format any generic text (e.g. user input, dynamic messages) according to Braille setting
  const renderText = useCallback(
    (text: string): string => {
      if (!text) return '';
      if (brailleEnabled) {
        return textToBraille(text);
      }
      return text;
    },
    [brailleEnabled]
  );

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        setLanguage,
        brailleEnabled,
        toggleBraille,
        ttsActive,
        toggleTTS,
        speak,
        stopSpeech,
        t,
        renderText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
