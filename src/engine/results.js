// Sends one anonymous result of a finished room to the shared table (Supabase).
// The key below is public by design: it can only call public.submit_run(), which
// accepts a room id, room version, first/repeat flag, the consent text's version and
// a report of numbers, and can only insert. No names, accounts or addresses are sent.
// Never blocks or breaks the game: any failure is ignored.
const ENDPOINT = 'https://rkvdwzlymmewsxjysgma.supabase.co/rest/v1/rpc/submit_run';
const PUBLIC_KEY = 'sb_publishable_w6g0x6vgIM-AfAx-XDWyEw_Kqpm3nAN';

// consent: the version of the consent text the player agreed to (app/consent.js, CONSENT_VERSION)
export function sendResult(room, version, firstRun, consent, report) {
  return post(ENDPOINT, { p_room: room, p_version: version, p_first: firstRun, p_consent: consent, p_report: report });
}

// Playtest feedback (answers plus run measures), only in playtest mode.
export function sendPlaytest(room, version, consent, report) {
  return post(ENDPOINT.replace('submit_run', 'submit_playtest'), { p_room: room, p_version: version, p_consent: consent, p_report: report });
}

// A game error from the player's device (only with consent; see app/session.js).
export function sendIssue(room, version, consent, report) {
  return post(ENDPOINT.replace('submit_run', 'submit_issue'), { p_room: room, p_version: version, p_consent: consent, p_report: report });
}

// Averages of other players' first runs (aggregates only; see 0006_compare_room.sql).
// Resolves null on any failure or after 4 s, so the reveal never waits long.
export function compareRoom(room, version) {
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 4000));
  const ask = fetch(ENDPOINT.replace('submit_run', 'compare_room'), {
    method: 'POST',
    headers: { apikey: PUBLIC_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_room: room, p_version: version })
  }).then(r => (r.ok ? r.json() : null)).catch(() => null);
  return Promise.race([ask, timeout]);
}

function post(url, body) {
  try {
    return fetch(url, {
      method: 'POST',
      headers: { apikey: PUBLIC_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    }).then(r => r.ok).catch(() => false);
  } catch (e) {
    return Promise.resolve(false);
  }
}

// Whether this browser has started this room's procedure before: called when the procedure
// begins (the room's instructions), not at the consent, so a player who left in the corridor is
// still naive and one who saw part of the experiment is not (first vs repeat runs must never be
// mixed in the statistics). Storage may be unavailable: then "first".
export function markPlayed(room) {
  const key = `object.played.${room}`;
  let before = false;
  try { before = localStorage.getItem(key) === '1'; localStorage.setItem(key, '1'); } catch (e) { /* private mode */ }
  return !before;
}
