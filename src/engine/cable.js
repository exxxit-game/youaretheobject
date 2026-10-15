// A cable as one smooth tube through a list of points: it bends with a radius where a
// real cable would (over a table edge, onto the floor) instead of meeting at right
// angles like joined sticks. Points are world positions in metres along the cable's
// centre line; place them one radius above any surface the cable lies on.
// <a-entity cable="points: 0 0.845 -0.2, 0 0.845 -0.4; radius: 0.006"></a-entity>
AFRAME.registerComponent('cable', {
  schema: {
    points: { default: '' },
    radius: { default: 0.006 },
    color: { default: '#111' }
  },
  update() {
    this.remove();
    const pts = this.data.points.split(',').map((p) => {
      const [x, y, z] = p.trim().split(/\s+/).map(Number);
      return new THREE.Vector3(x, y, z);
    });
    if (pts.length < 2) return;
    // centripetal: no loops or overshoot between unevenly spaced points
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const segments = Math.max(16, Math.round(curve.getLength() * 160));
    this.mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, segments, this.data.radius, 8, false),
      new THREE.MeshStandardMaterial({ color: this.data.color, roughness: 0.6 })
    );
    this.el.setObject3D('mesh', this.mesh);
  },
  remove() {
    if (!this.mesh) return;
    this.el.removeObject3D('mesh');
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
});
