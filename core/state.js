// state.js
export const MAX = 5;

const LS_KEY = "dota2_outpick_state_v1";

export const state = {
  enemyQueue: [], // array of hero slugs (max 5)
};

export function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (Array.isArray(obj?.enemyQueue)) {
      state.enemyQueue = obj.enemyQueue.slice(0, MAX).filter(isNonEmptyString);
    }
  } catch {
    // ignore parse errors, keep defaults
  }
}

export function saveState() {
  try {
    const data = {
      enemyQueue: state.enemyQueue.slice(0, MAX).filter(isNonEmptyString),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // storage may be unavailable; ignore
  }
}

function isNonEmptyString(x) {
  return typeof x === "string" && x.length > 0;
}
