/**
 * Braille transliteration utility (Grade 1 / Unicode Braille 6-dot patterns)
 */

const BRAILLE_MAP: Record<string, string> = {
  a: '⠁',
  b: '⠃',
  c: '⠉',
  d: '⠙',
  e: '⠑',
  f: '⠋',
  g: '⠛',
  h: '⠓',
  i: '⠊',
  j: '⠚',
  k: '⠅',
  l: '⠇',
  m: '⠍',
  n: '⠝',
  o: '⠕',
  p: '⠏',
  q: '⠟',
  r: '⠗',
  s: '⠎',
  t: '⠞',
  u: '⠥',
  v: '⠧',
  w: '⠺',
  x: '⠭',
  y: '⠽',
  z: '⠵',
  á: '⠷',
  é: '⠿',
  í: '⠌',
  ó: '⠬',
  ú: '⠾',
  ñ: '⠻',
  ü: '⠳',
  '1': '⠁',
  '2': '⠃',
  '3': '⠉',
  '4': '⠙',
  '5': '⠑',
  '6': '⠋',
  '7': '⠛',
  '8': '⠓',
  '9': '⠊',
  '0': '⠚',
  ',': '⠂',
  ';': '⠆',
  ':': '⠒',
  '.': '⠲',
  '!': '⠖',
  '¡': '⠖',
  '?': '⠦',
  '¿': '⠦',
  '-': '⠤',
  '_': '⠤',
  '/': '⠌',
  '@': '⠈',
  '(': '⠶',
  ')': '⠶',
  ' ': ' ',
};

const NUMBER_PREFIX = '⠼';
const CAPITAL_PREFIX = '⠠';

export function textToBraille(text: string): string {
  if (!text) return '';
  let result = '';
  let inNumber = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isDigit = char >= '0' && char <= '9';

    if (isDigit) {
      if (!inNumber) {
        result += NUMBER_PREFIX;
        inNumber = true;
      }
      result += BRAILLE_MAP[char] || char;
      continue;
    }

    inNumber = false;

    if (char >= 'A' && char <= 'Z') {
      result += CAPITAL_PREFIX;
      const lower = char.toLowerCase();
      result += BRAILLE_MAP[lower] || lower;
      continue;
    }

    if (char === 'Á' || char === 'É' || char === 'Í' || char === 'Ó' || char === 'Ú' || char === 'Ñ' || char === 'Ü') {
      result += CAPITAL_PREFIX;
      const lower = char.toLowerCase();
      result += BRAILLE_MAP[lower] || lower;
      continue;
    }

    result += BRAILLE_MAP[char] || char;
  }

  return result;
}
