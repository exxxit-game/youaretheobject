import { T } from './texts.ru.js';
export const VOICE_LINES = ['intro', 'note', 'ready', 'interrupted', 'done'].map(key =>
  ({ text: T[key], file: `voice/${key}.mp3` }));
