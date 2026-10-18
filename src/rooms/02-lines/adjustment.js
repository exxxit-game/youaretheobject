import { DISPLAY as D } from './protocol.js';
import { T } from './texts.ru.js';
import { FONT } from '../../engine/panel.js';

// Unnumbered direct manipulation. Thumbstick supports fine continuous adjustment;
// a ray/mouse click on the bar provides the coarse position, without exposing true length.
export function createAdjustment(root, { y, z, getValue, change, enabled }) {
  let bar = null, axis = 0, key = 0, last = 0, raf = 0, generation = 0;
  const stick = e => { axis = Math.abs(e.detail.y) > 0.15 ? -e.detail.y : 0; };
  const down = e => {
    if (!enabled() || !['ArrowUp', 'ArrowDown'].includes(e.code)) return;
    e.preventDefault(); key = e.code === 'ArrowUp' ? 1 : -1;
  };
  const up = e => { if (['ArrowUp', 'ArrowDown'].includes(e.code)) key = 0; };
  const reset = () => { key = axis = 0; };
  const paint = () => {
    const p = bar?.components.panel;
    if (!p?.c) return;
    p.write([], { bg: '#292929' });
    const { ctx, c } = p;
    ctx.font = `50px ${FONT}`; ctx.textBaseline = 'top'; ctx.fillStyle = '#dadada';
    ctx.textAlign = 'left'; ctx.fillText(T.shorter, c.width * 0.05, 6);
    ctx.textAlign = 'right'; ctx.fillText(T.longer, c.width * 0.95, 6);
    p.smallest = 50; bar.dataset.letterMm = String(50 / 1280 * 1250);
    ctx.fillStyle = '#777777'; ctx.fillRect(c.width * 0.05, c.height * 0.7, c.width * 0.9, 4);
    ctx.fillStyle = '#e4bc62'; const x = c.width * (0.05 + 0.9 * getValue() / D.maxDeg);
    ctx.fillRect(x - 3, c.height * 0.55, 6, c.height * 0.3); p.tex.needsUpdate = true;
  };
  const frame = now => {
    const ms = last ? Math.min(now - last, 50) : 0; last = now;
    if (enabled() && (axis || key)) { change(getValue() + (axis || key) * D.speedDeg * ms / 1000); paint(); }
    raf = requestAnimationFrame(frame);
  };
  const right = root.sceneEl.querySelector('[laser-controls*="right"]');
  right?.addEventListener('thumbstickmoved', stick);
  window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', reset);
  raf = requestAnimationFrame(frame);
  return {
    reset,
    show() {
      this.hide();
      const active = generation;
      bar = document.createElement('a-entity'); bar.classList.add('clickable'); bar.dataset.adjustment = '';
      bar.setAttribute('panel', 'w: 1.25; h: 0.13; px: 1280; ref: 1280; bg: #292929');
      bar.setAttribute('position', `0 ${y} ${z}`);
      bar.addEventListener('loaded', paint);
      bar.addEventListener('click', e => {
        if (active !== generation || !enabled()) return;
        const uv = e.detail?.intersection?.uv;
        if (!uv) return;
        const value = uv.x <= 0.05 ? D.minDeg : uv.x >= 0.95 ? D.maxDeg : (uv.x - 0.05) / 0.9 * D.maxDeg;
        if (change(value)) paint();
      });
      root.appendChild(bar);
    },
    hide() { generation++; reset(); bar?.remove(); bar = null; },
    dispose() {
      this.hide(); cancelAnimationFrame(raf); right?.removeEventListener('thumbstickmoved', stick);
      window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', reset);
    }
  };
}
