// Pure: turns a browser error into the report accepted by public.submit_issue()
// (supabase/migrations/0007_issues.sql; tests/issues.test.mjs checks the match).
import { deviceOf } from './playtest-report.js';

const cut = (s, n) => String(s || '').slice(0, n);

// err: { kind: 'error' | 'rejection', message, file (url), line }; ctx: { state, xr, userAgent }
export function issueReport(err, ctx) {
  const browser = (String(ctx.userAgent || '').match(/(OculusBrowser|Firefox|Edg|Chrome|Safari)\/[\d.]+/) || [''])[0];
  const report = {
    kind: err.kind === 'rejection' ? 'rejection' : 'error',
    message: cut(err.message, 200),
    file: cut(String(err.file || '').split('/').pop().split('?')[0], 60),
    device: deviceOf(ctx.userAgent),
    browser: cut(browser, 40),
    xr: ctx.xr ? 'vr' : 'none'
  };
  if (Number.isFinite(err.line)) report.line = Math.max(0, Math.min(100000, Math.round(err.line)));
  if (['idle', 'intro', 'run', 'questions', 'done'].includes(ctx.state)) report.state = ctx.state;
  return report;
}
