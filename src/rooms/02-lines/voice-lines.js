import { T } from './texts.ru.js';
export const VOICE_LINES = ['intro', 'instructions', 'practice', 'ready', 'interference', 'reveal', 'source', 'interrupted']
  .map(key => ({ text: T[key], file: `voice/${key}.mp3` }));
