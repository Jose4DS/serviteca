import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { toBraille } from '../utils/braille';
import type { Idioma } from '../types';

export default function AccessibilityPanel() {
  const {
    idioma, setIdioma,
    ttsActive, toggleTTS,
    brailleActive, toggleBraille,
    speak,
  } = useAccessibility();

  const [ttsText, setTtsText] = useState('');
  const [brailleText, setBrailleText] = useState('');
  const [expanded, setExpanded] = useState(true);

  const IDIOMAS: { value: Idioma; label: string }[] = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },  // NUEVO v2
  ];

  return (
    <aside
      aria-label={t('acc.title', idioma)}
      style={{
        width: expanded ? 220 : 44,
        minHeight: '100%',
        background: '#4a7c59',
        borderLeft: '3px solid #2e5c3a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Cabecera con toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        title={expanded ? 'Colapsar panel' : 'Expandir panel de accesibilidad'}
        style={{
          background: '#3a6b47',
          border: 'none',
          color: 'white',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'Times New Roman, serif',
          fontWeight: 'bold',
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}
        aria-expanded={expanded}
      >
        <span style={{ fontSize: 18 }}>♿</span>
        {expanded && t('acc.title', idioma)}
      </button>

      {expanded && (
        <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Traductor ─────────────────────────────── */}
          <Section title={t('acc.translator', idioma)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {IDIOMAS.map(lang => (
                <label
                  key={lang.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 13,
                    color: 'white',
                  }}
                >
                  <input
                    type="radio"
                    name="idioma"
                    value={lang.value}
                    checked={idioma === lang.value}
                    onChange={() => setIdioma(lang.value)}
                    style={{ accentColor: '#6B2A2A' }}
                  />
                  {lang.label}
                </label>
              ))}
            </div>
          </Section>

          {/* ── TTS ───────────────────────────────────── */}
          <Section title={t('acc.tts', idioma)}>
            <ToggleBtn
              active={ttsActive}
              onLabel={t('acc.ttsOff', idioma)}
              offLabel={t('acc.ttsOn', idioma)}
              onClick={toggleTTS}
            />
            {ttsActive && (
              <>
                <textarea
                  value={ttsText}
                  onChange={e => setTtsText(e.target.value)}
                  placeholder="Escribe texto para leer..."
                  rows={3}
                  style={{
                    width: '100%',
                    resize: 'none',
                    borderRadius: 4,
                    border: '1px solid #2e5c3a',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 12,
                    padding: '4px 6px',
                    marginTop: 6,
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => speak(ttsText)}
                  style={actionBtnStyle}
                >
                  ▶ Leer
                </button>
                <button
                  onClick={() => window.speechSynthesis.cancel()}
                  style={{ ...actionBtnStyle, background: '#922b21', marginTop: 4 }}
                >
                  ■ Detener
                </button>
              </>
            )}
          </Section>

          {/* ── Braille ───────────────────────────────── */}
          <Section title={t('acc.braille', idioma)}>
            <ToggleBtn
              active={brailleActive}
              onLabel={t('acc.brailleOff', idioma)}
              offLabel={t('acc.brailleOn', idioma)}
              onClick={toggleBraille}
            />
            {brailleActive && (
              <>
                <textarea
                  value={brailleText}
                  onChange={e => setBrailleText(e.target.value)}
                  placeholder="Escribe texto..."
                  rows={3}
                  style={{
                    width: '100%',
                    resize: 'none',
                    borderRadius: 4,
                    border: '1px solid #2e5c3a',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 12,
                    padding: '4px 6px',
                    marginTop: 6,
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  aria-label="Resultado en Braille"
                  style={{
                    marginTop: 6,
                    background: '#f8faf8',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 18,
                    letterSpacing: 2,
                    minHeight: 32,
                    wordBreak: 'break-all',
                    color: '#1a1a1a',
                  }}
                >
                  {toBraille(brailleText) || <span style={{ color: '#888', fontSize: 12 }}>Resultado Braille</span>}
                </div>
              </>
            )}
          </Section>

        </div>
      )}
    </aside>
  );
}

/* ── Sub-componentes internos ─────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          color: '#d4f0d4',
          fontFamily: 'Times New Roman, serif',
          fontWeight: 'bold',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 6,
          borderBottom: '1px solid #2e5c3a',
          paddingBottom: 3,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: '#6B2A2A',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  padding: '4px 10px',
  cursor: 'pointer',
  fontFamily: 'Times New Roman, serif',
  fontSize: 12,
  width: '100%',
  marginTop: 4,
};

function ToggleBtn({
  active,
  onLabel,
  offLabel,
  onClick,
}: {
  active: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        ...actionBtnStyle,
        background: active ? '#2e5c3a' : '#6B2A2A',
        border: `2px solid ${active ? '#d4f0d4' : '#4a1a1a'}`,
        marginTop: 0,
      }}
    >
      {active ? onLabel : offLabel}
    </button>
  );
}
