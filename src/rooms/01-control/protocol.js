// Every number of the procedure, from Alloy & Abramson (1979), Experiment 2.
// Journal page in each comment. docs/rooms/01-control.md explains the choices
// marked "not in the paper"; tests/control-protocol.test.mjs guards the values.
export const PROTOCOL = Object.freeze({
  trials: 40,                 // p. 451
  windowSecs: 3,              // p. 451: press within 3 s of the yellow light
  intervalMinSecs: 10,        // p. 451: intertrial interval 10–25 s, mean 14 s
  intervalMaxSecs: 25,
  intervalMeanSecs: 14,
  conditions: Object.freeze({ // pp. 457–458: green on 25% or 75% of trials, press or not
    '25-25': Object.freeze({ press: 0.25, noPress: 0.25 }),
    '75-75': Object.freeze({ press: 0.75, noPress: 0.75 })
  }),
  scaleStep: 5,               // p. 451: scales marked in units of five, 0 to 100
  greenSecs: 2,               // not in the paper
  tapeBlock: 4                // not in the paper: green count exact within each block of 4
});
