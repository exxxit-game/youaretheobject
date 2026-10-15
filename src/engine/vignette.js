// A dark ring round the view that narrows it while the player moves smoothly: fewer moving
// edges in sight, less sickness (Fernandes & Feiner 2016; Al Zayer et al. CHI 2019). It hangs
// on the camera and is drawn last, over everything; level 0 shows nothing, level 1 leaves only
// minFovDeg of the view clear, its edge feathered.
// const v = createVignette(sceneEl.camera, 50); v.set(level); v.dispose();
// Far from the eyes, so both eyes see the clear circle in the same place: each eye sits about
// 32 mm off the head's centre, which shifts a ring 0.2 m away by about 9° in each eye (the clear
// area the two share would be narrower than minFovDeg), and one 10 m away by under 0.2°. Drawn
// without depth, it still covers everything nearer.
export const DIST = 10; // metres in front of the head
// the plane reaches tan 5 (about 79°) from the centre, past the view's corner: Quest 3 sees 110° ×
// 96° (Meta, "Compare headsets"), its corner about 61° off the centre (atan of tan 55° and tan 48°)
const REACH = 5;
const FEATHER = 0.6;    // the soft edge, in tangent units

export function createVignette(camera, minFovDeg) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { level: { value: 0 }, inner: { value: Math.tan(THREE.MathUtils.degToRad(minFovDeg / 2)) } },
    // p: the tangent of the angle from the view's centre
    vertexShader: `varying vec2 p; void main() { p = position.xy / ${DIST.toFixed(1)}; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    // the clear circle shrinks from beyond the view (level 0) to minFovDeg (level 1)
    fragmentShader: `uniform float level; uniform float inner; varying vec2 p;
      void main() {
        float edge = mix(${(REACH + 1).toFixed(1)}, inner, level);
        gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(edge, edge + ${FEATHER.toFixed(2)}, length(p)));
      }`
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * REACH * DIST, 2 * REACH * DIST), material);
  mesh.position.z = -DIST;
  mesh.renderOrder = 1000;
  mesh.frustumCulled = false;
  mesh.visible = false;
  camera.add(mesh);
  return {
    set(level) {
      material.uniforms.level.value = level;
      mesh.visible = level > 0.001;
    },
    dispose() {
      camera.remove(mesh);
      mesh.geometry.dispose();
      material.dispose();
    }
  };
}
