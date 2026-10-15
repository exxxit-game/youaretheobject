// Sound effects of the corridor and the prompts they were generated from
// (ElevenLabs sound generation). Regenerate: node tools/make-sounds.mjs app/lobby [--force]
// The sign's starter click turns the player's eyes to it: in VR a new sound draws the
// gaze, a still light does not (Rothe & Hußmann 2018, LMU).
export const SOUNDS = [
  { name: 'sign-click', file: 'sound/sign-click.mp3', seconds: 0.5,
    prompt: 'the starter of an old fluorescent tube light clicking once with a short electric buzz, close, dry, no music' },
  { name: 'sign-hum', file: 'sound/sign-hum.mp3', seconds: 10,
    prompt: 'steady low electrical hum of an old fluorescent light box, quiet, constant, seamless loop, no clicks, no music' },
  // the sign's power cut and restored: a breaker lever, then the contactor closing; soft
  // attack and low, so it lands without a startle (startle falls with longer rise times)
  { name: 'breaker-clack', file: 'sound/breaker-clack.mp3', seconds: 0.6,
    prompt: 'the lever of an old electrical breaker panel thrown by hand, one dry metallic clack, a few metres away, no echo, no music' },
  { name: 'relay-thunk', file: 'sound/relay-thunk.mp3', seconds: 1.2,
    prompt: 'a heavy electrical contactor closing with a low soft thunk, then the faint buzz of fluorescent ballasts starting, a few metres away, not loud, no music' }
];

// Gains set by measuring in the headset from the arrival spot (`tools/quest-look.mjs`, levels,
// which holds the mix): the clicks, the breaker and the relay land a few dB under the voice's
// peaks, the hum is a quiet bed well under speech. The starter click is a faint sound on its own
// and the sign sits above the player, which the head's filtering dims further: hence its large
// gain. Every sound has one (tests/sound.test.mjs).
export const SOUND_GAIN = { 'sign-click': 9, 'breaker-clack': 1.1, 'relay-thunk': 1.7, 'sign-hum': 0.28 };
