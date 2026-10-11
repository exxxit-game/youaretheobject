import { APP_T } from './texts.ru.js';
import { drawSeal, sealRadius } from './seal.js';
import { MIN_LETTER } from '../engine/ui/sheet-math.js';

// The consent every room starts with (ethics: informed consent, quit any time, recording only
// when chosen and only from 18), on the clipboard sheet, one page after another: a page
// crowded with text leaves no room for its buttons. Pages: what this is and how to leave; the
// room's own notes (extra, one page each); the age; what recording means, with the two choices.
// The age is asked, not stated: a sentence checks nothing (Steed et al. 2016 asked it; the BPS
// guidance for internet research sends a "no" to a page of its own with no way back): under 18
// the game starts without recording. Resolves with true when the player chose to start with
// recording, false otherwise. sheet: an engine/ui/sheet instance.
// The form is signed by hand, as on paper: the name and the signature, drawn with the laser or the
// mouse, stay in this browser only (privacy.html) and are never sent or logged. Once signed, the lab
// presses its seal by the signature; the seal is as large as its ring's letters need to be read
// (large print, docs/decisions.md), so the date, the signature and the seal take a page of their own.
// Which consent text a result was given under, sent with every result: the controller "shall be able to
// demonstrate that the data subject has consented" (GDPR Art 7(1)), and with anonymous rows the text is
// the only proof (docs/research/revision-2-data.md, D1). Raised whenever the consent's words change
// (APP_T.consent, APP_T.playtest.consent): tests/results.test.mjs holds each version's words.
export const CONSENT_VERSION = 1;
// the signed form, on this device: { name, sign: strokes ([[u, v], ...]), on: the date }
const FORM_KEY = 'object.form';
// the day as the form shows it, in the player's own time
const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function keep([name = [], sign = []]) {
  const short = (strokes) => strokes.map((s) => s.map((p) => p.map((v) => Math.round(v * 1000) / 1000)));
  try { localStorage.setItem(FORM_KEY, JSON.stringify({ name: short(name), sign: short(sign), on: localDay() })); } catch (e) { /* private mode */ }
}

// the lab's seal, drawn in black for the sheet to press in stamp ink
const SEAL_R = sealRadius(MIN_LETTER);
const seal = (mark, locale) => ({ size: 2 * SEAL_R, mark,
  draw: (ctx, r) => drawSeal(ctx, r, { ring: APP_T.lab.toLocaleUpperCase(locale), ink: '#000', paper: '#fff' }) });

export async function askConsent(sheet, { extra = [] }) {
  const C = APP_T.consent;
  const pages = [...extra.map((t) => [t]), ...C.pages];
  const page = (lines) => lines.map((t, i) => ({ t, role: 'body', gap: i ? 0.012 : 0 }));
  // the form: who agrees, what they know, today's date, the line to sign
  const F = C.form;
  const today = new Intl.DateTimeFormat(C.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const [name] = await sheet.fill([{ t: F.title, role: 'title' }, { t: F.agree, role: 'body', gap: 0.018 },
    { t: F.known, role: 'soft', gap: 0.014 }], APP_T.next, F.nameNote);
  const [sign] = await sheet.fill([{ t: `${F.date} ${today}`, role: 'body' }, { t: F.sign, role: 'body', gap: 0.018 }],
    APP_T.next, F.signNote, seal(F.mark, C.locale));
  for (const lines of pages.slice(0, -1)) await sheet.choose(page(lines), [APP_T.next]);
  if (await sheet.choose(page([C.age.ask]), [C.age.yes, C.age.no]) === 1) {
    // under 18 the page says nothing is kept (C.minor), so the signed form is not kept either
    await sheet.choose(page([C.minor]), [C.start]);
    return false;
  }
  // kept only once the player has said he is of age: before, a minor's hand-drawn name stayed in the
  // browser while the page told him nothing would be saved (CodeRabbit's remark, the owner's word)
  keep([name, sign]);
  const picked = await sheet.choose(page(pages.at(-1)), [C.withRecording, C.withoutRecording]);
  return picked === 0;
}
