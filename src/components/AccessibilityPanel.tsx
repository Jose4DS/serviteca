import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Languages, Volume2, VolumeX, Eye, Sparkles, Check } from 'lucide-react';
import { Language } from '../types';

const LANGUAGES_LIST: { code: Language; name: string }[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

export const AccessibilityPanel: React.FC = () => {
  const {
    language,
    setLanguage,
    brailleEnabled,
    toggleBraille,
    ttsActive,
    toggleTTS,
    speak,
    stopSpeech,
    t,
  } = useAccessibility();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleReadCurrentScreen = () => {
    // Collect visible text on the active main screen
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const textToRead = mainEl.innerText || mainEl.textContent || '';
      speak(textToRead, true);
    } else {
      speak('Serviteca', true);
    }
  };

  return (
    <aside 
      className="w-48 sm:w-52 bg-[#2E7D32] text-white rounded-2xl p-4 shadow-lg border border-[#236327] flex flex-col gap-4 select-none shrink-0"
      aria-label="Panel de accesibilidad"
    >
      <div className="border-b border-white/20 pb-2 text-center">
        <h2 className="text-xl font-bold tracking-wide text-white">
          {t('access.title', 'Accesibilidad')}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* 1. TRADUCTOR */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown((prev) => !prev)}
            className="w-full flex items-center gap-2.5 bg-[#8B3A1E] text-white px-3 py-2.5 rounded-lg border border-[#6e2b14] hover:bg-[#9e4324] transition-colors cursor-pointer text-left text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            title={t('access.translator', 'Traductor')}
            aria-expanded={showLanguageDropdown}
          >
            <div className="p-1 rounded bg-black/20 text-white shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="leading-tight">{t('access.translator', 'Traductor')}</span>
              <span className="text-xs text-stone-200 truncate">
                {LANGUAGES_LIST.find((l) => l.code === language)?.name || 'Español'}
              </span>
            </div>
          </button>

          {/* Language selector popout */}
          {showLanguageDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#5AC135] text-black rounded-xl p-2 shadow-2xl z-50 border-2 border-[#459d24]">
              <div className="text-xs font-bold px-2 py-1 border-b border-black/20 mb-1">
                {t('access.selectLanguage', 'Seleccionar Idioma')}
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {LANGUAGES_LIST.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                      speak(`Idioma cambiado a ${lang.name}`);
                    }}
                    className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-sm font-semibold text-left transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#2E7D32] text-white'
                        : 'hover:bg-black/10 text-black'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {language === lang.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. TTS */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              toggleTTS();
              if (!ttsActive) {
                speak('Lectura de voz activada');
              } else {
                stopSpeech();
              }
            }}
            className={`w-full flex items-center justify-between gap-2.5 bg-[#8B3A1E] text-white px-3 py-2.5 rounded-lg border border-[#6e2b14] hover:bg-[#9e4324] transition-colors cursor-pointer text-left text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-white`}
            title={t('access.tts', 'TTS')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1 rounded bg-black/20 text-white shrink-0">
                {ttsActive ? <Volume2 className="w-5 h-5 text-yellow-300" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <span className="leading-tight">{t('access.tts', 'TTS')}</span>
            </div>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                ttsActive ? 'bg-[#5AC135] text-black' : 'bg-black/30 text-stone-300'
              }`}
            >
              {ttsActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {ttsActive && (
            <button
              onClick={handleReadCurrentScreen}
              className="text-xs bg-[#5AC135] hover:bg-[#68d641] text-black font-bold py-1 px-2 rounded-md transition-colors text-center cursor-pointer shadow-sm border border-[#439625]"
            >
              🔊 {t('access.ttsReadScreen', 'Leer pantalla actual')}
            </button>
          )}
        </div>

        {/* 3. BRAILE */}
        <div>
          <button
            onClick={toggleBraille}
            className="w-full flex items-center justify-between gap-2.5 bg-[#8B3A1E] text-white px-3 py-2.5 rounded-lg border border-[#6e2b14] hover:bg-[#9e4324] transition-colors cursor-pointer text-left text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            title={t('access.braille', 'Braile')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1 rounded bg-black/20 text-white shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <span className="leading-tight">{t('access.braille', 'Braile')}</span>
            </div>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                brailleEnabled ? 'bg-[#5AC135] text-black' : 'bg-black/30 text-stone-300'
              }`}
            >
              {brailleEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {brailleEnabled && (
        <div className="mt-auto p-2 bg-[#5AC135] text-black rounded-lg text-xs font-bold text-center border border-[#459d24]">
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Braille Activo</span>
          </p>
        </div>
      )}
    </aside>
  );
};
