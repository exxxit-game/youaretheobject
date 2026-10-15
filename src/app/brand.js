import { SIGN_GAP } from '../engine/door.js';

// The game's own colours, the same in every room: the plaque by the door, accents
// on the experimenter's screen. One place, so every room stays recognisable.
export const BRAND = {
  accent: '#d9a441', // amber
  plate: '#15161a'
};

// The signs at the doors, one family (Northern Illinois University, Campus Interior Signage Program:
// Type A for room numbers on main corridors, Type E for stairwells, both 9 × 9 in): on the leaf's
// corridor face, the side the door is pushed from (ADA 2010 703.4.2 allows signs on the push side
// of doors with closers), centred 60 in above the floor (NIU installation). A room's number centred
// and 2 in high, the most ADA 2010 703.2.5 allows, so it reads across the corridor; the stairs' 4 1/2
// in symbol centred over the word, 3/4 in, in capitals (NIU Type E). A sign on a wall, as inside
// room 01, hangs at the latch side 4 in from the frame (NIU installation). Drawn at 2560 px a
// metre. A capital of Inter is 1490 of its 2048 units (sCapHeight in the font's OS/2 table;
// tests/fonts.test.mjs reads it from the files in vendor/fonts), so a font size gives capitals CAP
// of it; sizes are rounded down, so a capital never passes the height the rules allow.
export const CAP = 1490 / 2048;
const inch = (n) => +(n * 0.0254).toFixed(4);
export const SIGN = { w: inch(9), y: inch(60), fromFrame: inch(4), px: 2560 };
SIGN.number = Math.floor(2 * 0.0254 * SIGN.px / CAP);
SIGN.letters = Math.floor(0.75 * 0.0254 * SIGN.px / CAP);
// the panel of a sign at a door: one size for every kind, a plate as thick as its face stands off
// the door or wall it is fixed on (door.js, SIGN_GAP)
export const SIGN_PANEL = `panel="w: ${SIGN.w}; h: ${SIGN.w}; px: ${Math.round(SIGN.w * SIGN.px)}; bg: ${BRAND.plate}; thick: ${SIGN_GAP}"`;

// The plaque on every room's door: its number and nothing else. The experiment's name would tell
// the player what is studied before they do it, and people who know the hypothesis act on it
// (demand characteristics, Orne 1962): the name comes in the reveal, after the room
// (tests/plaque.test.mjs). panel: the plaque's panel component; plaque: { number }.
export function writePlaque(panel, { number }) {
  panel.write([{ t: number, size: SIGN.number, weight: 700, color: BRAND.accent, spacing: 8 }], { bg: BRAND.plate });
}
