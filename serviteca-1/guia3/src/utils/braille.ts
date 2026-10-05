/**
 * Tabla de conversión a Braille (sistema Braille en español).
 * Cubre letras a-z, A-Z, dígitos 0-9 y signos básicos.
 * Usa caracteres Unicode Braille (U+2800–U+28FF).
 */

const BRAILLE_MAP: Record<string, string> = {
  // Letras minúsculas
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑',
  f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕',
  p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽',
  z: '⠵',
  // Letras con tilde
  á: '⠷', é: '⠿', í: '⠌', ó: '⠾', ú: '⠳',
  ü: '⠬', ñ: '⠻',
  // Dígitos (prefijo numérico ⠼ implícito en contexto)
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒',
  '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶',
  '8': '⠦', '9': '⠔',
  // Signos básicos
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒',
  '!': '⠖', '¡': '⠖', '?': '⠦', '¿': '⠦',
  ' ': ' ', '\n': '\n',
};

/** Convierte una cadena de texto a Braille Unicode. */
export function toBraille(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(ch => BRAILLE_MAP[ch] ?? ch)
    .join('');
}
