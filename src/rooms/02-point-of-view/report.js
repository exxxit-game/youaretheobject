import { INITIAL_VIEW } from './view.js';

export function analyse(log) {
  const last = log[log.length - 1];
  return {
    view: last?.v ?? INITIAL_VIEW,
    frontSeen: log.some(entry => entry.k === 'front'),
    count: log.length,
    recent: log.slice(-4).map(entry => entry.k)
  };
}
