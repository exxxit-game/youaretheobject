// Readiness/flow check on the Quest's currently loaded preview, never a laptop browser.
// An automated pass is allowed only off-head, with frames already being drawn.
// It never overrides proximity, enters VR, navigates, restarts, or wakes the device.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, takenOff } from './headset.mjs';
import { requireReview, requirePaper } from './review-gate.mjs';

export async function checkLines() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  requireReview(root, 'check first trial on Quest', { look: true });
  requirePaper(root, 'check first trial on Quest', { look: true });
  const play = process.argv.includes('--play');
  if (play && !takenOff()) throw new Error('Automated inputs require confirmed off-head state');
  const game = await page(/localhost:3000|object-preview/);
  if (!game) throw new Error('No prepared Quest game tab');
  try {
    const info = await game.run(`({url:location.href, preview:document.documentElement.dataset.preview,
      ready:!!document.querySelector('#linesScreen')?.components?.panel,
      state:document.documentElement.dataset.roomState,
      visibility:document.visibilityState})`, false);
    if (!info.ready || info.preview !== 'true' || new URL(info.url).searchParams.get('trial') !== '1') throw new Error('Expected the prepared preview trial');
    console.log('Quest trial loaded:', JSON.stringify(info));
    if (!play) { console.log('Readiness only: no playthrough or VR comfort claim'); return; }
    const result = await game.run(`(async()=>{
      const wait=ms=>new Promise(r=>setTimeout(r,ms));
      await Promise.race([new Promise(resolve=>requestAnimationFrame(resolve)),wait(2000).then(()=>{throw Error('Quest is not drawing frames; no input sent');})]);
      const until=async fn=>{const end=Date.now()+12000;while(!fn()){if(Date.now()>end)throw Error('Quest step timeout');await wait(100);}};
      const state=s=>until(()=>document.documentElement.dataset.roomState===s);
      const pick=async i=>{const sel='#linesDisplay .answer[data-index="'+i+'"][data-ready="1"]';
        await until(()=>document.querySelector(sel));document.querySelector(sel).emit('click');await wait(400);};
      const room=await import('./src/rooms/02-lines/room.js');room.enter(false);
      await state('intro');await pick(0);await state('instructions');await pick(0);await state('practice');await pick(0);
      await state('adjust');
      const right=document.querySelector('[laser-controls*="right"]');
      const screen=document.querySelector('#linesScreen').components.panel;
      const before=screen.c.toDataURL();right.emit('thumbstickmoved',{x:0,y:-0.5});await wait(500);right.emit('thumbstickmoved',{x:0,y:0});
      if(before===screen.c.toDataURL())throw Error('Controller event did not change the line');
      room.hold(true);room.hold(false);await state('interrupted');await pick(0);await state('adjust');
      await pick(0);await pick(0);await state('ready');await pick(0);
      for(let i=0;i<4;i++)await pick(0);
      await state('feedback');await pick(0);await state('done');
      await pick(0);await pick(0);await pick(0);await pick(1);await pick(0);await pick(0);await pick(2);
      await pick(1);await state('done');await pick(2);await pick(0);await state('intro');
      return {flow:true,syntheticControllerEvent:true,paused:true,reveal:true,restarted:true};
    })()`, true);
    if (result?.error || result?.flow !== true) throw new Error(JSON.stringify(result));
    console.log('PASS bounded Quest browser flow', JSON.stringify(result));
    console.log('Synthetic inputs: owner controller handling, VR readability and performance remain separate checks');
  } finally { game.close(); }
}
