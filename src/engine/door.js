// Every doorway of the lab, built by this one function so no two doors differ: a 3'0" × 7'0"
// leaf (0.914 × 2.134 m, 1-3/4 in thick) in a hollow metal frame with a 2 in face through the
// 0.2 m block wall, stops on the push side hiding the 1/8 in gaps, a 1/2 in aluminium threshold,
// a kick plate 10 × 34 in on the push side (docs/building-standards.md, S2–S6), and round knobs as
// in 1979 (Schlage A Series Plymouth: 2 1/8 in wide, 2 5/16 in projection, rose 2 9/16 in; levers
// came to Schlage's commercial locks only in 1983 and 1989: docs/research/vr/07-corridor-1979.md)
// at the strike height 40 5/16 in, 2 3/4 in from the latch edge. The leaf swings into the room, so
// the corridor is its push side; hinges and closer are on the room side.
// x: centre of the 1.0 m masonry opening; room, corridor: z of the wall's two faces (a door on
// either long wall: the room on the far side); latch: +1 right or -1 left, seen from the corridor; leaf: attributes of the
// leaf's group (its hinge edge is its origin, so it can swing); clickable: the leaf answers the
// laser; inside: the room-side hardware too, for a door whose room the player enters; sign: { attrs,
// y } a flat sign centred on the leaf's corridor face at height y, moving with the leaf.
// doorHTML({ x: 0.7, latch: 1, leaf: 'id="door1" data-dynamic', clickable: true, inside: true })
const FRAME = 'color="#3d3a34"';
// satin chrome for all hardware (our choice of look): matte enough to read in a dim corridor,
// where a mirror finish has nothing to mirror and turns dark
export const CHROME = { color: '#cfd2d5', metalness: 0.35, roughness: 0.3 };
const PLATE = 'material="color: #b9bcbe; metalness: .7; roughness: .3"';
const HINGE = 'material="color: #9a9c9e; metalness: .7; roughness: .35"';
export const LEAF = { w: 0.914, h: 2.134, t: 0.045 };
const OPENING = 1.0;
// a sign stands this far off the leaf: two faces closer than 5 mm flicker in a headset, worst at the
// far end of the corridor (docs/vr-checklist.md)
export const SIGN_GAP = 0.006;
// a Plymouth knob turned about its axis, from the door face out: rose, shank, knob
const KNOB = 'points: 0.0325 0, 0.0325 0.004, 0.03 0.008, 0.012 0.009, 0.011 0.026, 0.019 0.031, 0.026 0.04, 0.027 0.047, 0.024 0.054, 0.015 0.058, 0 0.0587';

const f = (v) => +v.toFixed(4);

export function doorHTML({ x, room = 1.6, corridor = 1.8, latch = 1, leaf = '', clickable = false, inside = false, sign = null }) {
  const s = Math.sign(corridor - room);      // +1: the room at smaller z (north wall), -1: at larger z
  const mid = f((room + corridor) / 2), depth = f(Math.abs(corridor - room) + 0.02);
  const jamb = OPENING / 2 - 0.0143;          // a jamb's centre, 14.3 mm inside the opening's edge
  const stop = OPENING / 2 - 0.0478;
  const side = latch * s;                     // the latch along +x (seen from the corridor, right is -x on the south wall)
  const hinge = f(x - side * LEAF.w / 2);     // the leaf's hinge edge
  const lx = (v) => f(side * v);              // leaf-local x, mirrored for a latch along -x
  const lz = (v) => f(s * v);                 // leaf-local z, toward the corridor
  // a leaf that swings is left out of the room's merge (data-dynamic): its parts swing together,
  // so they are merged on the leaf itself
  const moves = /\bdata-dynamic\b/.test(leaf);
  const knob = (z, out) => `<a-entity class="knob" lathe="${KNOB}; color: ${CHROME.color}; metalness: ${CHROME.metalness}; roughness: ${CHROME.roughness}" rotation="${out === s > 0 ? 90 : -90} 0 0" position="${lx(LEAF.w - 0.07)} 1.024 ${lz(z)}"></a-entity>`;
  const roomSide = inside ? `
      ${knob(0, false)}
      <a-cylinder radius="0.007" height="0.114" position="${lx(-0.0016)} 1.8482 ${lz(-0.004)}" ${HINGE}></a-cylinder>
      <a-cylinder radius="0.007" height="0.114" position="${lx(-0.0016)} 1.0276 ${lz(-0.004)}" ${HINGE}></a-cylinder>
      <a-cylinder radius="0.007" height="0.114" position="${lx(-0.0016)} 0.207 ${lz(-0.004)}" ${HINGE}></a-cylinder>
      <a-box position="${lx(0.22)} 2.09 ${lz(-0.032)}" width="0.28" height="0.055" depth="0.06" color="#5b5d60"></a-box>
      <a-box position="${lx(0.33)} 2.13 ${lz(-0.045)}" width="0.22" height="0.012" depth="0.012" color="#5b5d60"></a-box>` : '';
  return `
    <a-box position="${f(x - jamb)} 1.1021 ${mid}" width="0.051" height="2.2042" depth="${depth}" ${FRAME}></a-box>
    <a-box position="${f(x + jamb)} 1.1021 ${mid}" width="0.051" height="2.2042" depth="${depth}" ${FRAME}></a-box>
    <a-box position="${f(x)} 2.1787 ${mid}" width="1.0224" height="0.051" depth="${depth}" ${FRAME}></a-box>
    <a-box position="${f(x - stop)} 1.0766 ${f(room + s * 0.063)}" width="0.016" height="2.1532" depth="0.016" ${FRAME}></a-box>
    <a-box position="${f(x + stop)} 1.0766 ${f(room + s * 0.063)}" width="0.016" height="2.1532" depth="0.016" ${FRAME}></a-box>
    <a-box position="${f(x)} 2.1452 ${f(room + s * 0.063)}" width="0.9204" height="0.016" depth="0.016" ${FRAME}></a-box>
    <a-box position="${f(x)} 0.0065 ${f(room + s * 0.0325)}" width="0.9204" height="0.013" depth="0.127" material="color: #9a9c9e; metalness: .6; roughness: .4"></a-box>
    <a-entity ${leaf}${moves ? ' merge-static' : ''} position="${hinge} 0 ${f(room + s * 0.01)}">
      <a-entity class="door-leaf${clickable ? ' clickable' : ''}" rounded-box="width: ${LEAF.w}; height: ${LEAF.h}; depth: ${LEAF.t}; radius: 0.004; color: #6a5641; roughness: 0.55"
                position="${lx(LEAF.w / 2)} 1.083 ${lz(LEAF.t / 2)}"></a-entity>
      <a-box decal position="${lx(LEAF.w / 2)} 0.143 ${lz(LEAF.t + 0.00075)}" width="0.864" height="0.254" depth="0.0015" ${PLATE}></a-box>
      ${knob(LEAF.t, true)}${roomSide}${sign ? `
      <a-entity ${sign.attrs}${s < 0 ? ' rotation="0 180 0"' : ''} position="${lx(LEAF.w / 2)} ${sign.y} ${lz(LEAF.t + SIGN_GAP)}"></a-entity>` : ''}
    </a-entity>`;
}
