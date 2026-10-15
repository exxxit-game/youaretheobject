import { FONT } from './panel.js';

// A back-lit sign whose words each have their own lamp (a light box with a compartment
// per word, or neon with a transformer per word), so one word can flicker or go dark
// while the rest stay lit. Draws on the entity's panel canvas; tick-driven, so it plays
// in a headset (CSS and requestAnimationFrame do not run there). An optional light
// follows the sign's mean brightness. Keep every pattern under the flash rule
// (WCAG 2.3.1: tests/glow.test.mjs).
// <a-entity panel="w: 0.9; h: 0.2; px: 1024" lightbox="light: #signLight; lightMax: 0.7"></a-entity>
// box.show(words, style); box.run(keys) → Promise at the last key. keys: [t, levels, cue]
// with one level (0..1) per word, changing linearly between keys; 'lamp-cue' is emitted
// with the cue when a key that has one is passed (a starter switching, a hum fading).
AFRAME.registerComponent('lightbox', {
  dependencies: ['panel'],
  schema: {
    light: { type: 'selector' },
    lightMax: { default: 1 },
    level: { default: 0.04 }   // every lamp before run()
  },

  init() {
    this.keys = null;
    this.words = [];
    this.levels = [];
  },

  // style: { size, weight, spacing, pad (canvas px), bg, on (lit ink), off (unlit ink) }
  show(words, style) {
    this.words = words;
    this.style = style;
    this.levels = words.map(() => this.data.level);
    this.draw();
  },

  draw() {
    const { ctx, c, tex } = this.el.components.panel;
    const s = this.style;
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.letterSpacing = `${s.spacing}px`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';   // words are laid one after another (panel.write may leave 'center')
    let size = s.size;
    ctx.font = `${s.weight} ${size}px ${FONT}`;
    const whole = ctx.measureText(this.words.join('')).width;
    if (whole > c.width - 2 * s.pad) {
      size *= (c.width - 2 * s.pad) / whole;
      ctx.font = `${s.weight} ${size}px ${FONT}`;
    }
    let x = (c.width - ctx.measureText(this.words.join('')).width) / 2;
    let lit = 0, letters = 0;
    this.words.forEach((word, i) => {
      ctx.fillStyle = mix(s.off, s.on, this.levels[i]);
      ctx.fillText(word, x, c.height / 2);
      x += ctx.measureText(word).width;
      lit += this.levels[i] * word.length;
      letters += word.length;
    });
    tex.needsUpdate = true;
    if (this.data.light) this.data.light.setAttribute('light', 'intensity', this.data.lightMax * lit / letters);
  },

  // not play(): A-Frame calls play() and pause() itself when an entity starts and stops
  run(keys) {
    this.keys = keys;
    this.started = null;
    this.next = 1;
    return new Promise((resolve) => { this.done = resolve; });
  },

  tick(t) {
    const k = this.keys;
    if (!k) return;
    if (this.started === null) this.started = t;
    const s = (t - this.started) / 1000;
    while (this.next < k.length && s >= k[this.next][0]) {
      if (k[this.next][2]) this.el.emit('lamp-cue', k[this.next][2], false);
      this.next++;
    }
    let levels;
    if (this.next >= k.length) levels = k[k.length - 1][1];
    else {
      const [t0, a] = k[this.next - 1], [t1, b] = k[this.next];
      const f = t1 > t0 ? (s - t0) / (t1 - t0) : 1;
      levels = a.map((v, i) => v + (b[i] - v) * f);
    }
    if (levels.some((v, i) => Math.abs(v - this.levels[i]) > 0.004)) {
      this.levels = levels;
      this.draw();
    }
    if (this.next >= k.length) { this.keys = null; this.done(); }
  }
});

// '#rrggbb' colours mixed: f = 0 gives a, 1 gives b
function mix(a, b, f) {
  const ch = (h, i) => parseInt(h.slice(1 + 2 * i, 3 + 2 * i), 16);
  const v = [0, 1, 2].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * Math.min(1, Math.max(0, f))));
  return `rgb(${v.join(',')})`;
}
