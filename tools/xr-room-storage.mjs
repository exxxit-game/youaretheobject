// Keep captures on the headset before ending XR, independently of the laptop link.
const DEFAULT_DATABASE = 'object-room-geometry';

function open(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('snapshots', { keyPath: 'id' });
      store.createIndex('storedAt', 'storedAt');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Capture database is blocked'));
  });
}

export async function storeGeometry(snapshot, database = DEFAULT_DATABASE) {
  const db = await open(database);
  const id = `${snapshot.sessionId}:${snapshot.referenceEpoch}:${snapshot.frameTimeMs}`;
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('snapshots', 'readwrite');
      transaction.objectStore('snapshots').put({ id, storedAt: Date.now(), snapshot });
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(transaction.error || new Error('Capture storage aborted'));
      transaction.onerror = () => reject(transaction.error);
    });
    const saved = await new Promise((resolve, reject) => {
      const request = db.transaction('snapshots').objectStore('snapshots').get(id);
      request.onsuccess = () => resolve(request.result?.snapshot);
      request.onerror = () => reject(request.error);
    });
    if (JSON.stringify(saved) !== JSON.stringify(snapshot)) throw new Error('Capture readback differs');
  } finally { db.close(); }
}

export async function latestGeometry(database = DEFAULT_DATABASE) {
  const db = await open(database);
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('snapshots').objectStore('snapshots').index('storedAt').openCursor(null, 'prev');
      request.onsuccess = () => resolve(request.result?.value.snapshot || null);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
