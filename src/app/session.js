import { sendResult, sendPlaytest, sendIssue, markPlayed } from '../engine/results.js';
import { issueReport } from './issue-report.js';
import { CONSENT_VERSION } from './consent.js';

// One play of a room, from consent to result. Every room uses this, so consent,
// first/repeat runs and sending work the same everywhere.

// The test copy for the owner's headset (exxxit-game.github.io/object-preview, made by
// tools/publish-preview.mjs) never sends: our own checks must not reach the statistics.
export const PREVIEW = location.pathname.startsWith('/object-preview');

// Results are sent only with the privacy page published (privacy.html) and only
// when the player chose "start with recording".
const SENDING_ENABLED = !PREVIEW;

// ?speed=N runs all timings N times faster for tests and headset checks; such
// runs are never sent, so test data cannot reach the statistics.
const requested = Number(new URLSearchParams(location.search).get('speed'));
export const SPEED = requested >= 1 && requested <= 100 ? requested : 1;

// ?playtest=1: after the reveal the player answers the playtest questions, and the
// answers with the run measures go to the playtest table (with consent).
export const PLAYTEST = new URLSearchParams(location.search).get('playtest') === '1';

// At most this many error reports per page load, each distinct message once.
const MAX_ISSUES = 5;

export function createSession(roomId, roomVersion) {
  let record = false;
  let first = true;
  // a second run in one visit (the player left the room and came back) is a repeat even when the
  // browser keeps no storage: the in-page mark stands for it
  let begun = false;
  const queued = [];
  const seen = new Set();
  let sent = 0;
  const canSend = () => SENDING_ENABLED && record && SPEED === 1;
  const flush = () => {
    while (canSend() && queued.length && sent < MAX_ISSUES) { sent++; sendIssue(roomId, roomVersion, CONSENT_VERSION, queued.shift()); }
  };
  return {
    // record: the player chose "start with recording" on the consent screen. A room calls this
    // as its procedure begins: from here the player counts as having seen the experiment.
    begin(withRecording) {
      record = !!withRecording;
      first = markPlayed(roomId) && !begun;
      begun = true;
      if (record) flush(); else queued.length = 0;
    },
    // Game errors: kept until the player chooses, sent only with recording.
    // context() returns { state, xr } at the moment of the error.
    watchIssues(context) {
      const add = (err) => {
        const report = issueReport(err, { ...context(), userAgent: navigator.userAgent });
        const key = report.kind + report.message + report.file + report.line;
        if (seen.has(key)) return;
        seen.add(key);
        queued.push(report);
        flush();
      };
      window.addEventListener('error', (e) => add({ kind: 'error', message: e.message, file: e.filename, line: e.lineno }));
      window.addEventListener('unhandledrejection', (e) => add({ kind: 'rejection', message: (e.reason && (e.reason.message || String(e.reason))) || 'unknown' }));
    },
    get record() { return record; },
    get first() { return first; },
    // Sends the report when the player agreed and this is a real-speed run.
    finish(report) {
      if (!SENDING_ENABLED || !record || SPEED !== 1) return Promise.resolve(false);
      return sendResult(roomId, roomVersion, first, CONSENT_VERSION, report);
    },
    // Playtest feedback: the same conditions, plus playtest mode.
    finishPlaytest(report) {
      if (!SENDING_ENABLED || !PLAYTEST || !record || SPEED !== 1) return Promise.resolve(false);
      return sendPlaytest(roomId, roomVersion, CONSENT_VERSION, report);
    }
  };
}
