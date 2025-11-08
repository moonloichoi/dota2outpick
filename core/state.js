// Simple app state (queue of 5 enemy heroes) + localStorage
export const MAX = 5;

export const state = {
  enemyQueue: [] // array of hero slugs
};

const LS_KEY = "d2outpick_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.enemyQueue)) {
      state.enemyQueue = parsed.enemyQueue.filter(x => typeof x === "string").slice(0, MAX);
    }
  } catch { /* noop */ }
}

export function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ enemyQueue: state.enemyQueue.slice(0, MAX) }));
  } catch { /* noop */ }
}
