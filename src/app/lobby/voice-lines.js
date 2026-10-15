import { LOBBY_T } from './texts.ru.js';

// Every line the experimenter says aloud in the corridor and its recording in voice/.
// Regenerate recordings: node tools/make-voice.mjs app/lobby [--force]
export const VOICE_LINES = [
  // the welcome is one take: lines recorded apart came out in different tempo and loudness
  { file: 'voice/welcome.mp3', text: LOBBY_T.welcome.join(' ') },
  { file: 'voice/take-sheet.mp3', text: LOBBY_T.takeSheet },
  { file: 'voice/choose-door.mp3', text: LOBBY_T.chooseDoor }
];
