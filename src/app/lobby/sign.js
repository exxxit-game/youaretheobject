// The light box above door 1: the first thing the player sees, before any text
// (phenomenon first: Allen 2004, Exploratorium), and its clicks turn the eyes to it (a new
// sound draws the gaze in VR, a still light does not: Rothe & Hußmann 2018). It shows the
// game's name as the site's address, and every word has its own lamp, so the sign can
// play with it (a sign losing letters to say something else: TV Tropes "Signs of
// Disrepair"; a part goes dark alone only with its own lamp: Signs of the Times).
// The name is English in every language and is never translated; its words are player text, kept in
// texts.ru.js with the rest of it.
import { PLAN } from './plan.js';
import { LOBBY_T } from './texts.ru.js';
export const SIGN_WORDS = LOBBY_T.signWords;
export const SIGN_STYLE = { size: 84, weight: 800, spacing: 4, pad: 36, bg: '#160f05', on: '#ffe7b0', off: '#3a2d1f' };
// Where the sign's face hangs (world metres), over door 1 on the north wall (src/app/lobby/plan.js):
// a box 0.09 m deep, its foot on the frame head's top (2.2042 m: door.js, the head 51 mm deep at
// 2.1787 m) and its top on a block joint (2.4 m), the face on its front, drawn over it as a decal
// (panel decal). Its sounds come from here and scene.js draws it here.
const HEAD_TOP = 2.2042, JOINT = 2.4;
export const SIGN_BOX = { depth: 0.09, h: +(JOINT - HEAD_TOP).toFixed(4), z: +(PLAN.north + 0.045).toFixed(3) };
export const SIGN_AT = { x: PLAN.entrance, y: +((HEAD_TOP + JOINT) / 2).toFixed(4), z: +(PLAN.north + SIGN_BOX.depth).toFixed(3) };

// The tubes start like old fluorescent lamps: each try heats the tube ends (a dim glow;
// 0.5–2 s by lamp type, about 1.5 s typical: DIAL, "Starters"), then the starter kicks;
// a simple glow starter often needs several tries. [heat from, kick at] in seconds.
export const SIGN_TRIES = [[0.1, 1.5], [1.75, 3.2], [3.45, 4.9]];
const SPARK = 0.03;   // a kick or a cut-out is near instant

// steps: [time, levels (one number for every word, or { word: level }), fade s, cue]; a cue
// ({ sound, hum, humS }, or true for a starter click) fires as the change begins; hum is a
// share of the sign's full hum (0..1), humS the seconds it takes to get there; the first hum
// cue starts the hum.
const CLICK = { sound: 'sign-click' };
function play(steps, from = [[0, SIGN_WORDS.map(() => 0.04)]]) {
  const keys = from.map((k) => [...k]);
  for (const [t, set, fade = SPARK, cue] of steps) {
    const prev = keys[keys.length - 1][1];
    const next = SIGN_WORDS.map((w, i) => (typeof set === 'number' ? set : (w in set ? set[w] : prev[i])));
    keys.push([t, prev, cue === true ? CLICK : cue], [t + fade, next]);
  }
  return keys;
}

const [[h1, k1], [h2, k2], [h3, k3]] = SIGN_TRIES;
// When the whole sign is first lit: its hum starts, as a cue of the lamps' own clock (a window
// timer beside them drifts apart from it after a stalled frame).
export const SIGN_LIT_AT = k3 + SPARK;
// To "you object" in about 18 s, each change slow enough to watch; a title needs about 5 s
// to be read twice (19 letters: Pinnacle Studio title guidance), short words about 3 s.
const TO_YOU_OBJECT = play([
  [h1, 0.13, SPARK, true], [k1, 0.6, SPARK, true], [k1 + 0.12, 0.05],
  [h2, 0.13, SPARK, true], [k2, 0.75, SPARK, true], [k2 + 0.14, 0.06],
  [h3, 0.13, SPARK, true], [k3, 1, SPARK, true],                     // youaretheobject.com
  [SIGN_LIT_AT, {}, SPARK, { hum: 1 }],
  // the ".com" lamp fails: it blinks about once a second, then dies with an afterglow
  // (an end-of-life fluorescent lamp blinks about once a second: Wikipedia "Glow switch starter")
  [9.9, { '.com': 0.35 }, 0.15], [10.3, { '.com': 1 }, 0.1, true],
  [10.9, { '.com': 0.3 }, 0.15], [11.3, { '.com': 1 }, 0.1, true],
  [11.9, { '.com': 0.25 }, 0.15], [12.3, { '.com': 0.9 }, 0.1, true],
  [12.9, { '.com': 0.04 }, 0.5],                                      // youaretheobject
  [16.4, { are: 0.04, the: 0.04 }, 2]                                 // you object
]);

