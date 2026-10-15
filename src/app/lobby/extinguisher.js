import { CHROME } from '../../engine/door.js';

// The corridor's fire extinguisher and its wall hanger (scene.js puts it opposite the board).
const METAL = `material="color: ${CHROME.color}; metalness: ${CHROME.metalness}; roughness: ${CHROME.roughness}"`;
// polished stainless and chrome, as on the General WS-900, mirroring the corridor round it
// (reflect-env, src/engine/reflect-env.js); left out of the corridor's merge (data-dynamic) and
// merged on its own, so its steel parts are one mesh with the mirrored picture
const STEEL = 'material="color: #eef0f2; metalness: 1; roughness: .12"';
const CHROME_SHAPE = 'color: #eef0f2; metalness: 1; roughness: .12';
const BRASS = 'material="color: #b08d4a; metalness: 1; roughness: .3"';
// A 2.5 gal stored-pressure water extinguisher, the General WS-900 of 1970 as a seller photographed
// one whole (a flea-market listing: 19 photos, 62.2 cm tall, 18.3 cm across; docs/research/vr/07-corridor-
// 1979.md). Every height below is read off its straight-on photos in parts of the shell's 7 in
// diameter (S23): a foot ring, the straight shell 2.5 diameters tall with a seam band at its top and
// one 5 cm over its bottom (photos 7, 10), a high round top 0.41 of the diameter, then the neck, a hex
// collar, the cast valve body and on it the squeeze lever, 0.62 m in all. On the wall whose face is
// at z = wall, facing -z; top at most 1.524 m, bottom at least 0.102 m (tests/standards.test.mjs). As
// in its photos 3 and 18: the gauge on the valve's front, its dial set back in a raised chrome lip
// (extinguisher-label.js); the lever and below it the carry handle to the right as seen from the
// corridor, both curved castings with turned-down ends; on the valve's back, facing the wall, the
// ring pin through its cast lugs 10 mm from the axis and the fill valve, the ring's chain between
// them (photos 6, 9); the hose's brass coupling on the left, the brown hose down the left side to its
// short brass tip held in a square steel clip on the shell's side 6 cm over its bottom (photos 3, 7,
// 14, 18; the black slotted tube of photo 17 is the siphon inside); the label round the front
// (extinguisher-label.js). How thick the lever and handle are across is not in a photo: our
// estimate. Every part touches the one it is fixed to.
// It hangs as 2.5 gal water units did: a flat J hook on the wall (Amerex's bracket chart gives its
// 2.5 gal water unit the flat hook 01007; Sylprotec's hook for "2.5 gal water" units, 1.5 x 3 x 3 in,
// goes up through a slotted lug on the shell's top back) through a rectangular steel loop standing out
// from the back of the shell at the foot of its dome (photo 16). The loop: w across, d out from the
// shell, of round rod of radius rod (flat bars on the hook's flat plate would lie under 5 mm apart and
// flicker: tests/near-faces.mjs), y its middle. The hook: a strap w wide and h tall on the wall,
// bent out under the loop's far bar and up inside the loop as its lip, t thick; how big the WS-900's
// own loop and bracket (MB-100, photos 4 and 13) were no source gives: sized to the photo and to
// Sylprotec's hook.
const EXT = { r: 0.089, foot: 0.853, footH: 0.018, shell: 0.445, dome: 0.073, neck: 0.012, collar: 0.019, body: 0.043 };
const EXT_Y = (() => {
  const shellTop = EXT.foot + EXT.footH + EXT.shell, domeTop = shellTop + EXT.dome;
  return { shellTop, domeTop, neckTop: domeTop + EXT.neck, collarTop: domeTop + EXT.neck + EXT.collar, bodyTop: domeTop + EXT.neck + EXT.collar + EXT.body };
})();
const LUG = { w: 0.046, d: 0.022, rod: 0.003, y: EXT_Y.shellTop + 0.008 };
const HOOK = { w: 0.032, h: 0.076, t: 0.003, lip: 0.016 };
// the nozzle's clip, a square steel box on the shell's left side (+x) across the seam 5 cm over the
// bottom, from 4.5 to 7 cm (photos 3, 7, 18): sticking out d, h tall; the hose's tip runs down its
// middle, x from the axis, and ends inside it
const CLIP = { d: 0.02, h: 0.025, top: EXT.foot + 0.07, x: EXT.r + 0.011 };
// the lever and the handle, side views in metres from the valve's axis and its top, read off photos
// 6 and 9: the lever pivots on the valve's cast ears behind its top and lies on the top (photo 5),
// falling to its turned-down thumb end; the handle leaves the valve's side lower and curves down to
// its own turned-down end, 12-17 mm under the collar's top (photos 3, 6, 19)
// the lever's arm, from inside its head out to the turned-down thumb end
const LEVER = '-0.008 0.0156, -0.030 0.013, -0.065 0.008, -0.076 0.004, -0.081 -0.005, -0.076 -0.007, -0.068 0.000, -0.030 0.002, -0.008 0.000';
// the lever's head: one rounded casting as wide as the valve (photos 5, 6, 9). Its top is the lever's own
// curved top at full width, its end over the hose curves down to the rivet, and each side wall, 3 mm
// thick just clear of the valve's widest radius (19 mm, the lathe below), has its lower edge rising
// toward the grip, so the ring pin enters under it and the ring hangs free; flat boxes read as square
const CAP = { wall: 0.019 + 0.0015 };
const HEAD = '0.022 -0.004, 0.022 0.006, 0.010 0.017, -0.012 0.0148, -0.012 0.000, 0.012 0.000, 0.016 -0.002';
const WALL = '0.023 -0.004, 0.022 0.006, 0.010 0.017, -0.012 0.0148, -0.012 -0.003, 0.004 -0.008, 0.016 -0.012, 0.021 -0.010';
const HANDLE = '-0.014 -0.012, -0.050 -0.016, -0.088 -0.027, -0.111 -0.043, -0.120 -0.054, -0.114 -0.058, -0.101 -0.046, -0.079 -0.034, -0.047 -0.027, -0.016 -0.025';
export function extinguisher(x, wall) {
  const z = wall - 0.03 - EXT.r, Y = EXT_Y, f = (v) => v.toFixed(4);
  // the gauge stands on its own short stem in front of the lever's head, its bezel clear of the head's
  // front wall (photos 5, 8)
  const gaugeY = Y.bodyTop - 0.021, gaugeZ = z - CAP.wall - 0.002;
  // the top loop sits on the dome's back, where the dome's surface is at its height
  const back = z + EXT.r * Math.sqrt(1 - ((LUG.y - Y.shellTop) / EXT.dome) ** 2);
  // a loop on the shell's back at height y (its back there at z = at) and its wall hook: the steel strap
  // screwed to the wall, bent out under the loop's far bar and up inside the loop as its lip, so the
  // extinguisher lifts off it
  const hang = (y, at) => {
    const farZ = at + LUG.d - LUG.rod, lip = at + LUG.d / 2 - LUG.rod, low = y - LUG.rod - HOOK.t;
    return `
      <a-box class="hanger" decal position="${x} ${f(low + HOOK.h / 2)} ${f(wall - HOOK.t / 2)}" width="${HOOK.w}" height="${HOOK.h}" depth="${HOOK.t}" color="#2b2b2b"></a-box>
      ${[0.025, 0.06].map((dy) => `<a-cylinder position="${x} ${f(low + dy)} ${f(wall - 0.004)}" radius="0.005" height="0.003" rotation="90 0 0" decal="layer: 2" ${METAL}></a-cylinder>`).join('')}
      <a-box class="hanger" position="${x} ${f(low + HOOK.t / 2)} ${f((lip - HOOK.t / 2 + wall - HOOK.t) / 2)}" width="${HOOK.w}" height="${HOOK.t}" depth="${f(wall - HOOK.t - lip + HOOK.t / 2)}" color="#2b2b2b"></a-box>
      <a-box class="hanger" position="${x} ${f(low + HOOK.lip / 2)} ${f(lip)}" width="${HOOK.w}" height="${HOOK.lip}" depth="${HOOK.t}" color="#2b2b2b"></a-box>
      ${[-1, 1].map((s) => `<a-cylinder class="lug" position="${f(x + s * (LUG.w / 2 - LUG.rod))} ${f(y)} ${f(at + (LUG.d - 0.003) / 2)}" radius="${LUG.rod}" height="${LUG.d + 0.003}" rotation="90 0 0" ${STEEL}></a-cylinder>`).join('')}
      <a-cylinder class="lug" position="${x} ${f(y)} ${f(farZ)}" radius="${LUG.rod}" height="${LUG.w}" rotation="0 0 90" ${STEEL}></a-cylinder>`;
  };
  return `
    <a-entity class="extinguisher" data-dynamic merge-static reflect-env>
      <!-- hung as photo 16 shows, by a loop on the dome's back on a wall hook; the same loop and hook again
           low on the shell's back, so the foot is held off the wall as the top is (the owner in the headset:
           one hook at the top left the bottom in the air) -->
      ${hang(LUG.y, back)}
      ${hang(EXT.foot + 0.1, z + EXT.r)}
      <!-- the shell: foot ring, straight shell, the seam bands at its foot and its top, the high round top -->
      <a-cylinder position="${x} ${f(EXT.foot + EXT.footH / 2)} ${z}" radius="${EXT.r + 0.0005}" height="${EXT.footH}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(EXT.foot + EXT.footH + EXT.shell / 2)} ${z}" radius="${EXT.r}" height="${EXT.shell}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(EXT.foot + 0.05)} ${z}" radius="${EXT.r + 0.0008}" height="0.003" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(Y.shellTop)} ${z}" radius="${EXT.r + 0.0015}" height="0.006" ${STEEL}></a-cylinder>
      <a-sphere position="${x} ${f(Y.shellTop)} ${z}" radius="${EXT.r}" scale="1 ${f(EXT.dome / EXT.r)} 1" ${STEEL}></a-sphere>
      <!-- the label, as on the 1972 model: about 98 degrees round the front (painted by
           extinguisher-label.js) -->
      <a-cylinder id="extLabel" data-dynamic decal position="${x} 1.121 ${z}" radius="${EXT.r}" height="0.254" open-ended="true" theta-start="131" theta-length="98" material="roughness: 0.6"></a-cylinder>
      <!-- the neck, the hex collar, the cast valve body -->
      <a-cylinder position="${x} ${f(Y.domeTop + EXT.neck / 2 - 0.004)} ${z}" radius="0.022" height="${EXT.neck + 0.008}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(Y.neckTop + EXT.collar / 2)} ${z}" radius="0.026" height="${EXT.collar}" segments-radial="6" ${STEEL}></a-cylinder>
      <a-entity position="${x} ${f(Y.collarTop)} ${z}" lathe="points: 0 0, 0.019 0, 0.019 0.03, 0.017 0.038, 0.012 0.043, 0 0.043; ${CHROME_SHAPE}"></a-entity>
      <!-- the gauge on the valve's front: a chrome bezel, its raised lip round the dial set back in it
           (photos 5, 8) -->
      <a-cylinder position="${x} ${f(gaugeY)} ${f((gaugeZ + z - 0.015) / 2)}" radius="0.006" height="${f(z - 0.015 - gaugeZ + 0.001)}" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(gaugeY)} ${f(gaugeZ - 0.005)}" radius="0.0235" height="0.010" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-torus position="${x} ${f(gaugeY)} ${f(gaugeZ - 0.0121)}" radius="0.0215" radius-tubular="0.0011" segments-tubular="48" ${STEEL}></a-torus>
      <a-circle id="extGauge" data-dynamic decal position="${x} ${f(gaugeY)} ${f(gaugeZ - 0.0101)}" radius="0.0205" rotation="0 180 0" segments="48" material="roughness: 0.5"></a-circle>
      <!-- the squeeze lever lying on the valve's top, its head a cap over the top whose side walls come
           down the valve's sides, the pivot's rivet through them behind (photos 5, 9); the carry handle
           under it -->
      <a-entity position="${x} ${f(Y.bodyTop)} ${z}" outline="points: ${LEVER}; depth: 0.016; bevel: 0.002; ${CHROME_SHAPE}"></a-entity>
      <a-entity position="${x} ${f(Y.bodyTop)} ${z}" outline="points: ${HANDLE}; depth: 0.014; bevel: 0.002; ${CHROME_SHAPE}"></a-entity>
      <a-entity position="${x} ${f(Y.bodyTop)} ${z}" outline="points: ${HEAD}; depth: ${f(2 * CAP.wall + 0.003)}; bevel: 0.002; ${CHROME_SHAPE}"></a-entity>
      ${[-1, 1].map((s) => `<a-entity position="${x} ${f(Y.bodyTop)} ${f(z + s * CAP.wall)}" outline="points: ${WALL}; depth: 0.003; bevel: 0.001; ${CHROME_SHAPE}"></a-entity>`).join('')}
      <a-cylinder position="${x + 0.016} ${f(Y.bodyTop + 0.002)} ${z}" radius="0.0035" height="${f(2 * CAP.wall + 0.006)}" rotation="90 0 0" ${STEEL}></a-cylinder>
      <!-- on the valve's back: the ring pin through its lugs and the ring hanging from it, the fill
           valve's knurled brass cap on its hex fitting below, the ring's chain to it; the ring's wire
           1.3 mm in radius (A-Frame draws twice radius-tubular) -->
      <a-cylinder position="${f(x - 0.011)} ${f(Y.bodyTop - 0.008)} ${f(z + 0.007)}" radius="0.0016" height="0.026" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-torus position="${f(x - 0.013)} ${f(Y.collarTop + 0.025)} ${f(z + 0.021)}" radius="0.0105" radius-tubular="0.00065" ${STEEL}></a-torus>
      <a-cylinder position="${f(x - 0.002)} ${f(Y.collarTop + 0.010)} ${f(z + 0.0205)}" radius="0.0055" height="0.006" segments-radial="6" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-cylinder position="${f(x - 0.002)} ${f(Y.collarTop + 0.010)} ${f(z + 0.0285)}" radius="0.0045" height="0.010" rotation="90 0 0" ${BRASS}></a-cylinder>
      <a-entity cable="radius: 0.0007; color: #9a9ca0; points: ${f(x - 0.013)} ${f(Y.collarTop + 0.0132)} ${f(z + 0.021)}, ${f(x - 0.008)} ${f(Y.collarTop + 0.006)} ${f(z + 0.026)}, ${f(x - 0.002)} ${f(Y.collarTop + 0.0055)} ${f(z + 0.03)}"></a-entity>
      <!-- the hose, 12 mm thick: its coupling on the valve's left, a brass ferrule fatter than the hose
           at each end (photos 5, 9, 14), down the left side 1.6-1.9 cm off the shell (photos 3, 18)
           to its short brass tip, ending inside the steel clip -->
      <a-cylinder position="${f(x + 0.025)} ${f(Y.collarTop + 0.022)} ${z}" radius="0.008" height="0.012" rotation="0 0 90" ${STEEL}></a-cylinder>
      <a-cylinder position="${f(x + 0.039)} ${f(Y.collarTop + 0.022)} ${z}" radius="0.0075" height="0.018" rotation="0 0 90" ${BRASS}></a-cylinder>
      <a-entity cable="radius: 0.006; color: #4f3f31; points: ${f(x + 0.047)} ${f(Y.collarTop + 0.022)} ${z}, ${f(x + 0.08)} ${f(Y.collarTop + 0.008)} ${f(z - 0.002)}, ${f(x + 0.112)} 1.36 ${f(z - 0.003)}, ${f(x + 0.113)} 1.12 ${f(z - 0.002)}, ${f(x + 0.108)} 1.0 ${f(z - 0.001)}, ${f(x + CLIP.x)} ${f(CLIP.top + 0.014)} ${z}"></a-entity>
      <a-cylinder position="${f(x + CLIP.x)} ${f(CLIP.top + 0.007)} ${z}" radius="0.0075" height="0.014" ${BRASS}></a-cylinder>
      <a-cylinder position="${f(x + CLIP.x)} ${f(CLIP.top - 0.01)} ${z}" radius="0.0045" height="0.02" ${BRASS}></a-cylinder>
      <a-box position="${f(x + EXT.r + CLIP.d / 2)} ${f(CLIP.top - CLIP.h / 2)} ${z}" width="${CLIP.d}" height="${CLIP.h}" depth="0.018" ${STEEL}></a-box>
    </a-entity>`;
}
