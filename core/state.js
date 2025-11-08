export const MAX = 5;

export const state = {
  enemyQueue: [],
};

export function loadState() {
  try {
    const saved = localStorage.getItem("outpick-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch (_) {}
}

export function saveState() {
  localStorage.setItem("outpick-state", JSON.stringify(state));
}
