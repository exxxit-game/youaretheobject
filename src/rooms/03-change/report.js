// Viewing-preview observations only: no JND, clinical inference or population comparison.
export function analyse(log) {
  return log.map(row => ({ aspect: row.aspect, strength: row.strength, answer: row.answer,
    responseMs: row.responseMs, phases: row.phases.map(p => ({ ...p })) }));
}
