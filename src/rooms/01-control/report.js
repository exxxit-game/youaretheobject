// Turns the event log of one run into the measures of Alloy & Abramson (1979).
// Pure: no DOM, no texts. Event kinds written by the room:
//   'trial'  v = { n, press, green }   one completed trial (n from 1)
//   'void'   v = n                     trial interrupted (headset menu, hidden tab)
//   'stray'                            a press outside the 3 s window
//   'answer' v = { key, value }        one answer after the trials

const pct = (part, whole) => (whole ? Math.round((part / whole) * 1000) / 10 : null);
const diff = (judged, actual) => (judged == null || actual == null ? null : Math.round((judged - actual) * 10) / 10);

export function analyse(log) {
  const trials = log.filter(e => e.k === 'trial').map(e => e.v);
  const pressed = trials.filter(t => t.press);
  const notPressed = trials.filter(t => !t.press);
  const greens = trials.filter(t => t.green).length;
  const greenIfPress = pressed.filter(t => t.green).length;
  const greenIfNoPress = notPressed.filter(t => t.green).length;

  const answers = {};
  for (const e of log) if (e.k === 'answer') answers[e.v.key] = e.v.value;

  const ifPress = pct(greenIfPress, pressed.length);
  const ifNoPress = pct(greenIfNoPress, notPressed.length);
  const total = pct(greens, trials.length);
  return {
    trials: trials.length,
    presses: pressed.length,
    greens,
    greenIfPress,
    greenIfNoPress,
    // actual percentages of green light (p. 450: the raw data needed to judge control)
    total,
    ifPress,
    ifNoPress,
    // actual control in percentage points: P(green | press) − P(green | no press)
    actualControl: ifPress == null || ifNoPress == null ? null : Math.round((ifPress - ifNoPress) * 10) / 10,
    // Ward & Jenkins heuristics used in the paper (p. 450). "Percentage of successes"
    // is worded as green on press trials; p. 456 reads it closer to press-and-green
    // over all trials, so both are kept.
    successes: ifPress,
    successesOfAll: pct(greenIfPress, trials.length),
    confirming: greenIfPress + (notPressed.length - greenIfNoPress),
    voided: log.filter(e => e.k === 'void').length,
    strays: log.filter(e => e.k === 'stray').length,
    answers,
    // judged minus actual, as in Figure 5 (p. 460)
    errTotal: diff(answers.total, total),
    errIfPress: diff(answers.ifPress, ifPress),
    errIfNoPress: diff(answers.ifNoPress, ifNoPress)
  };
}
