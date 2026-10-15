// Sound effects of room 01 and the prompts they were generated from
// (ElevenLabs sound generation). Regenerate: node tools/make-sounds.mjs 01-control [--force]
export const SOUNDS = [
  { name: 'button', file: 'sound/button.mp3', seconds: 0.5,
    prompt: 'a single press of a small spring-loaded push button on a wooden box, short dry mechanical click, close' },
  { name: 'door', file: 'sound/door.mp3', seconds: 2,
    prompt: 'an office door behind you opens and closes quietly, footsteps leaving, small quiet room, 1970s building' },
  { name: 'room', file: 'sound/room.mp3', seconds: 20,
    prompt: 'quiet constant room tone of a small windowless laboratory booth, soft ventilation hum and faint electrical hum of a lamp, no voices, seamless' }
];
