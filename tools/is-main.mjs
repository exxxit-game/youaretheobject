import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export function isMain(url, entry = process.argv[1]) {
  if (!entry) return false;
  try {
    return fs.realpathSync.native(entry) === fs.realpathSync.native(fileURLToPath(url));
  } catch { return false; }
}
