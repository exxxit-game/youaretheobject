import { effectTransform } from './transform.js';

// Preview rendering; the noise overlay is not a calibrated Unity Post Processing Stack port.
export function createEffects(world, camera, height) {
  const object = world.object3D;
  const position = object.position.clone(), scale = object.scale.clone(), rotation = object.quaternion.clone();
  const geometry = new THREE.SphereGeometry(0.22, 16, 12);
  const noise = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false,
    side: THREE.BackSide, uniforms: { amount: { value: 0 }, frame: { value: 0 } },
    vertexShader: 'void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `precision highp float; uniform float amount; uniform float frame;
      void main(){vec2 p=floor(gl_FragCoord.xy/3.);float n=fract(sin(dot(p,vec2(12.9898,78.233))+frame)*43758.5453);
      gl_FragColor=vec4(vec3(n),amount);}` });
  const grain = new THREE.Mesh(geometry, noise); grain.name = 'changeGrain'; grain.renderOrder = 9997; grain.visible = false;
  const blackMaterial = new THREE.MeshBasicMaterial({ color: 0, side: THREE.BackSide,
    depthTest: false, depthWrite: false });
  const black = new THREE.Mesh(geometry, blackMaterial); black.name = 'changeBlack'; black.renderOrder = 10000; black.visible = false;
  camera.add(grain, black);
  const reset = () => {
    object.position.copy(position); object.scale.copy(scale); object.quaternion.copy(rotation);
    grain.visible = false; black.visible = false; noise.uniforms.amount.value = 0;
  };
  return {
    reset,
    apply(aspect, strength) {
      reset(); const effect = effectTransform(aspect, strength, height);
      object.scale.x = scale.x * effect.scaleX;
      object.position.y = position.y + effect.offsetY;
      object.rotateX(effect.pitch);
      noise.uniforms.amount.value = effect.grain; grain.visible = effect.grain > 0;
    },
    blank() { reset(); black.visible = true; },
    tick(t) { noise.uniforms.frame.value = Math.floor(t / 30); },
    dispose() { reset(); camera.remove(grain, black); geometry.dispose(); noise.dispose(); blackMaterial.dispose(); }
  };
}
