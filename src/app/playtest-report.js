// Pure: builds the playtest report sent to public.submit_playtest(). The field
// names and ranges must match supabase/migrations/0004_playtests.sql;
// tests/playtest.test.mjs checks that they do.

// Answers to the playtest questions, as option indexes (next: 0–10 on the scale).
export const PLAYTEST_KEYS = ['next', 'boring', 'guessed', 'trouble', 'psych'];

// From the browser's user agent: which headset (or none).
export function deviceOf(userAgent) {
  const ua = String(userAgent || '');
  if (/Quest 3S/i.test(ua)) return 'quest3s';
  if (/Quest 3/i.test(ua)) return 'quest3';
  if (/Quest Pro/i.test(ua)) return 'questpro';
  if (/Quest 2|Quest/i.test(ua)) return 'quest2';
  if (/Mobile|Android|VR/i.test(ua)) return 'other';
  return 'desktop';
}

const whole = (x, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(x) || 0)));

// run: { finished, secs: {intro, run, questions, reveal}, away, presses, voided,
//        seated, userAgent }; answers: { next, boring, guessed, trouble, psych }
export function playtestReport(run, answers) {
  const secs = {};
  for (const k of ['intro', 'run', 'questions', 'reveal']) {
    if (run.secs && run.secs[k] != null) secs[k] = whole(run.secs[k], 0, 7200);
  }
  const report = {
    finished: !!run.finished,
    secs,
    away: whole(run.away, 0, 7200),
    presses: whole(run.presses, 0, 1000),
    voided: whole(run.voided, 0, 1000),
    seated: !!run.seated,
    device: deviceOf(run.userAgent)
  };
  const ranges = { next: 10, boring: 4, guessed: 2, trouble: 4, psych: 2 };
  for (const k of PLAYTEST_KEYS) {
    if (answers && answers[k] != null) report[k] = whole(answers[k], 0, ranges[k]);
  }
  return report;
}
