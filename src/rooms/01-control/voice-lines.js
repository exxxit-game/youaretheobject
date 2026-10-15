import { T } from './texts.ru.js';

// Every line the experimenter says aloud and its recording in voice/.
// Regenerate recordings: node tools/make-voice.mjs 01-control [--force]
const Q = T.questions;
export const VOICE_LINES = [
  ...T.instructions.map((text, i) => ({ file: `voice/instruction-${i + 1}.mp3`, text })),
  ...T.concept.map((text, i) => ({ file: `voice/concept-${i + 1}.mp3`, text })),
  { file: 'voice/repeat-question.mp3', text: T.repeatQuestion },
  { file: 'voice/leave.mp3', text: T.leave },
  { file: 'voice/back.mp3', text: T.back },
  ...['control', 'total', 'ifPress', 'ifNoPress', 'certainty', 'evidence', 'hypotheses', 'gender', 'age', 'knew']
    .map((key) => ({ file: `voice/q-${key}.mp3`, text: Q[key].ask })),
  { file: 'voice/thanks.mp3', text: T.thanks }
];
