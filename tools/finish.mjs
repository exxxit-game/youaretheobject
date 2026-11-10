// Read-only evidence for the current Codex work branch. Never sends or merges.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectDelivery } from './delivery-check.mjs';

if (process.argv.length !== 3 || process.argv[2] !== 'check') {
  console.error('finish: use check; sending, pulling and merging are separate explicit actions');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = collectDelivery(root);
console.log(JSON.stringify(result, null, 2));
process.exit(result.checksComplete ? 0 : 1);
