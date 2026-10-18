// Readiness of the prepared viewing preview; no wake, navigation, input or proximity override.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './headset.mjs';
import { requireReview, requirePaper } from './review-gate.mjs';
export async function checkChange() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  requireReview(root, 'check second viewing preview on Quest', { look: true });
  requirePaper(root, 'check second viewing preview on Quest', { look: true });
  const game = await page(/localhost:3000|object-preview/);
  if (!game) throw new Error('No prepared Quest game tab');
  try {
    const info = await game.run(`(()=>{
      const scene=document.querySelector('a-scene'), world=document.querySelector('#changeWorld');
      return {url:location.href,preview:document.documentElement.dataset.preview,
        state:document.documentElement.dataset.roomState,ready:!!document.querySelector('#changeScreen')?.components?.panel,
        scale:world?.object3D.scale.toArray(),offset:world?.object3D.position.toArray(),
        grain:!!scene?.camera?.getObjectByName('changeGrain'),black:!!scene?.camera?.getObjectByName('changeBlack')};
    })()`, false);
    if (!info.ready || info.preview !== 'true' || !info.grain || !info.black ||
        new URL(info.url).searchParams.get('room') !== '03-change' ||
        new URL(info.url).searchParams.get('trial') !== '1') throw new Error(JSON.stringify(info));
    console.log('PASS second preview readiness', JSON.stringify(info));
    console.log('Readiness only: no playthrough, stereo comfort or timing certification');
  } finally { game.close(); }
}
