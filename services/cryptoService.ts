
import { MORSE_CODE_MAP } from '../constants';
import { EncryptionMethod } from '../types';

const REVERSE_MORSE_CODE_MAP = Object.entries(MORSE_CODE_MAP).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as { [key: string]: string });


// --- Caesar Cipher ---
const caesarShift = (text: string, shift: number, mode: 'encrypt' | 'decrypt'): string => {
  const effectiveShift = mode === 'encrypt' ? shift : -shift;
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // Uppercase letters
      return String.fromCharCode(((code - 65 + effectiveShift) % 26 + 26) % 26 + 65);
    }
    if (code >= 97 && code <= 122) { // Lowercase letters
      return String.fromCharCode(((code - 97 + effectiveShift) % 26 + 26) % 26 + 97);
    }
    return char; // Non-alphabetic characters
  }).join('');
};

const getCaesarShiftFromKey = (key: string): number => {
  return key.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

// --- Morse Code Cipher ---
const textToMorse = (text: string): string => {
  return text.toUpperCase().split('').map(char => MORSE_CODE_MAP[char] || '').join(' ');
};

const morseToText = (morse: string): string => {
  return morse.split(' ').map(code => REVERSE_MORSE_CODE_MAP[code] || '').join('');
};

const applyKeyToMorse = (morse: string, key: string, mode: 'encrypt' | 'decrypt'): string => {
  const keyDigits = key.split('').map(d => parseInt(d, 10));
  return morse.split('').map((char, index) => {
    const shift = keyDigits[index % key.length];
    const shiftAmount = mode === 'encrypt' ? shift : -shift;
    return String.fromCharCode(char.charCodeAt(0) + shiftAmount);
  }).join('');
};


// --- Public API ---
export const encrypt = (text: string, key: string, method: EncryptionMethod): string => {
  switch (method) {
    case EncryptionMethod.CAESAR:
      const shift = getCaesarShiftFromKey(key);
      return caesarShift(text, shift, 'encrypt');
    case EncryptionMethod.MORSE:
      const morse = textToMorse(text);
      return applyKeyToMorse(morse, key, 'encrypt');
    default:
      throw new Error('Unknown encryption method');
  }
};

export const decrypt = (cipherText: string, key: string, method: EncryptionMethod): string => {
  switch (method) {
    case EncryptionMethod.CAESAR:
      const shift = getCaesarShiftFromKey(key);
      return caesarShift(cipherText, shift, 'decrypt');
    case EncryptionMethod.MORSE:
      const morse = applyKeyToMorse(cipherText, key, 'decrypt');
      return morseToText(morse);
    default:
      throw new Error('Unknown encryption method');
  }
};
