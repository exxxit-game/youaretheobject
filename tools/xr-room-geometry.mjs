// WebXR mesh vertices are local to meshSpace. Keep each pose from the same XRFrame.
// Sources: immersive-web/real-world-meshing and Meta IWSDK Scene Understanding.
export function createGeometryCapture(sessionId) {
  const ids = new WeakMap();
  let next = 0;
  const id = object => {
    if (!ids.has(object)) ids.set(object, ++next);
    return ids.get(object);
  };
  const finite = (values, name) => {
    const copy = Array.from(values);
    if (!copy.every(Number.isFinite)) throw new Error(`${name} contains a non-finite number`);
    return copy;
  };
  const matrix = pose => {
    const copy = finite(pose.transform.matrix, 'matrix');
    if (copy.length !== 16) throw new Error('matrix must contain 16 values');
    return copy;
  };

  return (frame, referenceSpace, frameTimeMs, referenceEpoch = 0) => {
    const meshes = [], planes = [], skipped = [];
    for (const mesh of frame.detectedMeshes || []) {
      const objectId = id(mesh);
      const pose = frame.getPose(mesh.meshSpace, referenceSpace);
      if (!pose) { skipped.push({ kind: 'mesh', id: objectId, reason: 'pose unavailable' }); continue; }
      const vertices = finite(mesh.vertices, 'vertices');
      const indices = Array.from(mesh.indices);
      if (vertices.length % 3 || indices.length % 3) throw new Error('incomplete vertex or triangle');
      if (!indices.every(i => Number.isInteger(i) && i >= 0 && i < vertices.length / 3)) {
        throw new Error('triangle index outside the vertex array');
      }
      meshes.push({ id: objectId, label: mesh.semanticLabel || null,
        lastChangedTime: mesh.lastChangedTime, vertices, indices, matrix: matrix(pose) });
    }
    for (const plane of frame.detectedPlanes || []) {
      const objectId = id(plane);
      const pose = frame.getPose(plane.planeSpace, referenceSpace);
      if (!pose) { skipped.push({ kind: 'plane', id: objectId, reason: 'pose unavailable' }); continue; }
      const polygon = Array.from(plane.polygon, p => finite([p.x, p.y, p.z], 'polygon'));
      planes.push({ id: objectId, label: plane.semanticLabel || null,
        orientation: plane.orientation, lastChangedTime: plane.lastChangedTime,
        polygon, matrix: matrix(pose) });
    }
    return { schemaVersion: 1, sessionId, capturedAt: new Date().toISOString(), frameTimeMs,
      units: 'metres', referenceSpace: 'local-floor', referenceEpoch,
      matrixLayout: 'column-major, local object to reference space', meshes, planes, skipped };
  };
}
