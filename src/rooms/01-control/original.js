// Results of the original and of the replication, shown in the reveal.
// Single place for these numbers; tests/control-protocol.test.mjs guards them.
export const ORIGINAL = Object.freeze({
  // Alloy & Abramson 1979, Exp. 2, Table 5 (p. 459): mean judged control,
  // non-depressed students, n = 8 per cell
  nondepressed: Object.freeze({
    '25-25': Object.freeze({ men: 20.0, women: 7.5 }),
    '75-75': Object.freeze({ men: 30.3, women: 51.4 })
  }),
  perCell: 8,        // p. 458: 8 per sex × mood × problem cell
  // p. 462: percent of non-depressed students who said "zero control" in 75-75 (1 of 16)
  zeroIn7575Pct: 6,
  participants: 64,  // p. 457
  // Dev, Moore, Johnson & Garrett 2022, Table 1: end-of-task control, zero contingency
  replication: Object.freeze({
    year: 2022,
    // people in the two zero-contingency conditions, whose means are shown:
    // Table 1 df + 1 = 83 + 77 (Sample One) + 40 + 42 (Sample Two)
    people: 242,
    '25-25': Object.freeze([18.15, 27.64]),
    '75-75': Object.freeze([34.23, 36.83])
  })
});