// The last beat, three ways, one per visit (SIGN_ROUND; ?sign=a|b|c forces one). A
// strong ending is a pause, then one clear event, then a still hold on the name, handing the
// eye on ("button": No Film School; logo stings: build, hold, exit). Every change is a single
// ramp; brightness rising over 0.75 s does not read as a flash (Jordan & Vanderheiden 2024).
export const SIGN_ENDINGS = {
  // a: the power goes: dark and quiet (a pause before a payoff makes people lean in: Margulis
  // 2007), then a breaker lever and the contactor, and the tubes relight one by one, each
  // through its own starter, ending on "you" nearest the clipboard
  a: play([
    [21.4, { you: 0.04, object: 0.04 }, 0.75, { hum: 0, humS: 0.75 }],
    [23.65, {}, SPARK, { sound: 'breaker-clack' }],
    [23.8, { object: 1 }, 0.3, { sound: 'relay-thunk', hum: 1, humS: 1 }],
    [24.15, { the: 1 }, 0.3, true], [24.5, { are: 1 }, 0.3, true], [24.85, { you: 1 }, 0.3, true]
  ], TO_YOU_OBJECT),
  // b: only "you" stays lit, as if the sign addressed the player; the whole name returns when
  // the player takes the clipboard (SIGN_ANSWER): the sign answers what they did
  b: play([[21.4, { object: 0.04 }, 0.75, { hum: 0.5, humS: 0.75 }]], TO_YOU_OBJECT),
  // c: "are" and "the" come back at once with the contactor, and the name holds
  c: play([[21.4, { are: 1, the: 1 }, 0.75, { sound: 'relay-thunk', hum: 1, humS: 0.75 }]], TO_YOU_OBJECT)
};
// Ending b's answer, run when the player takes the clipboard.
export const SIGN_ANSWER = play([[0.05, { are: 1, the: 1, object: 1 }, 0.75, { sound: 'relay-thunk', hum: 1, humS: 0.75 }]],
  [[0, SIGN_ENDINGS.b.at(-1)[1]]]);
// The ending changes from visit to visit, in this order (the first visit gets a): a player who
// comes back meets a different last beat, and new endings join the round.
export const SIGN_ROUND = ['a', 'b', 'c'];
export const SIGN_ENDING_DEFAULT = SIGN_ROUND[0];

// visits: how many times this player's sign has played before; asked: ?sign= (for checks)
export function pickEnding(visits, asked) {
  if (asked && Object.hasOwn(SIGN_ENDINGS, asked)) return asked;
  return SIGN_ROUND[(Math.max(0, visits | 0)) % SIGN_ROUND.length];
}

// The arrival in VR, one thing at a time. People in a new VR place spend at least the
// first 10 seconds looking around and notice nothing else (West 2015, Unity Labs, from
// 100+ first-time players), so the sign stays dark that long. Then it waits until the
// player faces it (within lookDeg to either side), at most lookWaitS more: a player still
// looking away is turned by its clicks, and the start is slow enough to turn in time.
// Once its play ends the sign shines alone for litPauseS before the voice. lookDeg,
// lookWaitS and litPauseS are our choices, to be checked in the headset.
export const ARRIVAL = { orientS: 10, lookDeg: 30, lookWaitS: 10, litPauseS: 3 };

// Does a head at eye [x, y, z] looking along forward [x, y, z] face the sign? Only the
// turn to the side counts: the sign hangs high over the door, above a level gaze.
export function facesSign(eye, forward) {
  const look = Math.atan2(forward[0], -forward[2]);
  const to = Math.atan2(SIGN_AT.x - eye[0], -(SIGN_AT.z - eye[2]));
  const off = Math.abs(((look - to + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
  return off * 180 / Math.PI <= ARRIVAL.lookDeg;
}

// When the sign may start, as one rule the opening follows and the tests check. device:
// { headset: a VR headset can be used here, questBrowser: this is the headset's own browser };
// moment: 'load', 'flat-press' (a key or a press on the 3D view on the flat page) or 'enter-vr'.
// Returns 'now', 'settle' (after the player has looked around in VR: settleArrival) or 'wait'.
// Never at load: a browser plays no sound before the player's first press, and the sign's clicks,
// meant to turn the eyes to it, were lost (or, held for the press, went off all at once). On a
// computer, VR or not, the first press on the flat page starts it. In the headset's own browser
// the flat page is only the door to VR, and people press or drag on it to look around before they
// press VR: a press there never starts the sign; entering VR does.
export function arrivalStep({ headset, questBrowser }, moment) {
  if (!headset) return moment === 'flat-press' ? 'now' : 'wait';
  if (moment === 'enter-vr') return 'settle';
  if (moment === 'flat-press') return questBrowser ? 'wait' : 'now';
  return 'wait';
}

// The wait in VR before the sign starts: ARRIVAL.orientS of looking around first, then until the
// player faces it, at most ARRIVAL.lookWaitS more. wait(seconds) and faces() come from the scene
// (and from the tests, which time it).
export async function settleArrival(wait, faces) {
  await wait(ARRIVAL.orientS);
  for (let waited = 0; waited < ARRIVAL.lookWaitS; waited += 0.2) {
    if (faces()) return;
    await wait(0.2);
  }
}
